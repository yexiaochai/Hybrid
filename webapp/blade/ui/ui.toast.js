
/*
用于继承的类，会自动垂直居中

*/
define(['UILayer', 'text!T_UIToast'], function (UILayer, template) {


  return _.inherit(UILayer, {

    resetDefaultProperty: function ($super) {
      $super();
      this.template = template;
      this.content = '';

      this.hideSec = 2500;
      this.hasPushState = false;
      this.TIMERRES = null;

      this.hideAction = function () {
      };

    },

    getViewModel: function () {
      return this._getDefaultViewModel(['content']);
    },

    addEvent: function ($super) {
      $super();

      this.on('onShow', function () {
        this.mask.$el.addClass('cm-overlay--transparent');

        //显示指定时间后需要关闭
        if (this.TIMERRES) clearTimeout(this.TIMERRES);
        this.TIMERRES = setTimeout($.proxy(function () {
          this.hide();
        }, this), this.hideSec);
      });

      this.on('onHide', function () {
        //显示指定时间后需要关闭
        if (this.TIMERRES) clearTimeout(this.TIMERRES);
        this.hideAction();
      });
    }
  });


});
