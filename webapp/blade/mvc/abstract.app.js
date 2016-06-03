define([
   typeof requestNative == 'function' ? 'HybridHeader' : 'UIHeader',
  'UIToast',
  'UILoading',
  'UIPageView',
  'UIAlert'
], function (UIHeader, UIToast, UILoading, UIPageView, UIAlert) {

    return _.inherit({
        propertys: function () {
            //view搜索目录
            this.viewRootPath = 'views/';

            //默认view
            this.defaultView = 'index';

            //当前视图路径
            this.viewId;
            this.viewUrl;

            //视图集
            this.views = {};
            // 存放所有的showPageViewId
            this.pageViewIds = [];
            //是否开启单页应用
            //      this.isOpenWebapp = _.getHybridInfo().platform == 'baidubox' ? true : false;
            this.isOpenWebapp = false;

            this.viewMapping = {};

            //处理
            this.delayTime = 60000;
            this.delayTIMER = null;

            //UIHeader需要释放出来
            this.UIHeader = UIHeader;

            this.interface = [
                'forward',
                'back',
                'jump',
                'showPageview',
                'showLoading',
                'hideLoading',
                'showToast',
                'hideToast',
                'showMessage',
                'hideMessage',
                'showConfirm',
                'hideConfirm',
                'openWebapp',
                'closeWebapp',
                'setViewportSize'
            ];

            //权宜之计，后期要求css必须做到互相独立
            //@override
            this.viewStyleMap = {
                booking: ['booking', 'contacts', 'contactadd'],
                city: ['city'],
                contactadd: ['contactadd'],
                contacts: ['contacts'],
                ecoupon: ['list', 'ecoupon'],
                home: ['home'],
                index: ['index'],
                list: ['list'],
                orderdetail: ['booking', 'orderdetail'],
                orderlist: ['booking', 'orderlist']
            };

        },

        initialize: function (options) {
            this.propertys();
            this.setOption(options);
            this.initViewPort();
            this.initAppMapping();

            //开启fastclick
            $.bindFastClick && $.bindFastClick();

        },

        setOption: function (options) {
            _.extend(this, options);
        },

        //创建dom结构
        initViewPort: function () {

            this.d_header = $('#headerview');
            this.d_state = $('#js_page_state');
            this.d_viewport = $('#main');

            //权宜之计
            this.d_style = $('<style id="js_view_style"></style>');
            this.d_state.append(this.d_style);

            //实例化全局使用的header，这里好像有点不对
            this.header = new this.UIHeader({
                wrapper: this.d_header
            });

            //非共享资源，这里应该引入app概念了
            this.pageviews = {};

            this.toast = new UIToast();
            this.loading = new UILoading();
            this.alert = new UIAlert();
            this.confirm = new UIAlert();

            //解决因为header问题而导致的50px多余的情况
            this.setViewportSize();

        },

        setViewportSize: function ( ) {
            this._setRem();

            var wrap = $('body');
            var h = parseInt($(window).height());
            var h1 = parseInt($('#headerview').height());

            wrap.height(h - h1);
            
        },

        _setRem: function() {
            var rem = 20;
            var docEl = document.documentElement;
            var fontEl = document.createElement('style');
            rem = parseInt(docEl.clientWidth / 375 * 20);

            if(rem < 20) rem = 20;
            if(rem > 40) rem = 40;

            docEl.firstElementChild.appendChild(fontEl);
            fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
        },

        openWebapp: function () {
            this.isOpenWebapp = true;
        },

        closeWebapp: function () {
            this.isOpenWebapp = false;
        },
        onShowPageView: function (id) {
            var scope = this;
            var eventName = 'hashchange.showPageView';
            $(window).off(eventName);
            this.pageViewIds.push(id);
            location.hash = id;
            setTimeout(function () {
                $(window).on(eventName, function (e) {
                    if (scope.pageViewIds.length > 0) {
                        scope.hidePageView(scope.pageViewIds.pop());
                    }
                });
            }, 200);
        },
        showPageView: function (name, _viewdata_, id) {
            var view = null, k, scope = this.curViewIns || this;
            if (!id) id = name;
            if (!_.isString(name)) return;
            //    for (k in _viewdata_) {
            //      if (_.isFunction(_viewdata_[k])) _viewdata_[k] = $.proxy(_viewdata_[k], scope);
            //    }
            view = this.pageviews[id];
            _viewdata_.useHashChange && this.onShowPageView(id);
            var arr = name.split('/');
            var getViewPath = window.getViewPath || window.GetViewPath;
            if (!view) {
                view = new UIPageView({
                    // bug fixed by zzx
                    viewId: arr[arr.length - 1] || name,
                    viewPath: getViewPath ? getViewPath(name) : name,
                    _viewdata_: _viewdata_,
                    onHide: function () {
                        scope.initHeader();
                    }
                });
                this.pageviews[id] = view;
            } else {
                view.setViewData(_viewdata_);
            }
            view.show();

        },
        hidePageView: function (name) {
            if (name) {
                if (this.pageviews[name]) this.pageviews[name].hide();
            } else {
                for (var k in this.pageviews) this.pageviews[k].hide();
            }
        },

        showLoading: function () {
            this.loading.show();
            var scope = this;
            if(this.delayTIMER) clearTimeout(this.delayTIMER);
            this.delayTIMER = setTimeout(function () {
                var that = this;
                scope.showMessage({
                    content: '请检查网络连接',
                    okAction: function () {
                        this.hide();
                    },
                });

                scope.hideLoading();

            }, this.delayTime);

        },

        hideLoading: function () {
            if(this.delayTIMER) clearTimeout(this.delayTIMER);
            this.loading.hide();
        },

        showToast: function (msg, callback) {
            this.toast.resetDefaultProperty();
            this.toast.content = msg;
            if (callback) this.toast.hideAction = callback;
            this.toast.refresh();
            this.toast.show();
        },

        hideToast: function () {
            this.toast.hide();
        },

        showMessage: function (param) {
            if (_.isString(param)) {
                param = { content: param };
            }

            this.alert.resetDefaultProperty();
            this.alert.setOption(param);
            this.alert.refresh();
            this.alert.show();
        },

        hideMessage: function () {
            this.alert.hide();
        },

        showConfirm: function (params) {
            if (!params) params = {};
            if (typeof params == 'string') {
                params = {
                    content: params
                };
            }

            this.confirm.resetDefaultProperty();

            //与showMessage不一样的地方
            this.confirm.btns = [
              { name: '取消', className: 'cm-btns-cancel js_cancel' },
              { name: '确定', className: 'cm-btns-ok js_ok' }
            ];
            if(params.hasOwnProperty('btnNames')&& _.isArray(params.btnNames)&&params.btnNames.length==2){
                this.confirm.btns[0].name=params.btnNames[0];
                this.confirm.btns[1].name=params.btnNames[1];
            }
            this.confirm.setOption(params);
            this.confirm.refresh();
            this.confirm.show();
        },

        hideConfirm: function () {
            this.confirm.hide();
        },

        //初始化app
        initApp: function () {

            //首次加载不需要走路由控制
            this.loadViewByUrl();

            //后面的加载全部要经过路由处理
            if (this.isOpenWebapp === true)
                $(window).on('popstate.app', $.proxy(this.loadViewByUrl, this));

        },

        //获取正在显示的pageview
        getShowPageView: function () {
            for (var k in this.pageviews) {
                if (this.pageviews[k].status == 'show') return this.pageviews[k];
            }
            return null;
        },

        destroyPageViews: function () {
            $(window).off('.pageviewapp');
            for (var k in this.pageviews) {
                this.pageviews[k].destroy();
            }
            this.pageviews = {};
        },

        loadViewByUrl: function (e) {
            var url = decodeURIComponent(location.href).toLowerCase();
            var viewId = this.getViewIdRule(url);

            //如果是forward则将所有的Pageview全部干掉
            if (e == 'forward') {
                this.destroyPageViews();
            }

            var pageview = this.getShowPageView();
            //如果存在正在显示的pageview，则需要处理之
            if (pageview) {
                pageview.hide(true);
                if (pageview.__parentView.viewId == viewId) {
                    pageview.__parentView.show(true);
                    pageview.__parentView.initHeader();
                    return;
                }
            }

            //是forward导致的，则一定不使用pageview，否则pageview存在的话一定使用的pageview
            //如果存在pageview，并且当前pageview正在显示，则需要处理pageview的逻辑，不处理系统逻辑
            //处理pageview的逻辑
            if (this.pageviews[viewId]) {
                this.pageviews[viewId].show();
                this.pageviews[viewId].__parentView.hide(true);
                return;
            }

            viewId = viewId || this.defaultView;
            this.viewId = viewId;
            this.viewUrl = url;
            this.switchView(this.viewId);
        },

        //@override
        getViewIdRule: function (url) {
            var viewId = '', hash = '';
            var reg = /webapp\/.+\/(.+)\.html/;
            var index = url.indexOf('?');

            if(index != -1) {
                url = url.substr(0, index);
            }

            var match = url.match(reg);
            if (match && match[1]) viewId = match[1];

            return viewId;
        },
        //@override
        setUrlRule: function (viewId, param, replace, project) {
            url = this._setUrlRule(viewId, param, replace, project);

            if (this.isOpenWebapp === false) {
                window.location = url;
                return true;
            }

            if (replace) {
                history.replaceState({}, document.title, url);
            } else {
                history.pushState({}, document.title, url);
            }

        },

        _setUrlRule: function (viewId, param, replace, project) {
            var reg = /(webapp\/.+\/)(.+)\.html/;
            var url = window.location.href;
            var match = url.match(reg);
            var proj = project ? 'webapp/' + project : match[1];
            var preUrl = '', str = '', i = 0, _k, _v;
            //这里这样做有点过于业务了 *bug*
            var keepParam = [
              '__platform',
              '__version',
              'us',
              'src_from',
              'hmsr',
              'hmmd',
              'hmpl',
              'hmkw',
              'hmci',
              '_search'
            ], p;
            if (!viewId) return;
            if (!match || !match[1]) {
                preUrl = url + '/webapp/bus/' + viewId + '.html';
            } else {
                preUrl = url.substr(0, url.indexOf(match[1])) + proj + viewId + '.html'; ;
            }

            //特定的参数将会一直带上去，渠道、来源等标志
            for (i = 0; i < keepParam.length; i++) {
                p = keepParam[i];
                if (_.getUrlParam()[p]) {
                    if (!param) param = {};
                    param[p] = _.getUrlParam()[p];
                }
            }

            i = 0;

            for (k in param) {
                _k = encodeURIComponent(_.removeAllSpace(k));
                _v = encodeURIComponent(_.removeAllSpace(param[k]));
                if (i === 0) {
                    str += '?' + _k + '=' + _v;
                    i++;
                } else {
                    str += '&' + _k + '=' + _v;
                }
            }

            url = preUrl + str;

            return url;

        },

        showPageview: function (name, _viewdata_, param, replace) {

            if (!name) return;
            name = name.toLowerCase();

            var scope = this;

            //检查当前是否存在pageview
            var pageView = this.pageviews[name];

            //改变当前url
            history.pushState({}, '', this._setUrlRule(name, param, replace));

            //如果是多页应用的话，则需要开启监控，但是forward类依旧使用跳转
            if (this.isOpenWebapp === false) {
                $(window).off('.pageviewapp');
                $(window).on('popstate.pageviewapp', $.proxy(this.loadViewByUrl, this));
            }

            //如果Pageview存在则直接显示
            if (pageView) {
                pageView.setOption(_viewdata_);

                //仅仅隐藏父view不触发事件，仅仅是单纯的dom隐藏
                pageView.__parentView.hide(true);
                pageView.show();

                return;
            }

            //如果不存在则需要构建，记住构建时需要使用viewdata继承源view 
            requirejs([this.buildUrl(name)], function (View) {
                var viewIns;
                //组装特殊的类，继承至基础View
                var PageView = _.inherit(View, _viewdata_);
                var opts = {
                    viewId: name,
                    onHide: function () {
                        this.__parentView.initHeader();
                    }
                };

                for (k in _viewdata_) {
                    if (typeof _viewdata_[k] != 'fuction')
                        opts[k] = _viewdata_[k];
                }

                viewIns = new PageView(opts);

                //仅仅隐藏父view不触发事件，仅仅是单纯的dom隐藏
                viewIns.__parentView.hide(true);

                viewIns.show();
                viewIns.__type = 'pageview';
                scope.pageviews[name] = viewIns;

            });

        },

        switchView: function (id) {

            var curView = this.views[id];

            //切换前的当前view，马上会隐藏
            var tmpView = this.curView;

            if (tmpView && tmpView != curView) {
                this.lastView = tmpView;
            }

            //如果当前view存在，则执行请onload事件
            if (this.curView && this.curView.viewId == id) {

                //如果当前要跳转的view就是当前view的话便不予处理
                //这里具体处理逻辑要改*************************************
                //此处逻辑还得处理，需要判断当前view状态，和view联合起来 ***bug***
                this.curView.show(true);
                return;

            } else {
                this.lastView = this.curView;

                this.showLoading();
                this.loadView(id, function (View) {

                    //防止页面出现两个view，不知原因，兼容吧！！！
                    $('#main .cm-view').hide();

                    //每次加载结束将状态栏隐藏，这个代码要改
                    this.hideLoading();

                    this.curView = new View({
                        viewId: id,
                        refer: this.lastView ? this.lastView.viewId : null,
                        APP: this,
                        wrapper: this.d_viewport
                    });

                    //设置网页上的view标志
                    this.curView.$el.attr('page-url', id);

                    //保存至队列
                    //不保存则每次接实例化
                    //                    this.views[id] = this.curView;

                    //全部销毁，每次重新实例化view
                    if (this.lastView) {
                        this.lastView.hide();
                        this.lastView.destroy();
                        this.lastView = null;
                    }

                    this.curView.show();

                });
            }
        },

        //加载view
        loadView: function (path, callback) {
            var self = this;
            requirejs([this.buildUrl(path)], function (View) {
                callback && callback.call(self, View);
            });
        },

        //override
        //配置可能会有的路径扩展，为Hybrid与各个渠道做适配
        initAppMapping: function () {
            console.log('该方法必须被重写');
        },

        //@override
        buildUrl: function (path) {
            var mappingPath = this.viewMapping[path];
            return mappingPath ? mappingPath : this.viewRootPath + '/' + path + '/' + path;
        },

        //此处需要一个更新逻辑，比如在index view再点击到index view不会有反应，下次改**************************
        forward: function (viewId, param, replace, animateName) {

            if (!viewId) return;
            viewId = viewId.toLowerCase();

            var url = decodeURIComponent(location.href).toLowerCase();
            var _viewId = this.getViewIdRule(url);
            var hybridPage, index = 0;

            if(viewId == _viewId) return;

            if(!this.curView) return;

            //hybrid跳转封装
            if(_.getHybridInfo().platform == 'hybrid') {

                if (viewId.indexOf('/') != -1) {
                    hybridPage = viewId + '.html';
                } else {
                    hybridPage = this.curView.project + '/' + viewId + '.html';
                }

                for(var key in param) {
                    if(index == 0) {
                        hybridPage += '?' + key + '=' + encodeURIComponent(param[key]);
                    } else {
                        hybridPage += '&' + key + '=' + encodeURIComponent(param[key]);
                    }
                    index++;
                }


                _.requestHybrid({
                    tagname: 'forward',
                    param: {
                        topage: window.location.origin + (window.location.href.toLowerCase().indexOf('/hybrid/') == -1 ? '' : '/Hybrid') +   '/webapp/' + hybridPage,
                        type: 'h5',
                        animate: animateName || 'push'
                    }
                });

                return;
            }

            if (this.setUrlRule(viewId, param, replace)) {
                return;
            }
            //一定不使用pageview
            this.loadViewByUrl('forward');
        },

        goHome: function() {

        },

        //跨频道跳转
        jump: function (path, param, replace, animateName) {
            //hybrid跳转封装
            if(_.getHybridInfo().platform == 'hybrid') {
                this.forward(path, param, replace, animateName);
                return;
            }

            var viewId;
            var project;
            if (!path) {
                return;
            }
            path = path.toLowerCase().split('/');
            if (path.length <= 0) {
                return;
            }
            viewId = path.pop();
            project = path.length === 1 ? path.join('') + '/' : path.join('');

            this.setUrlRule(viewId, param, replace, project);
            this.loadViewByUrl();
        },

        back: function (viewId, param, replace) {
            if (viewId) {
                this.forward(viewId, param, replace, 'pop')
            } else {
                //hybrid跳转封装
                if(_.getHybridInfo().platform == 'hybrid') {
                    _.requestHybrid({
                        tagname: 'back'
                    });
                    return;
                }


                if (window.history.length == 1) {
                    this.forward(this.defaultView, param, replace)
                } else {
                    history.back();
                }
            }
        }

    });

});
