
define([], function () {
    'use strict';

    return _.inherit({

        propertys: function () {
        },

        //全部更新
        set: function (opts) {
            if (!opts) return;
            var i, len, item;

            var scope = opts.view || this;

            //处理返回逻辑
            if (opts.back && typeof opts.back == 'function') {
                BNJS.page.onBtnBackClick({
                    callback: $.proxy(opts.back, scope)
                });
            } else {

                BNJS.page.onBtnBackClick({
                    callback: function () {
                        if (history.length > 0)
                            history.back();
                        else
                            BNJS.page.back();
                    }
                });
            }

            //处理title
            if (typeof opts.title == 'string') {
                BNJS.ui.title.setTitle(opts.title);
            }

            //删除右上角所有按钮【1.3】
            //每次都会清理右边所有的按钮
            BNJS.ui.title.removeBtnAll();

            //处理右边按钮
            if (typeof opts.right == 'object' && opts.right.length) {
                for (i = 0, len = opts.right.length; i < len; i++) {
                    item = opts.right[i];
                    BNJS.ui.title.addActionButton({
                        tag: _.uniqueId(),
                        text: item.value,
                        callback: $.proxy(item.callback, scope)
                    });
                }
            }
        },

        show: function () {

        },

        hide: function () {

        },

        //只更新title
        update: function (title) {

        },

        initialize: function () {
            //隐藏H5头
            $('#headerview').hide();
            this.propertys();
        }

    });

});
