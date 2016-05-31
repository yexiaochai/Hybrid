define(['UILayer', 'text!T_UIIdentitycard'], function (UILayer, template) {
    return _.inherit(UILayer, {
        propertys: function ($super) {
            $super();

            this.template = template;

            this.addEvents({
                'click .js_ok': 'closeAction',
                'click .js_clear': 'clearAction',
                'click .js_num_item li': 'itemAction'
            });

            this.animateInClass = 'cm-down-in';
            this.animateOutClass = 'cm-down-out';

            //目标元素，必填
            this.targetEl = null;
//            this.emptyEl = $('<div style="height: 1000px"></div>');
            this.emptyEl = $('<div style="height: 500rem"></div>');
            this.focusEl = $('<span class="ui-focus-icon">&nbsp;</span>');
            this.top = 0;

        },

        onClearAction: function() {

        },

        setVal: function(v) {
            this.targetEl.attr('data-key', v);
            this.targetEl.text(v);
        },

        getVal: function() {
            return this.getText();
        },

        itemClickAction: function (val) {
            var curHtml = this.targetEl.attr('data-key') || '';
            curHtml += val;

            this.setVal(curHtml);
        },

        deleteAction: function () {
            var curHtml = this.targetEl.attr('data-key') || '';
            if (curHtml.length > 0) {
                curHtml = curHtml.substr(0, curHtml.length - 1);
                this.setVal(curHtml);
                this.openFocus();
            } else {
                this.onClearAction();
            }
        },

        clearAction: function () {
            this.onClearAction();
            this.setVal('');
            this.openFocus();

        },

        getText: function () {
            return this.targetEl.attr('data-key') || '';
        },

        itemAction: function (e) {
            var el = $(e.currentTarget);
            if (el.hasClass('disabled')) return;

            if (el.hasClass('js_item_del')) {
                this.deleteAction();
                return;
            }

            var val = el.attr('data-key')
            this.itemClickAction(val);
            this.openFocus();

            //            el.addClass('active');
            //            setTimeout(function () {
            //                el.removeClass('active')
            //            }, 120);

        },

        closeAction: function () {
            this.hide();
        },

        initialize: function ($super, opts) {
            $super(opts);
        },

        initElement: function () {
            this.el = this.$el;
        },

        _scrollToTarget: function () {
            var offset = this.targetEl.offset();
            window.scrollTo(0, offset.top - 65);
            this.top = offset.top - 65;
        },

        reposition: function () {
            this.$el.css({
                'position': 'fixed',
                'width': '100%',
                'left': '0',
                'bottom': '0'
            });
        },

        openFocus: function () {
            if (this.getText() == '') this.targetEl.html('');
            this.targetEl.append(this.focusEl);
            this.focusEl.show();

        },

        closeFocus: function () {
            this.focusEl.hide();
        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {
                var scope = this;
                this.mask.$el.addClass('cm-overlay--transparent');
                $('body').append(this.emptyEl);
                this._scrollToTarget();
                this.openFocus();

                //andriod重绘问题
                if ($.os.android) {
                    el.hide();

                    window.scrollTo(0, this.top - 10);
                    setTimeout(function () {
                        window.scrollTo(0, scope.top + 10);
                    }, 100);
                }

            });

            this.on('onHide', function () {
                this.emptyEl.remove();
                this.closeFocus();

            });
        }
    });

});
