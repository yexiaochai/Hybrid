define([
    'BaseView',
    'text!PagePath/img/tpl.layout.html',
    'text!StylePath/common.css'
], function (AbstractView,
             layoutHtml,
             commonStyle) {

    return _.inherit(AbstractView, {
        propertys: function ($super) {

            $super();
            var scope = this;

            this.template = layoutHtml;
            this.commonstyle = commonStyle;

            this.events = {
                'click .js-btn01': function () {

                    /*
                    关闭当前页面,回到native上一步操作
                     */
                    _.requestHybrid({
                        tagname: 'closeWindow'
                    });

                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: '图片 Demo',
                back: function () {
                    this.back();
                }
            };
            this.header.set(opts);
        },

        initElement: function () {

        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {


            });
        }

    });

});
