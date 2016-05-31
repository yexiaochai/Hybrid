define(['UILayer', 'text!T_UIScrollLayer', 'UIScroll'], function (UILayer, template, UIScroll) {
    'use strict';

    return _.inherit(UILayer, {

        resetDefaultProperty: function ($super) {
            $super();
            this.template = template;

            this.title = '';
            this.html = '';

            this.height = $(window).height() * 0.6;

            this.scrollOpts = {};

            //当容器高度比设置高度小时是否延展高度
            this.fixedHeight = false;
            this.addEvents({
                'click .js_close': 'closeAction'

            });

            this.onCloseAction = function () { };

        },

        closeAction: function () {
            this.hide();
            this.onCloseAction.call(this);
        },

        getViewModel: function () {
            return this._getDefaultViewModel(['title', 'html']);
        },

        initElement: function () {
            this.d_wrapper = this.$('.js_wrapper');
            this.d_scoller = this.$('.js_scroller');
        },

        initScroll: function () {
            if (!this.html) return;
            this.$el.css({
                '-webkit-box-sizing': 'border-box',
                'box-sizing': 'border-box',
                'padding': '.5rem',
                'width': '100%'
            });
            if (this.d_wrapper.height() < this.height) {
                if (this.fixedHeight)
                    this.d_wrapper.css({ 'height': this.height + 'px' });
                return;
            }
            // fixed by zzx
            this.d_wrapper.css({ 'overflow': 'hidden', 'position': 'absoulute', 'height': this.height + 1 + 'px' });
            this.d_scoller.css('position', 'absoulute');

            if (this.scroll && this.scroll.destroy) this.scroll.destroy();
            this.scrollOpts.wrapper = this.d_wrapper;
            this.scrollOpts.scroller = this.d_scoller;
            this.scroll = new UIScroll(this.scrollOpts);

        },

        resetHeight: function () {
            if (this.scroll && this.scroll.destroy) this.scroll.destroy();
            this.scrollOpts.wrapper = this.d_wrapper;
            this.scrollOpts.scroller = this.d_scoller;
            this.scroll = new UIScroll(this.scrollOpts);
        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {
                this.initScroll();
            }, 1);

            this.on('onHide', function () {
                if (this.scroll) {
                    this.scroll.destroy();
                    this.scroll = null;
                }
            });

        }

    });


});
