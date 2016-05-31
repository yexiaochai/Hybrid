
define(['UIHeader', 'text!T_APPUIHeader'], function (UIHeader, template) {

    return _.inherit(UIHeader, {

        propertys: function ($super) {
            $super();
            this.template = template;
        },

        hide: function ($super) {
            $super();
            //      this.wrapper.hide();
        },

        show: function ($super) {
            $super();
        }

    });
});
