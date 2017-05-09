//Hybrid基本逻辑
(function() {

    //01 获取版本信息
    var getHybridInfo = function() {
        var platform_version = {};
        var na = navigator.userAgent;
        na = na.toLowerCase();
        var info = na.match(/hybrid_\w+_\d\.\d\.\d/);

        if (info && info[0]) {
            info = info[0].split('_');
            if (info && info.length == 4) {
                platform_version.platform = info[1];
                platform_version.app = info[2];
                platform_version.version = info[3];
            }
        }

        return platform_version;
    };


    window.Hybrid = window.Hybrid || {};

    var _getHybridUrl = function(params) {
        var k, paramStr = '',
            url = 'hybrid://',
            flag = '?';
        url += params.tagname; //时间戳，防止url不起效

        if (params.callback) {
            flag = '&';
            url += '?callback=' + params.callback;
            //delete params.callback;
        }
        if (params.param) {
            paramStr = typeof params.param == 'object' ? JSON.stringify(params.param) : params.param;
            url = url + flag + 'param=' + encodeURIComponent(paramStr);
        }
        return url;
    };

    var bridgePostMsg = function(params) {
        var url = _getHybridUrl(params);
        //兼容ios6
        var ifr = $('<iframe style="display: none;" src="' + url + '"/>');
        console.log(params.tagname + '-hybrid请求发出-' + new Date().getTime() + 'url: ' + url)
        if ($.os.android) {
            //Android情况协议发的太快会有问题
            setTimeout(function() {
                $('body').append(ifr);
            })
        } else {
            $('body').append(ifr);
        }

        //这样会阻断第二次请求
        //window.location = url;

        setTimeout(function() {
            ifr.remove();
            ifr = null;
        }, 1000);
    };

    //02 H5与Native基本交互
    var requestHybrid = function(params) {
        if (!params.tagname) {
            alert('必须包含tagname');
        }
        //生成唯一执行函数，执行后销毁
        var tt = (new Date().getTime()) + '_' + _.uniqueId() + '_';
        var t = 'hybrid_' + params.tagname + '_' + tt;
        var tmpFn;

        //处理有回调的情况
        if (params.callback) {
            tmpFn = params.callback;
            params.callback = t;

            window.Hybrid[t] = function(data) {
                tmpFn(data);
                //delete window.Hybrid[t];
            }
        }

        bridgePostMsg(params);
    };



})();