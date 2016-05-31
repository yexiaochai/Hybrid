/*
******bug******
弹出层应该在外部有一个class做初始定位，而不用每次都reposition
所有弹出层的基类，用于继承的类，默认会自动垂直居中

*/
define(['UIAbstractView', 'UIMask'], function (UIAbstractView, UIMask) {
  'use strict';

  return _.inherit(UIAbstractView, {

    //默认属性
    propertys: function ($super) {
      $super();
      this.mask = new UIMask();
      this.resetDefaultProperty();

    },

    resetDefaultProperty: function () {

      this.mask.resetDefaultProperty();

      this.needMask = true;

      this.needAnimat = true;

      //需要点击蒙版删除
      this.maskToHide = true;

      //需要居中定位
      this.needReposition = true;

      this.animateInClass = 'cm-up-in';
      this.animateOutClass = 'cm-up-out';

      this.animateShowAction = null;
      this.animateHideAction = null;

      //所有弹出层类组件，统一touchmove时候神马也不干
      this.addEvents({
        'touchmove': '_preventDefault'
      });

    },

    resetPropery: function ($super) {
      $super();
      this._setAnimat();
      this._setMaskEvent();
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

      //如果存在关闭动画接口，需要为mask加动画
      if (this.animateHideAction) {
        this.mask.needAnimat = true;
        this.mask.animateHideAction = function (el) {
          scope._safeAnimat(el, scope.mask.animateOutClass, 'hide');
        };
      } else {
        this.mask.animateHideAction = null;
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

    _setMaskEvent: function () {
      var scope = this;
      //这里处理是否点击关闭蒙版的操作
      if (this.needMask && this.maskToHide) {
        //mask显示之前为mask绑定关闭事件，一次执行便不予理睬了
        this.mask.addEvents({
          'click': function () {
            scope.hide();
          }
        });
      }
    },

    addEvent: function () {

      this.on('onPreShow', function () {
        if (this.needMask) this.mask.show();
      });

      this.on('onShow', function () {
        this.setzIndexTop();
        if (this.needReposition) this.reposition();

      });

      this.on('onHide', function () {
        this.mask.hide();
      });

      this.on('onDestroy', function () {
        this.mask.destroy();
      });

    },

    reposition: function () {

      this.$el.css({
        'position': 'fixed',
        'left': '50%',
        'top': '50%',
        'margin-left': -(this.$el.width() / 2) + 'px',
        'margin-top': -(this.$el.height() / 2) + 'px'
      });
    }

  });

});
