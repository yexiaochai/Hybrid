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

//图片预览
_.requestHybrid({
    tagname: 'gallery',
    param: {
        index: 1,                  // 当前图片的位置（从0开始）
        imgs: ['https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3989549683,2209638352&fm=21&gp=0.jpg', 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=442231815,540611561&fm=21&gp=0.jpg', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2761864997,1285877088&fm=21&gp=0.jpg', 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=187384747,1056525225&fm=23&gp=0.jpg']   // 图片地址数组
    }
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
