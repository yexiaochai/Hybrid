
define(['UIAbstractView', 'UIMask'], function (UIAbstractView, UIMask) {
  'use strict';

  return _.inherit(UIAbstractView, {
    //默认属性
    propertys: function ($super) {
      $super();
      this.mask = new UIMask({
        onCreate: function () {
          this.$el.addClass('cm-page-view-mask');
        }
      });

      //装载的view实例
      this.viewId = null;
      this.viewIns = null;
      this.viewPath = null;
      this.hasRequest = false;
      this._viewdata_ = null;

      this.needAnimat = false;

      this.animateInClass = 'cm-down-in';
      this.animateOutClass = 'cm-down-out';

    },

    resetPropery: function ($super) {
      $super();
      this._setAnimat();
    },

    _setAnimat: function () {
      var scope = this;
      if (this.needAnimat) {
        if (!this.animateShowAction) {
          this.animateShowAction = function (el) {
            scope._safeAnimat(el, scope.animateInClass, 'show');
          };
        }
        if (!this.animateHideAction) {
          this.animateHideAction = function (el) {
            scope._safeAnimat(el, scope.animateOutClass, 'hide');
          };
        }
      }

    },

    //安全的执行animationEnd相关事件，防止class不存在而依赖animationEnd的回调不执行问题
    _safeAnimat: function (el, classname, flag) {
      var isTrigger = false;
      if (flag == 'show') el.show();
      el.addClass(classname);
      //防止class不存在的情况下导致动画不执行，而程序出错
      el.one($.fx.animationEnd, function () {
        isTrigger = true;
        el.removeClass(classname);
        if (flag == 'hide') el.hide();
      });

      setTimeout(function () {
        if (isTrigger) return;

        el.removeClass(classname);
        el.off($.fx.animationEnd);
        if (flag == 'hide') el.hide();

      }, 350);
    },


    createRoot: function (html) {
      //UI的根节点
//      this.$el = $('<div class="cm-page-view" style="display: none; " id="' + this.id + '"><div class="spinner" style="  margin: 100px auto;"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div>');
        this.$el = $('<div class="cm-page-view" style="display: none; " id="' + this.id + '"><div class="spinner" style="  margin: 5rem auto;"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div>');
      this.wrapper.append(this.$el);
    },

    setViewData: function (_viewdata_) {
      if (!this.viewIns) return;
      this.viewIns.setOption(_viewdata_);
    },

    initViewIns: function () {
      var scope = this;
      if (this.viewIns) {
        this.viewIns.show();
        return;
      }
      if (this.hasRequest) return;
      if (!this.viewPath) return;
      this.hasRequest = true;

      require([this.viewPath], function (BaseView) {
        var View = _.inherit(BaseView, scope._viewdata_), k;
        var opts = {
          viewId: scope.viewId,
          wrapper: scope.$el
        };
        for (k in scope._viewdata_) {
          if (typeof scope._viewdata_[k] != 'fuction')
            opts[k] = scope._viewdata_[k];
        }

        scope.viewIns = new View(opts);
        scope.viewIns.show();
      });

    },

    onPageviewShow: function () {
      window.scrollTo(0, 0);
      $('.cm-page-wrap').hide();
    },

    onPageviewHide: function () {
      $('.cm-page-wrap').show();

    },

    addEvent: function ($super) {
      $super();

      this.on('onPreShow', function () {
        this.mask.show();
      });

      this.on('onShow', function () {
        this.setzIndexTop();
        this.initViewIns();
        this.onPageviewShow();
      });

      this.on('onHide', function () {
        //        if (this.viewIns) this.viewIns.hide();
        this.mask.hide();
        this.onPageviewHide();
      });
    }

  });


});
