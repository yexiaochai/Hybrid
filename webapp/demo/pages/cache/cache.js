define([
    'BaseView',
    'text!PagePath/cache/tpl.layout.html',
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
                    /*
                    用户点击系统会回到大首页,并且准备拉取更新
                    因为这里没有server的配合暂时读取这个更新:http://yexiaochai.github.io/Hybrid/webapp/hybrid_ver.json
                     {
                     "blade": "1.0.0",
                     "static": "1.0.0",
                     "demo": "1.0.0"
                     }
                     只要远端版本号比Native存的版本大,便会拉取对应频道压缩包做更新:
                     http://yexiaochai.github.io/Hybrid/webapp/blade.zip
                     http://yexiaochai.github.io/Hybrid/webapp/static.zip
                     http://yexiaochai.github.io/Hybrid/webapp/demo.zip
                     */
                    //拉取更新包
                    _.requestHybrid({
                        tagname: 'checkver'
                    });
                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: '拉取更新 Demo',
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
