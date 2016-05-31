
/*
用于继承的类，会自动垂直居中

*/
define(['UILayer', 'text!T_UIAlert'], function (UILayer, template) {
  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
    },

    resetDefaultProperty: function ($super) {
      $super();

      this.maskToHide = false;

      //html模板
      this.template = template;

      //默认数据
      this.title = '';
      this.content = '';
      this.btns = [
          { name: '确定', className: 'js_ok' }
        ];

      //事件机制
      this.addEvents({
        'click .js_ok': 'okAction',
        'click .js_cancel': 'cancelAction'
      });

      this.okAction = function () {
        this.hide();
      };

      this.cancelAction = function () {
        this.hide();
      };
    },

    getViewModel: function () {
      return this._getDefaultViewModel(['title', 'content', 'btns']);
    },

    reposition: function ($super) {
      this.$el.css({
//        width: '280px'
          width: '14rem'
      });
      $super();

    }

  });

});
