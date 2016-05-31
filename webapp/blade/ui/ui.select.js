define(['UIAbstractView', 'text!T_UISelect', 'UIScroll'], function (UIAbstractView, template, UIScroll) {
  /*
  该组件使用时，其父容器一定是显示状态，如果不是显示状态，高度计算会失效
  */

  return _.inherit(UIAbstractView, {
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;

      //默认datamodel
      this.curClass = 'active';
      this.data = [];
      this.key = null;
      this.index = 0;


      this.animatTime = 100;
      this.stepTime = 150;
      this.itemNum = this.data.length;

      //这里便只有一个接口了
      this.displayNum = 5;

      //选择时候的偏移量
      this.scrollOffset = 0;

      //滚动对象
      this.scroll = null;

      this.changed = function (item) {
        console.log(item);
      };

    },

    getViewModel: function () {
      return this._getDefaultViewModel(['curClass', 'data', 'key', 'index']);
    },

    //要求唯一标识，根据id确定index
    resetPropery: function () {
      this._resetNum();
      this._resetIndex();
    },

    _resetIndex: function () {
      if (!this.key) return;
      for (var i = 0, len = this.data.length; i < len; i++) {
        if (this.key === this.data[i].id) {
          this.index = i;
          break;
        }
      }
    },

    _resetNum: function () {
      this.displayNum = this.displayNum % 2 == 0 ? this.displayNum + 1 : this.displayNum;
      this.itemNum = this.data.length;
    },

    initElement: function () {

      //几个容器的高度必须统一
      this.swrapper = this.$('.js_wrapper');
      this.scroller = this.$('.js_scroller');

    },

    initSize: function () {

      //偶尔不能正确获取高度，这里要处理
      //      if (this.itemHeight == 0) {
      this.itemHeight = parseInt(window.getComputedStyle && getComputedStyle(this.scroller.find('li').eq(0)[0]).height);
      this.scroller.height(this.itemHeight * this.itemNum);
      //      }
      this.swrapper.height(this.itemHeight * this.displayNum);
      this.scrollOffset = ((this.displayNum - 1) / 2) * (this.itemHeight);
    },

    //修正位置信息
    adjustPosition: function (hasAnimate) {
      if (!this.scroll) return;
      if (this.index < 0) this.index = 0
      if (this.index > this.itemNum - 1) this.index = this.itemNum - 1;

      var index = this.index, _top, time = 0;
      //index数据验证
      _top = (this.itemHeight * index) * (-1) + this.scrollOffset;
      if (hasAnimate) time = this.animatTime;
      this.scroll.scrollTo(0, _top, time);
    },

    _initScroll: function () {
      if (this.scroll) {
        this.scroll.refresh();
        return;
      }

      this.scroll = new UIScroll({
        scrollbars: false,
        scrollOffset: this.scrollOffset,
        step: this.itemHeight,
        wrapper: this.swrapper,
        bounceTime: 200,
        scroller: this.scroller

      });

      this.scroll.on('scrollEnd', $.proxy(function () {
        this.setIndex(this.getIndexByPosition(), true)
      }, this));

      //为了解决鼠标离屏幕时导致的问题
      this.scroll.on('scrollCancel', $.proxy(function () {
        this.setIndex(this.getIndexByPosition(), false)
      }, this));

    },

    reload: function (data) {
      if (data) this.setOption(data);
      if (this.scroll) {
        this.scroll.destroy();
        this.scroll = null;
      }

      //执行reload的话，数据源便发生了变化
      this._dataChanged = true;

      this.refresh();
    },

    //检测当前选项是否可选，首次不予关注
    checkDisable: function (dir) {
      dir = dir || 'down'; //默认向下搜索
      var isFind = false, index = this.index;
      if (this.data[index] && (typeof this.data[index].disabled != 'undefined' && this.data[index].disabled == false)) {
        //向下的情况
        if (dir == 'up') {
          this.index = this._checkSelectedDown(index);
          if (typeof this.index != 'number') this.index = this._checkSelectedUp(index);
        } else {
          this.index = this._checkSelectedUp(index);
          if (typeof this.index != 'number') this.index = this._checkSelectedDown(index);
        }
      }
      if (typeof this.index != 'number') this.index = index;

    },

    /**
    * @class _checkSelectedUp
    * @param index {int}    索引
    * @description 向上搜索
    */
    _checkSelectedUp: function (index) {
      var isFind = false;
      for (var i = index; i != -1; i--) {
        if (this.data[i] && (typeof this.data[i].disabled == 'undefined' || this.data[i].disabled == true)) {
          index = i;
          isFind = true;
          break;
        }
      }
      return isFind ? index : null;
    },

    /**
    * @class _checkSelectedDown
    * @param index {int}    索引
    * @description 向下搜索
    */
    _checkSelectedDown: function (index) {
      var isFind = false;
      for (var i = index, len = this.data.length; i < len; i++) {
        if (this.data[i] && (typeof this.data[i].disabled == 'undefined' || this.data[i].disabled == true)) {
          index = i;
          isFind = true;
          break;
        }
      }
      return isFind ? index : null
    },

    //这里要处理不可选的状况
    /*
    这段逻辑比较复杂，处理的逻辑较多
    1 每次赋值时候判断是否改变，改变需要触发changed事件
    2 每次赋值还得判断当前选项是否是disabled的，如果是disabled的话还得重置index
    3 以上逻辑会加重changed触发事件以及重新设置index的复杂度

    */
    setIndex: function (i, noPosition, noEvent) {
      if (typeof noPosition == 'undefined' && i == this.index) noPosition = true;
      var tmpIndex = i;
      var tmpIndex2;

      //index值是否改变
      var isChange = this.index != i;
      var dir = i > this.index ? 'up' : 'down';

      i = parseInt(i);
      if (i < 0 || i >= this.itemNum) return;

      tmpIndex2 = this.index;

      this.index = i;
      this.checkDisable(dir);

      //被改变过了
      if (tmpIndex2 != this.index) {
        isChange = true;
      } else {
        isChange = false;
      }

      if (tmpIndex != this.index) {
        noPosition = false;
      }

      if (!noPosition) this.adjustPosition(true);
      this.resetCss();

      //如果数据源发生变化一定会执行changed事件，否则一定会判断原有逻辑
      if (this._dataChanged) {
        this.triggerChangedAction();
        this._dataChanged = false;
      } else {
        if (noEvent !== true && isChange) this.triggerChangedAction();
      }
    },

    //触发change事件
    triggerChangedAction: function () {
      this.changed && this.changed.call(this, this.getSelected());
    },

    resetCss: function () {
      this.$('li').removeClass('active');
      this.$('li[data-index="' + this.index + '"]').addClass('active');
    },

    resetIndex: function () {
      this.setIndex(this.index, true, true);
    },

    getIndex: function () {
      return this.index;
    },

    setId: function (id) {
      if (!id) return;
      var index = -1, i, len;
      for (i = 0, len = this.data.length; i < len; i++) {
        if (this.data[i].id == id) { index = i; break; }
      }
      if (index == -1) return;
      this.index = index;
      this.setIndex(index, false);
    },

    getId: function () {
      return this.getSelected().id;
    },

    getSelected: function () {
      return this.data[this.index];
    },

    //根据位置信息重新设置当前选项
    getIndexByPosition: function () {
      var pos = this.scroll.y - this.scrollOffset;
      var index = Math.abs(pos) / this.itemHeight;
      return Math.round(index);
    },

    addEvent: function ($super) {
      $super();

      //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
      this.on('onShow', function () {
        this.initSize();
        this._initScroll();

        this.adjustPosition();
        this.resetCss();
        //防止初始化定义index为不可选index
        this.resetIndex();

      }, 1);

      this.on('onHide', function () {
        if (this.scroll) {
          this.scroll.destroy();
          this.scroll = null;
        }
      });
    }

  });


});
