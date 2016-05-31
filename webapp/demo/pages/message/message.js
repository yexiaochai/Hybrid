define([
    'BaseView',
    'text!PagePath/message/tpl.layout.html',
    'text!StylePath/common.css'
], function (AbstractView,
             layoutHtml,
             commonStyle) {

    return _.inherit(AbstractView, {
        propertys: function ($super) {

            $super();

            this.template = layoutHtml;
            this.commonstyle = commonStyle;

            this.events = {
                'click .js-btn0': function () {
                    var scope = this;

                    _.requestHybrid({
                        tagname: 'showpageview',
                        param: {
                            src: 'http://sandbox.runjs.cn/show/imbacaz7',
                            width: '200',
                            height: '200',
                            events: {
                                clickAction: function (val) {
                                    scope.showToast(111);
                                }
                            }
                        }
                    });
                },
                'click .js-btn1': function () {


                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: '组件通信 Demo',
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
