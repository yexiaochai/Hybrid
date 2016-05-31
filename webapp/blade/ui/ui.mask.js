
define(['UIAbstractView'], function (UIAbstractView) {
  'use strict';

  return _.inherit(UIAbstractView, {
    //默认属性
    propertys: function ($super) {
      $super();
      this.resetDefaultProperty();
    },

    resetDefaultProperty: function () {
      this.events = {};
//      this.template = '';
      this.animateOutClass = 'cm-overlay-out';

      //阻止浏览器默认事件，这里是阻止滚动
      this.addEvents({
        'touchmove': '_preventDefault'
      });
    },

    setRootStyle: function () {
      this.$el.addClass('cm-overlay');
    },

    addEvent: function ($super) {
      $super();

      this.on('onShow', function () {
        this.setRootStyle();
        this.setzIndexTop();
      });

    }

  });


});
