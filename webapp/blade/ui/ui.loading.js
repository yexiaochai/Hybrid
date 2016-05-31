
/*
用于继承的类，会自动垂直居中

*/
define(['UILayer', 'text!T_UILoading'], function (UILayer, template) {


  return _.inherit(UILayer, {

    resetDefaultProperty: function ($super) {
      $super();
      //html模板
      this.template = template;
      //重写Type定义
      this.type = "loading";
      this.loadingTimer = null;
      this.needAnimat = false;
      this.maskTimer = null;
      this.maskToHide = false;


    },

    initElement: function () {
      this.d_loding = this.$('.js_loading');
    },

    _showLoading: function () {
      this.d_loding.hide();
      if (this.loadingTimer) clearTimeout(this.loadingTimer);
      this.loadingTimer = setTimeout($.proxy(function () {
        this.d_loding.show();
      }, this), 100);

      if (this.maskTimer) clearTimeout(this.maskTimer);
      //this.maskTimer = setTimeout($.proxy(function () {
      //  this.mask.$el.removeClass('cm-overlay--transparent');
      //}, this), 300);

    },

    _hideLoading: function () {
      if (this.loadingTimer) clearTimeout(this.loadingTimer);
      if (this.maskTimer) clearTimeout(this.maskTimer);
      this.d_loding.hide();
    },

    addEvent: function ($super) {
      $super();

      this.on('onShow', function () {
        this.mask.$el.addClass('cm-overlay--transparent');
        this._showLoading();

      });

      this.on('onHide', function () {
        this._hideLoading();
      });
    },

    reposition: function ($super) {
      this.$el.css({
//        width: '58px',
//        height: '58px'
          width: '2.9rem',
          height: '2.9rem'
      });
      $super();

    }

  });


});
