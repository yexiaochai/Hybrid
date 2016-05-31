
/*
* 下载banner条

*/
define(['UIAbstractView', 'AbstractStore', 'text!T_UIDownload'], function (UIAbstractView, AbstractStore, template) {
    var downloadStore = _.inherit(AbstractStore, {
          //默认属性
          propertys: function ($super) {
            $super();
            this.key = 'CM_DOWNLOAD';
            this.lifeTime = '0.5D'; //缓存时间
          }
    });
    return _.inherit(UIAbstractView, {
        propertys: function ($super) {
            $super();
            var dView = $('#downloadview');
             
            if (!dView[0]) {
                return;
            }
            this.wrapper = this.$el = dView;
            this.events = {
                'click .down-btn-download': 'toDownload',
                'click .down-btn-close': 'toCloseBanner',
                'click .down-app-text': 'toDownload'
            }
            this.downloadStore = downloadStore.getInstance();
            this.initBanner();    
        },
        initBanner: function () {
            var key = this.downloadStore.get();
            if (!key) {
                this.wrapper.html(template);
                this.bindEvents();
            } else {
                this.wrapper.hide();
            }
        },
        toCloseBanner: function () {
            this.wrapper.hide();
            this.downloadStore.set(true);
        },

        toDownload: function () {
            var url = 'http://downpack.baidu.com/baidubus_AndroidPhone_1012979e.apk';
            if ($.os.ios) {
                url = 'https://itunes.apple.com/cn/app/bai-du-kuai-xing/id1000154668';
            }
            location.href = url;
        }
    });

});
