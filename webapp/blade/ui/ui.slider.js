/*
******bug******
容器类组件，css传递是一个痛点
*/
define(['UIAbstractView', 'text!T_UISlider', 'UIScroll'], function (UIAbstractView, template, UIScroll) {

  return _.inherit(UIAbstractView, {
    propertys: function ($super) {
      $super();
      this.template = template;

      //当前选择id
      this.key = null;
      //滚动层的class，感觉没有意义
      this.className = '';
      this.curClass = 'current';
      this.data = [];
      //索引，内部以此为准
      this.index = 0;

      this.itemNum = 0;
      this.displayNum = 3;
      this.animatTime = 100;
      this.momentum = true;

      //是否需要循环功能
      this.needLoop = false;

      //该组件一定要设置宽高
      this.itemWidth = 0;
      this.itemHeight = 0;
      this.scrollWidth = 0;


      //选择时候的偏移量
      this.scrollOffset = 0;

      //滚动对象
      this.scroll = null;

      this.addEvents({
        'click .js_scroller>li': 'itemClickAction'
      });


      this.changed = function (item) {
        //        console.log(item);
      };

      this.itemClick = function (item) {
        //        console.log(item);
      };

    },

    getViewModel: function () {
      return this._getDefaultViewModel(['key', 'className', 'curClass', 'data', 'index', 'itemFn', 'firstLoopItem', 'lastLoopItem']);
    },

    itemClickAction: function (e) {
      var el = $(e.currentTarget);
      var index = el.attr('data-index');
      this.setIndex(index);
      this.itemClick.call(this, this.getSelected());
    },

    initialize: function ($super, opts) {
      $super(opts);
    },

    resetPropery: function ($super) {
      $super();
      this._resetLoop();
      this._resetNum();
      this._resetIndex();
    },

    _resetLoop: function () {
      if (!this.needLoop) return;
      this.firstLoopItem = $.extend({}, this.data[this.data.length - 1], true);
      this.lastLoopItem = $.extend({}, this.data[0], true);
    },

    //这里差一个index值判断**************************
    _resetIndex: function () {
      if (!this.key) return;
      for (var i = 0, len = this.data.length; i < len; i++) {
        if (this.key == this.data[i].id) {
          this.index = i;
          break;
        }
      }
    },

    _resetNum: function () {
      //      this.displayNum = this.displayNum % 2 == 0 ? this.displayNum + 1 : this.displayNum;
      this.itemNum = this.data.length;
    },

    initElement: function () {

      //几个容器的高度必须统一
      this.swrapper = this.$('.js_wrapper');
      this.scroller = this.$('.js_scroller');
    },

    initSize: function () {
      var item = this.scroller.find('li').eq(0);
      var itemOffset = item.offset();

      //找到包裹层，并求其高度
      var parent = this.wrapper;
      var ph = (parent[0] && parent[0].clientHeight) || parent.height();
      var _itemNum = this.needLoop ? this.itemNum + 2 : this.itemNum;
      this.wrapeWidth = (this.swrapper[0] && this.swrapper[0].clientWidth) || this.swrapper.width();

      this.itemWidth = parseInt(this.wrapeWidth / this.displayNum);

      this.scroller.find('li').width(this.itemWidth);

      this.scroller.width(this.itemWidth * _itemNum);

      this.itemHeight = this.scroller.height();

      //无论如何itemHeight都要相等才行
      //      if (ph != this.itemHeight) this.itemHeight = ph;
      this.itemHeight = ph;

      this.scroller.find('li').height(this.itemHeight);

      //样式还需调整
      this.swrapper.css({
        height: this.itemHeight + 'px'
      });

      this.scrollOffset = ((this.displayNum - 1) / 2) * (this.itemWidth);
    },

    reload: function (data) {
      this.setOpts(data);
      if (this.scroll) {
        this.scroll.destroy();
        this.scroll = null;
      }
      this.refresh();
    },

    _initScroll: function () {
      if (this.scroll) {
        this.scroll.destroy();
      }

      this.scroll = new UIScroll({
        scrollbars: false,
        scrollOffset: this.scrollOffset,
        scrollType: 'x',
        step: this.itemWidth,
        wrapper: this.swrapper,
        bounceTime: 200,
        momentum: this.momentum,
        scroller: this.scroller

      });

      //重置包裹层尺寸，一定要是一个
      //      this.swrapper.width(this.itemWidth * this.displayNum);

      this.scroll.on('scrollEnd', $.proxy(function () {
        var index;
        //处理循环滚动
        if (this.needLoop) {
          index = this.getIndexByPosition();
          if (index == this.itemNum) {
            this.setIndex(0, null, null, 0);
            return;
          }
          if (index == -1) {
            //多增了两项
            this.setIndex(this.itemNum - 1, null, null, 0);
            return;
          }
        }
        this.setIndex(this.getIndexByPosition(), true);
      }, this));

      //为了解决鼠标离屏幕时导致的问题
      this.scroll.on('scrollCancel', $.proxy(function () {
        this.setIndex(this.getIndexByPosition(), false);
      }, this));

      //解决resize问题
      $(window).off('.silder' + this.id);
      $(window).on('resize.silder' + this.id, $.proxy(function () {
        this.resizeRefresh();
      }, this));

    },

    //当window.resize事件时候不需要重新搞页面
    resizeRefresh: function () {
      this.initSize();
      this._initScroll();
      this.adjustPosition();
      this.resetCss();
      this.resetIndex();
    },

    adjustPosition: function (hasAnimate, time) {
      if (!this.scroll) return;
      var index = this.index, _dis, _time = 0;

      if (this.needLoop) {
        if (index === 0) {
          index = 1;
        } else {
          index++;
        }
      }

      _dis = (this.itemWidth * index) * (-1) + this.scrollOffset;
      if (hasAnimate) _time = this.animatTime;
      if (_.isNumber(time)) _time = time;

      this.scroll.scrollTo(_dis, 0, _time);
    },

    resetCss: function () {
      this.$('li').removeClass('current');
      this.$('li[data-index="' + this.index + '"]').addClass('current');
    },

    resetIndex: function () {
      this.setIndex(this.index, true, true);
    },

    //根据位置信息重新设置当前选项
    getIndexByPosition: function () {
      var pos = this.scroll.x - this.scrollOffset;
      var index = Math.round(Math.abs(pos) / this.itemWidth);

      //如果要循环的话，需要前进一
      if (this.needLoop) index--;

      return index;
    },

    getIndex: function () {
      return this.index;
    },

    setIndex: function (i, noPosition, noEvent, time) {
      if (typeof noPosition == 'undefined' && i == this.index) noPosition = true;

      //index值是否改变
      var isChange = this.index != i;
      this.index = i;

      if (!noPosition) this.adjustPosition(true, time);
      this.resetCss();
      if (noEvent !== true && isChange) {
        this.changedAction && this.changedAction.call(this, this.getSelected());
        this.changed && this.changed.call(this, this.getSelected());
      }
    },

    setId: function (id) {
      if (!id) return;
      var index = -1, i, len;
      for (i = 0, len = this.data.length; i < len; i++) {
        if (this.data[i].id == id) { index = i; break; }
      }
      if (index == -1) return;
      this.setIndex(index, false);
    },

    getId: function () {
      return this.getSelected().id;
    },

    getSelected: function () {
      return this.data[this.index];
    },

    addEvent: function ($super) {
      $super();

      //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
      this.on('onShow', function () {
        this.initSize();
        this._initScroll();
        this.adjustPosition();
        this.resetCss();
        this.resetIndex();

      }, 1);

      this.on('onHide', function () {
        if (this.scroll) {
          this.scroll.destroy();
          this.scroll = null;
          $(window).off('.silder' + this.id);
          this.freeInstance();
        }
      });
    }
  });

});
