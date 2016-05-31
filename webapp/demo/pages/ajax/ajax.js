define([
    'BaseView',
    'text!PagePath/ajax/tpl.layout.html',
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
                    this.showLoading();

_.requestHybrid({
    tagname: 'get',
    param: {
        url: 'http://api.kuai.baidu.com/city/getstartcitys',
        param: {a: 1, b: 2}
    },

    callback: function (data) {
        scope.hideLoading();
        scope.$('.js-content').html(JSON.stringify(data));
    }
});

                },
                'click .js-btn1': function () {
                    var scope = this;

                    this.showLoading();
                    _.requestHybrid({
                        tagname: 'get',
                        param: {
                            url: 'http://api.kuai.baidu.com/city/getstartcitys',
                            param: {a: 1, b: 2}
                        },
                        callback: function (data) {
                            scope.hideLoading();
                            scope.$('.js-content').html(JSON.stringify(data));
                        }
                    });
                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: 'ajax Demo',
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
