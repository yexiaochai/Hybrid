
define([], function () {
    'use strict';

    return _.inherit({

        _propertys: function () {
            this.APP = this.APP || window.APP;
            var i = 0, len = 0, k;
            if (this.APP && this.APP.interface) {
                for (i = 0, len = this.APP.interface.length; i < len; i++) {
                    k = this.APP.interface[i];
                    if (k == 'showPageView' || k == 'showPageview') continue;

                    if (_.isFunction(this.APP[k])) {
                        this[k] = $.proxy(this.APP[k], this.APP);
                    }
                    else this[k] = this.APP[k];
                }
            }

            this.header = this.APP.header;
        },

        showPageView: function (name, _viewdata, id) {
            this.APP.curViewIns = this;
            this.APP.showPageView(name, _viewdata, id);
        },

        showPageview: function (name, _viewdata,param) {
            if (!_viewdata) return;
            _viewdata.__parentView = this;
            this.APP.showPageview(name, _viewdata,param);
        },

        propertys: function () {
            //这里设置UI的根节点所处包裹层
            this.wrapper = $('#main');
            this.id = _.uniqueId('page-view-');
            this.classname = '';

            this.viewId = null;
            this.refer = null;

            //模板字符串，各个组件不同，现在加入预编译机制
            this.template = '';
            //事件机制
            this.events = {};

            //自定义事件
            //此处需要注意mask 绑定事件前后问题，考虑scroll.radio插件类型的mask应用，考虑组件通信
            this.eventArr = {};

            //初始状态为实例化
            this.status = 'init';

            //需要格式化样式
            this.needFormatStyle = true;

            this._propertys();

        },

        getViewModel: function () {
            //假如有datamodel的话，便直接返回，不然便重写，这里基本为了兼容
            if (_.isObject(this.datamodel)) return this.datamodel;
            return {};
        },

        //子类事件绑定若想保留父级的，应该使用该方法
        addEvents: function (events) {
            if (_.isObject(events)) _.extend(this.events, events);
        },

        on: function (type, fn, insert) {
            if (!this.eventArr[type]) this.eventArr[type] = [];

            //头部插入
            if (insert) {
                this.eventArr[type].splice(0, 0, fn);
            } else {
                this.eventArr[type].push(fn);
            }
        },

        off: function (type, fn) {
            if (!this.eventArr[type]) return;
            if (fn) {
                this.eventArr[type] = _.without(this.eventArr[type], fn);
            } else {
                this.eventArr[type] = [];
            }
        },

        trigger: function (type) {
            var _slice = Array.prototype.slice;
            var args = _slice.call(arguments, 1);
            var events = this.eventArr;
            var results = [], i, l;

            if (events[type]) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    results[results.length] = events[type][i].apply(this, args);
                }
            }
            return results;
        },

        //如果具有style标签,则需要格式化再使用
        createInlineStyle: function () {
            var uid = this.viewId;

            //如果存在style节点，并且style节点不存在的时候需要处理
            if ( !$('#page_common')[0] && this.commonstyle) {
                $('head').append($('<style id="page_common" class="page-style">' + this.commonstyle + '</style>'))
            }

            if(!this.needFormatStyle || !this.style || $('#page_' + this.viewId)[0]) return;

            var style = this.style;
            //在此处理shadow dom的样式，直接返回处理结束后的html字符串
            //创建定制化的style字符串，会模拟一个沙箱，该组件样式不会对外影响，实现原理便是加上#id 前缀
            style = style.replace(/(\s*)([^\{\}]+)\{/g, function (a, b, c) {
                return b + c.replace(/([^,]+)/g, '.page-' + uid + ' $1') + '{';
            });

            $('head').append($('<style id="page_' + this.viewId + '" class="page-style">' + style + '</style>'))

        },

        createRoot: function (html) {

            //如果存在style节点，并且style节点不存在的时候需要处理
            this.createInlineStyle();

            //如果具有fake节点，需要移除
            $('#fake-page').remove();

            //UI的根节点
            this.$el = $('<div class="cm-view page-' + this.viewId + ' ' + this.classname + '" style="display: none; " id="' + this.id + '">' + html + '</div>');
            if (this.wrapper.find('.cm-view')[0]) {
                this.wrapper.append(this.$el);
            } else {
                this.wrapper.html('').append(this.$el);
            }

        },

        _isAddEvent: function (key) {
            if (key == 'onCreate' || key == 'onPreShow' || key == 'onShow' || key == 'onRefresh' || key == 'onHide')
                return true;
            return false;
        },

        setOption: function (options) {
            //这里可以写成switch，开始没有想到有这么多分支
            for (var k in options) {
                if (k == 'events') {
                    _.extend(this[k], options[k]);
                    continue;
                } else if (this._isAddEvent(k)) {
                    this.on(k, options[k])
                    continue;
                }
                this[k] = options[k];
            }
            //      _.extend(this, options);
        },

        initialize: function (opts) {
            //这种默认属性
            this.propertys();
            //根据参数重置属性
            this.setOption(opts);
            //检测不合理属性，修正为正确数据
            this.resetPropery();

            this.addEvent();
            this.create();

            this.initElement();

            window.sss = this;

        },


        _getViewIdRule: function () {
            var url = location.href;
            var viewId = '', hash = '';
            var reg = /webapp\/(.+)\/(.+)\.html/;

            var match = url.match(reg);
            if (match && match[1]) viewId = match[1];

            return viewId || '';
        },

        $: function (selector) {
            return this.$el.find(selector);
        },

        //提供属性重置功能，对属性做检查
        resetPropery: function () { },

        //各事件注册点，用于被继承override
        addEvent: function () {
        },

        create: function () {
            this.trigger('onPreCreate');
            //如果没有传入模板，说明html结构已经存在
            this.createRoot(this.render());

            this.status = 'create';
            this.trigger('onCreate');
        },

        //实例化需要用到到dom元素
        initElement: function () { },

        render: function (callback) {
            var data = this.getViewModel() || {};
            var html = this.template;
            if (!this.template) return '';
            //引入预编译机制
            if (_.isFunction(this.template)) {
                html = this.template(data);
            } else {
                html = _.template(this.template)(data);
            }
            typeof callback == 'function' && callback.call(this);
            return html;
        },

        refresh: function (needRecreate) {
            this.resetPropery();
            if (needRecreate) {
                this.create();
            } else {
                this.$el.html(this.render());
            }
            this.initElement();
            if (this.status != 'hide') this.show();
            this.trigger('onRefresh');
        },

        /**
        * @description 组件显示方法，首次显示会将ui对象实际由内存插入包裹层
        * @method initialize
        * @param {Object} opts
        */
        show: function (noEvent) {
            if (noEvent) {
                this.status = 'show';
                this.$el.show();
                return;
            }

            this.initHeader();

            this.trigger('onPreShow');
            //      //如果包含就不要乱搞了
            //      if (!$.contains(this.wrapper[0], this.$el[0])) {
            //        //如果需要清空容器的话便清空
            //        if (this.needEmptyWrapper) this.wrapper.html('');
            //        this.wrapper.append(this.$el);
            //      }

            window.scrollTo(0, 0);
            this.$el.show();
            this.status = 'show';

            this.bindEvents();

            // this.initHeader();
            this.trigger('onShow');
        },

        initHeader: function () { },

        hide: function (noEvent) {

            this.hideConfirm();
            this.hideToast();
            this.hideMessage();

            if (noEvent) {
                this.status = 'hide';
                this.$el.hide();
                return;
            }

            if (!this.$el || this.status !== 'show') return;

            this.trigger('onPreHide');
            this.$el.hide();

            this.unBindEvents();
            this.trigger('onHide');
            this.status = 'hide';

        },

        destroy: function () {
            this.unBindEvents();
            this.$el.remove();
            this.trigger('onDestroy');
            this.status = 'destroy';
            this.gloablDestoryEvents();
            delete this;

        },

        //重置当前所有方法,在view隐藏后方法便不执行
        gloablDestoryEvents: function() {

            //需要绕开的系统级别方法
            var sysEvents = [
                'constructor',
                //'forward',
                //'back',
                //'jump',
                'showPageView',
                'showPageview',
                'hidePageView',
                'showLoading',
                'hideLoading',
                //'showToast',
                'hideToast',
                //'showMessage',
                'hideMessage',
                //'showConfirm',
                'hideConfirm',
                'openWebapp',
                'closeWebapp',
                'setViewportSize',
                '_propertys',
                'propertys',
                'getViewModel',
                'addEvents',
                'on',
                'off',
                'trigger',
                'createInlineStyle',
                'createRoot',
                '_isAddEvent',
                'setOption',
                'initialize',
                'resetEvents',
                '_getViewIdRule',
                '$',
                'resetPropery',
                'addEvent',
                'create',
                'initElement',
                'render',
                'refresh',
                'show',
                'initHeader',
                'hide',
                'destroy',
                'bindEvents',
                'unBindEvents',
                'getParam',
                'renderTpl'
            ];

            var k, method;

            for(k in this) {
                method = this[k];

                if(typeof method !== 'function') continue;
                if(_.indexOf(sysEvents, k) != -1) continue;

                this[k] = function () {
                    console.log('view已经销毁,回调不执行');
                };
            }

        },

        bindEvents: function () {
            var events = this.events;

            if (!(events || (events = _.result(this, 'events')))) return this;
            this.unBindEvents();

            // 解析event参数的正则
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var key, method, match, eventName, selector;

            // 做简单的字符串数据解析
            for (key in events) {
                method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) continue;

                match = key.match(delegateEventSplitter);
                eventName = match[1], selector = match[2];
                method = _.bind(method, this);
                eventName += '.delegateUIEvents' + this.id;

                if (selector === '') {
                    this.$el.on(eventName, method);
                } else {
                    this.$el.on(eventName, selector, method);
                }
            }

            return this;
        },

        unBindEvents: function () {
            this.$el.off('.delegateUIEvents' + this.id);
            return this;
        },

        getParam: function (key) {
            return _.getUrlParam(window.location.href, key)
        },

        renderTpl: function (tpl, data) {
            if (!_.isFunction(tpl)) tpl = _.template(tpl);
            return tpl(data);
        }


    });

});
