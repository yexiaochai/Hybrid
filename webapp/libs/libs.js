/**
* @description Hybrid demo配套js文件，因为是demo保证可读性未做封装，请知悉，真实配套框架为：https://github.com/yexiaochai/blade
* @author 叶小钗
*/


//Hybrid基本交互定义
window.Hybrid = window.Hybrid || {};
Hybrid.ui = {};

var bridgePostMsg = function (url) {
    if ($.os.ios) {
        window.location = url;
    } else {
        var ifr = $('<iframe style="display: none;" src="' + url + '"/>');
        $('body').append(ifr);
        setTimeout(function () {
            ifr.remove();
        }, 1000)
    }
};
var _getHybridUrl = function (params) {
    var k, paramStr = '', url = 'hybrid://';
    url += params.tagname + '?t=' + new Date().getTime(); //时间戳，防止url不起效
    if (params.callback) {
        url += '&callback=' + params.callback;
        delete params.callback;
    }
    if (params.param) {
        paramStr = typeof params.param == 'object' ? JSON.stringify(params.param) : params.param;
        url += '&param=' + encodeURIComponent(paramStr);
    }
    return url;
};
var requestHybrid = function (params) {
    //生成唯一执行函数，执行后销毁
    var tt = (new Date().getTime());
    var t = 'hybrid_' + tt;
    var tmpFn;

    //处理有回调的情况
    if (params.callback) {
        tmpFn = params.callback;
        params.callback = t;
        window.Hybrid[t] = function (data) {
            tmpFn(data);
            delete window.Hybrid[t];
        }
    }
    bridgePostMsg(_getHybridUrl(params));
};
//获取版本信息，约定APP的navigator.userAgent版本包含版本信息：scheme/xx.xx.xx
var getHybridInfo = function () {
    var platform_version = {};
    var na = navigator.userAgent;
    var info = na.match(/scheme\/\d\.\d\.\d/);

    if (info && info[0]) {
        info = info[0].split('/');
        if (info && info.length == 2) {
            platform_version.platform = info[0];
            platform_version.version = info[1];
        }
    }
    return platform_version;
};

var registerHybridCallback = function (ns, name, callback) {
    if (!window.Hybrid[ns]) window.Hybrid[ns] = {};
    window.Hybrid[ns][name] = callback;
};

var unRegisterHybridCallback = function (ns) {
    if (!window.Hybrid[ns]) return;
    delete window.Hybrid[ns];
};


var HybridHeader = function () {
    this.left = [];
    this.right = [];
    this.title = {};
    this.view = null;
    this.hybridEventFlag = 'Header_Event';
};

HybridHeader.prototype = {
    //全部更新
    set: function (opts) {
        if (!opts) return;

        var left = [];
        var right = [];
        var title = {};
        var tmp = {};

        //语法糖适配
        if (opts.back) {
            tmp = { tagname: 'back' };
            if (typeof opts.back == 'string') tmp.value = opts.back;
            else if (typeof opts.back == 'function') tmp.callback = opts.back;
            else if (typeof opts.back == 'object') _.extend(tmp, opts.back);
            left.push(tmp);
        } else {
            if (opts.left) left = opts.left;
        }

        //右边按钮必须保持数据一致性
        if (typeof opts.right == 'object' && opts.right.length) right = opts.right

        if (typeof opts.title == 'string') {
            title.title = opts.title;
        } else if (_.isArray(opts.title) && opts.title.length > 1) {
            title.title = opts.title[0];
            title.subtitle = opts.title[1];
        } else if (typeof opts.title == 'object') {
            _.extend(title, opts.title);
        }

        this.left = left;
        this.right = right;
        this.title = title;
        this.view = opts.view;

        this.registerEvents();

        requestHybrid({
            tagname: 'updateheader',
            param: {
                left: this.left,
                right: this.right,
                title: this.title
            }
        });

    },

    //注册事件，将事件存于本地
    registerEvents: function () {
        unRegisterHybridCallback(this.hybridEventFlag);
        this._addEvent(this.left);
        this._addEvent(this.right);
        this._addEvent(this.title);
    },

    _addEvent: function (data) {
        if (!_.isArray(data)) data = [data];
        var i, len, tmp, fn, tagname;
        var t = 'header_' + (new Date().getTime());

        for (i = 0, len = data.length; i < len; i++) {
            tmp = data[i];
            tagname = tmp.tagname || '';
            if (tmp.callback) {
                fn = $.proxy(tmp.callback, this.view);
                tmp.callback = t + '_' + tagname;
                registerHybridCallback(this.hybridEventFlag, t + '_' + tagname, fn);
            }
        }
    },

    //显示header
    show: function () {
        _.requestHybrid({
            tagname: 'showheader'
        });
    },

    //隐藏header
    hide: function () {
        _.requestHybrid({
            tagname: 'hideheader',
            param: {
                animate: true
            }
        });
    },

    //只更新title，不重置事件，不对header其它地方造成变化，仅仅最简单的header能如此操作
    update: function (title) {
        requestHybrid({
            tagname: 'updateheadertitle',
            param: {
                title: title
            }
        });
    }
};

//释放出来的header组件
Hybrid.ui.header = new HybridHeader();

