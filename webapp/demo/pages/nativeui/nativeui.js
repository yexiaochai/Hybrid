define([
    'BaseView',
    'text!PagePath/nativeui/tpl.layout.html',
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

                },
                'click .js-btn02': function () {

//唤起输入文字的软键盘
_.requestHybrid({
    tagname: 'showKeyboard',
    param: {
        //键盘按钮文案
        btnText: '确定',
        textMin: 20, //文字要求最少输入字符数
        textMax: 500 //文字要求最多输入字符数
    },
    //输入结束的回调或者说点击发送时候的回调
    callback: function (data) {
        var content = data.content;//文字内容
        scope.$('js-val01').html(content);
    }
});

                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: '分享 Demo',
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
