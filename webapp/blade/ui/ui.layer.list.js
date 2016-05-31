define(['UILayer', 'text!T_UILayerList', 'UIScroll'], function (UILayer, template, UIScroll) {


  return _.inherit(UILayer, {

    resetDefaultProperty: function ($super) {
      $super();

      this.classname = 'cm-layer-list';
      this.template = template;
      this.animateInClass = 'cm-down-in';
      this.animateOutClass = 'cm-down-out';
      this.curClass = 'active';

      this.list = [];
      this.cancelText = '取消';
      this.index = -1;
      this.displayNum = 5;
      this.selectedId = null;

      this.addEvents({
        'click .js_cancel': 'cancelAction',
        'click .js_item': 'itemAction'
      });

      this.onItemAction = function (data, index, e) {
      };

    },

    getViewModel: function () {
      return this._getDefaultViewModel(['list', 'cancelText', 'index', 'curClass', 'itemFn', 'title']);
    },

    //要求唯一标识，根据id确定index
    resetPropery: function ($super) {
      $super();

      this._resetNum();
    },

    _resetNum: function () {
      //      this.displayNum = this.displayNum % 2 == 0 ? this.displayNum + 1 : this.displayNum;
      this.itemNum = this.list.length;

    },

  resetPosition: function () {
      if (this.index < 0 || this.index > this.list.length) return;

      if (!this.scroll) return;
      var index = this.index, _top;
      if (this.itemNum - index < this.displayNum) index = this.itemNum - this.displayNum;

      _top = (this.itemHeight * index) * (-1);
      this.scroll.scrollTo(0, _top);
    },

    setIndex: function (i, position) {
      if (i < 0 || i > this.list.length) return;
      this.index = i;
      this.$('li').removeClass(this.curClass);
      this.$('li[data-index="' + i + '"]').addClass(this.curClass);
      if (position) this.resetPosition();

    },

    cancelAction: function (e) {
      this.hide();
    },

    itemAction: function (e) {
      var el = $(e.currentTarget);
      if (el.hasClass('disabled')) return;

      var index = el.attr('data-index');
      var data = this.list[index];
      this.setIndex(index);
      this.onItemAction.call(this, data, index, e);

    },

    //弹出层类垂直居中使用
    reposition: function () {
      this.$el.css({
        'position': 'fixed',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        'width': '100%',
        'left': '0',
        'bottom': '0'
      });
    },

    initElement: function () {
      this.swrapper = this.$('.js_wrapper');
      this.scroller = this.$('.js_scroller');

    },

    initSize: function () {
      var num = this.displayNum;
      this.sheight = this.scroller.height();
      this.itemHeight = parseInt(this.sheight / this.itemNum);
      if (num > this.itemNum) num = this.itemNum;
      this.swrapper.height(this.itemHeight * num);

    },

    addEvent: function ($super) {
      $super();

      //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
      this.on('onShow', function () {
        this.initSize();
        if (this.scroll && this.scroll.destory) this.scroll.destory();
        if (this.itemNum > this.displayNum) {
          this.swrapper.css({ 'overflow': 'hidden', 'position': 'absoulute' });
          this.scroller.css('position', 'absoulute');
          this.scroll = new UIScroll({
            wrapper: this.swrapper,
            scroller: this.scroller
          });
          this.resetPosition();
        }

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
