//继承相关逻辑
(function() {

    // 全局可能用到的变量
    var arr = [];
    var slice = arr.slice;
    /**
     * inherit方法，js的继承，默认为两个参数
     *
     * @param  {function} origin  可选，要继承的类
     * @param  {object}   methods 被创建类的成员，扩展的方法和属性
     * @return {function}         继承之后的子类
     */
    _.inherit = function(origin, methods) {

        // 参数检测，该继承方法，只支持一个参数创建类，或者两个参数继承类
        if (arguments.length === 0 || arguments.length > 2) throw '参数错误';

        var parent = null;

        // 将参数转换为数组
        var properties = slice.call(arguments);

        // 如果第一个参数为类（function），那么就将之取出
        if (typeof properties[0] === 'function')
            parent = properties.shift();
        properties = properties[0];

        // 创建新类用于返回
        function klass() {
            if (_.isFunction(this.initialize))
                this.initialize.apply(this, arguments);
        }

        klass.superclass = parent;

        // 父类的方法不做保留，直接赋给子类
        // parent.subclasses = [];

        if (parent) {
            // 中间过渡类，防止parent的构造函数被执行
            var subclass = function() {};
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass();

            // 父类的方法不做保留，直接赋给子类
            // parent.subclasses.push(klass);
        }

        var ancestor = klass.superclass && klass.superclass.prototype;
        for (var k in properties) {
            var value = properties[k];

            //满足条件就重写
            if (ancestor && typeof value == 'function') {
                var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(value.toString())[1].replace(/\s/g, '').split(',');
                //只有在第一个参数为$super情况下才需要处理（是否具有重复方法需要用户自己决定）
                if (argslist[0] === '$super' && ancestor[k]) {
                    value = (function(methodName, fn) {
                        return function() {
                            var scope = this;
                            var args = [
                                function() {
                                    return ancestor[methodName].apply(scope, arguments);
                                }
                            ];
                            return fn.apply(this, args.concat(slice.call(arguments)));
                        };
                    })(k, value);
                }
            }

            //此处对对象进行扩展，当前原型链已经存在该对象，便进行扩展
            if (_.isObject(klass.prototype[k]) && _.isObject(value) && (typeof klass.prototype[k] != 'function' && typeof value != 'fuction')) {
                //原型链是共享的，这里处理逻辑要改
                var temp = {};
                _.extend(temp, klass.prototype[k]);
                _.extend(temp, value);
                klass.prototype[k] = temp;
            } else {
                klass.prototype[k] = value;
            }
        }

        //静态属性继承
        //兼容代码，非原型属性也需要进行继承
        for (key in parent) {
            if (parent.hasOwnProperty(key) && key !== 'prototype' && key !== 'superclass')
                klass[key] = parent[key];
        }

        if (!klass.prototype.initialize)
            klass.prototype.initialize = function() {};

        klass.prototype.constructor = klass;

        return klass;
    };

})();

//时间间距类
(function() {
    var Unit = {
        year: 1000 * 60 * 60 * 24 * 365, //不考虑闰年
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60
    }
    /*
     规则：
     (1)1小时以内：刚刚
     (2)24小时以内：n小时
     (3)超过24小时：天
     (4)超过3天： 显示日期 6月15日
     产品说暂时不考虑超过年，
     目前还是设置好，
     (5)超过年用2014年6月15日，显示全

     依赖dateUtil
     */
    _.beforeIntervalTime = function(before, current) { //传入的值全部是毫秒
        current = current || new Date().getTime();
        var interval = current - before;
        if (interval < 0) return '参数错误';
        //规则(5)
        if (interval >= Unit.year) return _.dateUtil.format(before, 'Y年M月D日');
        //规则(4)
        if (interval >= Unit.day * 3) return _.dateUtil.format(before, 'M月D日');
        //规则(3)
        if (interval >= Unit.day) return Math.floor(interval / Unit.day) + '天前';
        //规则(2)
        if (interval >= Unit.hour) return Math.floor(interval / Unit.hour) + '小时前';
        //规则(1)
        if (interval >= 0) return '刚刚';
    };

    /*
     规则：
     (1)24小时以内：n小时n秒
     (2)超过24小时：天

     依赖dateUtil
     */
    _.afterIntervalTime = function(after, current) {
        current = current || new Date().getTime();
        var interval = after - current;
        if (interval < 0) return '00:00';
        //规则(2)
        if (interval >= Unit.day) return Math.floor(interval / Unit.day) + '天';
        //规则(1)
        if (interval >= 0) return Math.floor(interval / Unit.hour) + '小时' + Math.floor(interval % Unit.hour / Unit.minute) + '分';
    };

})();


//倒计时工具类
(function() {

    var timerKeys = {};

    _.countdownTimer = function(second, changeCallback, endCallback) {

        //首次得形成一个唯一的key
        var key = _.uniqueId('timer_');

        timerKeys[key] = 1;
        _.countdownRepeat(key, second, changeCallback, endCallback);

        return key;

    };

    _.clearCountdownTimer = function(key) {
        if (timerKeys[key]) {
            delete timerKeys[key];
            return;
        }
        for (var k in timerKeys) {
            delete timerKeys[k];
        }
    };

    _.countdownRepeat = function(key, second, changeCallback, endCallback) {

        if (!timerKeys[key]) return;

        if (second > 0) {
            changeCallback(second, key);
        } else {
            endCallback(second, key);
            return;
        }

        second--;

        setTimeout(function() {
            _.countdownRepeat(key, second, changeCallback, endCallback);
        }, 1000)
    };


})();

//基础方法
(function() {

    _.mySubstr = function(str, len, appendStr) {
        if (!str || !len) return;
        return str.length > len ? str.substr(0, len) + (appendStr || '...') : str;
    };

    _.getByteLen = function(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    };

    //中英文筛选,以中文为标准中文size为2英文数字为1
    _.mySubstr2 = function(str, len) {
        if (!str || !len) return;
        //计算真实的长度
        var _len = _.getByteLen(str);
        var tmpLen = 0;

        for (var i = 0; i < str.length; i++) {
            var length = str.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                tmpLen += 1;
            } else {
                tmpLen += 2;
            }
            if (tmpLen >= len * 2) break;
        }

        return str.length > i ? str.substr(0, i) + '...' : str;
    };

    _.removeHTMLTag = function(str) {
        if (!str) return;
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/ /ig, ''); //去掉
        return str;
    };

    // //获取url参数
    // //这个方法还是有问题
    _.getUrlParam = function(url, key) {
        if (!url) url = window.location.href;

        var searchReg = /([^&=?]+)=([^&]+)/g;
        var urlReg = /\/+.*\?/;
        var arrayReg = /(.+)\[\]$/;
        var urlParams = {};
        var match, name, value, isArray;

        while (match = searchReg.exec(url)) {
            name = match[1];
            value = match[2];
            isArray = name.match(arrayReg);
            //处理参数为url这种情况
            if (urlReg.test(value)) {
                urlParams[name] = url.substr(url.indexOf(value));
                break;
            } else {
                if (isArray) {
                    name = isArray[1];
                    urlParams[name] = urlParams[name] || [];
                    urlParams[name].push(value);
                } else {
                    urlParams[name] = value;
                }
            }
        }

        for (var k in urlParams) urlParams[k] = _.removeHTMLTag(decodeURIComponent(urlParams[k]));

        return key ? urlParams[key] : urlParams;
    };

    _.isWeiXin = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    _.isMedlinker = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/medlinker\/\d/i)) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * 自定义图片尺寸
     */
    _.formatQiniuImage = function(img, w, h) {
        var _w = w || 200,
          _h = h || '';
        if (img) {
            if (_h === '') {
                return img.indexOf('?') > -1 ? img + '&imageView2/2/w/' + _w : img + '?imageView2/2/w/' + _w;
            } else {
                return img.indexOf('?') > -1 ? img + '&imageView2/1/w/' + _w + '/h/' + _h : img + '?imageView2/1/w/' + _w + '/h/' + _h;
            }
        }

    };
    _.removeAllSpace = function(str) {
        if (str) str = str.toString();
        else return '';
        return str.replace(/\s+/g, "");
    };

})();


//日期操作类
(function() {

    /**
     * @description 静态日期操作类，封装系列日期操作方法
     * @description 输入时候月份自动减一，输出时候自动加一
     * @return {object} 返回操作方法
     */
    _.dateUtil = {

        //根据一个日期获取所有信息
        getDetail: function(date) {
            if (!date) date = new Date();
            var d, now = new Date(),
              dateInfo = {},
              _diff;
            var weekDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            if (_.isNumber(date)) {
                d = new Date();
                d.setTime(date);
                date = d;
            }

            //充值date对象，让其成为一天的起点时间
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            _diff = date.getTime() - now.getTime();

            if (_diff == 0) {
                dateInfo.day1 = '今天';
            } else if (_diff == 86400000) {
                dateInfo.day1 = '明天';
            } else if (_diff == 172800000) {
                dateInfo.day1 = '后天';
            }

            dateInfo.weekday = weekDayArr[date.getDay()];

            dateInfo.year = date.getFullYear();
            dateInfo.month = date.getMonth() + 1;
            dateInfo.day = date.getDate();

            return dateInfo;

        },

        /**
         * @description 数字操作，
         * @return {string} 返回处理后的数字
         */
        formatNum: function(n) {
            if (n < 10) return '0' + n;
            return n;
        },
        /**
         * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
         * @return {Date} 返回日期对象
         */
        parse: function(dateStr, formatStr) {
            if (typeof dateStr === 'undefined') return null;
            if (typeof formatStr === 'string') {
                var _d = new Date(formatStr);
                //首先取得顺序相关字符串
                var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
                if (!arrStr && arrStr.length != 3) return null;

                var formatStr = formatStr.replace(/y|m|d/g, function(k) {
                    switch (k) {
                        case 'y':
                            return '(\\d{4})';
                        case 'm':
                            ;
                        case 'd':
                            return '(\\d{1,2})';
                    }
                });

                var reg = new RegExp(formatStr, 'g');
                var arr = reg.exec(dateStr)

                var dateObj = {};
                for (var i = 0, len = arrStr.length; i < len; i++) {
                    dateObj[arrStr[i]] = arr[i + 1];
                }
                return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
            }
            return null;
        },
        /**
         * @description将日期格式化为字符串
         * @return {string} 常用格式化字符串
         */
        format: function(date, format) {
            if (arguments.length < 2 && !date.getTime) {
                format = date;
                date = new Date();
            } else if (arguments.length == 2 && _.isNumber(date) && _.isString(format)) {
                var d = new Date();
                d.setTime(date);
                date = d;
            }

            typeof format != 'string' && (format = 'Y年M月D日 H时F分S秒');
            return format.replace(/Y|y|M|m|D|d|H|h|F|f|S|s/g, function(a) {
                switch (a) {
                    case "y":
                        return (date.getFullYear() + "").slice(2);
                    case "Y":
                        return date.getFullYear();
                    case "m":
                        return date.getMonth() + 1;
                    case "M":
                        return _.dateUtil.formatNum(date.getMonth() + 1);
                    case "d":
                        return date.getDate();
                    case "D":
                        return _.dateUtil.formatNum(date.getDate());
                    case "h":
                        return date.getHours();
                    case "H":
                        return _.dateUtil.formatNum(date.getHours());
                    case "f":
                        return date.getMinutes();
                    case "F":
                        return _.dateUtil.formatNum(date.getMinutes());
                    case "s":
                        return date.getSeconds();
                    case "S":
                        return _.dateUtil.formatNum(date.getSeconds());
                }
            });
        },
        // @description 是否为为日期对象，该方法可能有坑，使用需要慎重
        // @param year {num} 日期对象
        // @return {boolean} 返回值
        isDate: function(d) {
            if ((typeof d == 'object') && (d instanceof Date)) return true;
            return false;
        },
        // @description 是否为闰年
        // @param year {num} 可能是年份或者为一个date时间
        // @return {boolean} 返回值
        isLeapYear: function(year) {
            //传入为时间格式需要处理
            if (_.dateUtil.isDate(year)) year = year.getFullYear()
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
            return false;
        },

        // @description 获取一个月份的天数
        // @param year {num} 可能是年份或者为一个date时间
        // @param year {num} 月份
        // @return {num} 返回天数
        getDaysOfMonth: function(year, month) {
            //自动减一以便操作
            month--;
            if (_.dateUtil.isDate(year)) {
                month = year.getMonth(); //注意此处月份要加1，所以我们要减一
                year = year.getFullYear();
            }
            return [31, _.dateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        // @description 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
        // @param year {num} 可能是年份或者为一个date时间
        // @param year {num} 月份
        // @return {num} 当月一号为星期几0-6
        getBeginDayOfMouth: function(year, month) {
            //自动减一以便操作
            month--;
            if ((typeof year == 'object') && (year instanceof Date)) {
                month = year.getMonth();
                year = year.getFullYear();
            }
            var d = new Date(year, month, 1);
            return d.getDay();
        },

        //不同时区皆返回北京时间
        getBeijingDate: function(d) {
            var tmp, localTime, localOffset, beijiTime, utc;
            if (!_.isDate(d)) {
                tmp = d;
                d = new Date();
                d.setTime(tmp);
            }

            //通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
            localTime = d.getTime();
            //当地时间偏移
            localOffset = d.getTimezoneOffset() * 60000;
            //标准时间
            utc = localTime + localOffset;

            //加上北京偏移量便是北京时区
            beijiTime = utc + 28800000;

            d.setTime(beijiTime);
            return d;
        },

        setBeijingDate: function(d) {
            var tmp, localTime, localOffset, beijiTime, utc;
            if (!_.isDate(d)) {
                tmp = d;
                d = new Date();
                d.setTime(tmp);
            }

            //通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
            localTime = d.getTime();
            //当地时间偏移
            localOffset = d.getTimezoneOffset() * 60000;
            //标准时间
            utc = localTime - localOffset;

            //加上北京偏移量便是北京时区
            beijiTime = utc - 28800000;

            d.setTime(beijiTime);
            return d;
        }

    };

})();


//Hybrid基本逻辑
(function() {
    window.Hybrid = window.Hybrid || {};
    window.Hybrid.ui = window.Hybrid.ui || {};
    //Hybrid.callback = function (data) {
    //    var callbackId = data.callback;
    //    if(!callbackId) return;
    //
    //    //alert(typeof data);
    //    //alert(callbackId);
    //    //
    //    //showFormatData(Hybrid);
    //
    //    if(typeof data == 'string') data = JSON.parse(data);
    //
    //    if(data.errno) data.errcode = 0;
    //
    //    data = data.data;
    //
    //    if(typeof data == 'string' && data.length > 0) data = JSON.parse(data);
    //
    //
    //    if(data.errcode !== 0) {
    //        APP && APP.showToast(data.errmsg);
    //        return;
    //    }
    //
    //    if(callbackId.indexOf('header_') != -1 && Hybrid['Header_Event']) {
    //        Hybrid['Header_Event'][callbackId] && Hybrid['Header_Event'][callbackId](data || {});
    //    } else {
    //        Hybrid[callbackId] && Hybrid[callbackId](data || {});
    //    }
    //    return true;
    //};

    Hybrid.callback = function(data) {
        var callbackId = data.callback;
        if (!callbackId) return;

        //alert(typeof data);
        //alert(callbackId);
        //
        //showFormatData(Hybrid);

        if (typeof data == 'string') data = JSON.parse(data);

        if (callbackId.indexOf('header_') != -1 && Hybrid['Header_Event']) {
            Hybrid['Header_Event'][callbackId] && Hybrid['Header_Event'][callbackId](data.data || {});
        } else {
            Hybrid[callbackId] && Hybrid[callbackId](data.data || {}, data);
        }
        return true;
    };

    var bridgePostMsg = function(params) {
        var url = _getHybridUrl(params);

        //兼容ios6
        var ifr = $('<iframe style="display: none;" src="' + url + '"/>');

        console.log(params.tagname + '-hybrid请求发出-' + new Date().getTime() + 'url: ' + url)

        //Android情况协议发的太快会有问题
        if ($.os.android) {
            setTimeout(function() {
                $('body').append(ifr);
            })
        } else {
            $('body').append(ifr);
        }
        setTimeout(function() {
            ifr.remove();
            ifr = null;
        }, 1000);

        return;

        if ($.os.ios) {
            //使用jsCore与native通信
            window.HybridRequestNative && HybridRequestNative(JSON.stringify(params));
        } else {
            //Android实现
            var ifr = $('<iframe style="display: none;" src="' + url + '"/>');
            $('body').append(ifr);
            setTimeout(function() {
                ifr.remove();
                ifr = null;
            }, 1000)
        }
    };

    var _getHybridUrl = function(params) {
        var k, paramStr = '',
          url = 'med' + (getHybridInfo().app || 'medlinker') + 'hybrid://',
          flag = '?';
        url += params.tagname; //时间戳，防止url不起效

        if (params.callback) {
            flag = '&';
            url += '?callback=' + params.callback;
            //delete params.callback;
        }
        if (params.param) {
            paramStr = typeof params.param == 'object' ? JSON.stringify(params.param) : params.param;
            url += flag + 'param=' + encodeURIComponent(paramStr);
        }
        return url;
    };

    _setEvent = function(t, tmpFn) {
        window.Hybrid[t] = function(data) {
            tmpFn(data);
            delete window.Hybrid[t];
        };
    };

    //处理组件通信的情况
    var _handleMessage = function(events, tagname) {
        var tmpFn, data = {};
        var t;

        for (var key in events) {
            t = 'hybrid_' + tagname + '_' + key;
            data[key] = t;
            tmpFn = events[key];
            _setEvent(t, tmpFn);
        }

        return data;
    };

    var requestHybrid = function(params) {
        if (!params.tagname) {
            alert('必须包含tagname');
        }
        //生成唯一执行函数，执行后销毁
        var tt = (new Date().getTime()) + '_' + _.uniqueId() + '_';
        var t = 'hybrid_' + params.tagname + '_' + tt;
        var tmpFn;

        ////针对组件通信做的特殊处理
        //if(params.param && params.param.events) {
        //    params.param.events =  _handleMessage(params.param.events, params.tagname);
        //}

        //处理有回调的情况
        if (params.callback) {
            tmpFn = params.callback;
            params.callback = t;

            window.Hybrid[t] = function(data) {

                console.log(params.tagname + '-hybrid请求响应-' + new Date().getTime())

                tmpFn(data);
                //delete window.Hybrid[t];
            }
        }

        bridgePostMsg(params);
    };

    var getHybridInfo = function() {
        var platform_version = {};
        var na = navigator.userAgent;
        na = na.toLowerCase();
        var info = na.match(/med_hybrid_\w+_\d\.\d\.\d/);

        if (info && info[0]) {
            info = info[0].split('_');
            if (info && info.length == 4) {
                platform_version.platform = info[1];
                platform_version.app = info[2];
                platform_version.version = info[3];
            }
        }

        //*debug* 调试模拟环境
        if (_.getUrlParam().__platform) {
            platform_version.platform = _.getUrlParam().__platform;
            platform_version.version = _.getUrlParam().__version;
        }

        return platform_version;
    };

    var getVer = function() {
        var ver = getHybridInfo().version.replace(/\./g, '');
        if (ver) return parseInt(ver);
        return 0;
    };

    //版本在多少
    var versionAt = function(ver) {
        if (ver == getVer()) return true;
        return false;
    };

    var versionBefore = function(ver) {
        if (getVer() < ver) return true;
        return false;

    };

    var versionAfter = function(ver) {
        if (getVer() > ver) return true;
        return false;
    };

    var hybridCallback = function(opts) {
        //undefined, baidu_bus,
        var platform = _.getHybridInfo().platform || 'web';
        var mapping = {
            'web': '',
            'baidubox': 'bdbox_',
            'baidu_bus': 'bdbus_'
        };
        var callbackName = mapping[platform] || '';
        // 如果没有定义渠道callback 则默认为普通callback
        var callback = opts[callbackName + 'callback'] || opts['callback'];
        if (typeof callback == 'function') callback();
    };

    var registerHeaderCallback = function(ns, name, callback) {
        if (!window.Hybrid[ns]) window.Hybrid[ns] = {};
        window.Hybrid[ns][name] = callback;
    };

    var unRegisterHeaderCallback = function(ns) {
        if (!window.Hybrid[ns]) return;
        delete window.Hybrid[ns];
    };

    var isHybrid = function() {
        return getHybridInfo().platform == 'hybrid';
    };

    _.registerHeaderCallback = registerHeaderCallback;
    _.unRegisterHeaderCallback = unRegisterHeaderCallback;

    _.getHybridInfo = getHybridInfo;
    _.requestHybrid = requestHybrid;

    window.requestHybrid = requestHybrid;

    _.hybridCallback = hybridCallback;
    _.versionAt = versionAt;
    _.versionBefore = versionBefore;
    _.versionAfter = versionAfter;
    _._getHybridUrl = _getHybridUrl;
    _.isHybrid = isHybrid;

    // -------------------
    // 代替openApp的一些功能
    var ua = navigator.userAgent.toLowerCase();
    var host = location.host;

    var ENV = {
        iOS: /(iphone|ipad|ipod|ios)/.test(ua),
        Android: /android/.test(ua),
        Chrome: /chrome/.test(ua),
        QQ: /qq\//.test(ua),
        weixin: /micromessenger/.test(ua),
        weibo: /weibo/.test(ua),
        momo: /momowebview/.test(ua),
        aliapp: /aliapp/.test(ua),
        medlinker: /med_hybrid_medlinker/.test(ua),
        ylt: /med_hybrid_surgery/.test(ua),
        dev: /dev.pdt5/.test(host),
        tset: /test.pdt5/.test(host),
        qa: /qa/.test(host)
    };

    ENV.version = (function() {
        var version = '';
        if (ENV.medlinker) {
            var match = ua.match(/medlinker\/([\d.]+)/);
            version = match && match[1] || version;
        }
        return version;
    }());

    ENV.matchVersion = function(v) {
        return (new RegExp('^' + v)).test(ENV.version);
    };

    ENV.gteVersion = function(v) {
        return (parseInt(ENV.version, 10) >= v);
    };

    // 支付
    var PAY = {};

    // 支付后的回调
    PAY.payCallBack = function(status) {
        _.requestHybrid({
            tagname: 'paycallback',
            param: {
                status: status
            }
        });
    };

    // 阿里支付
    PAY.payByAliPay = function(payInfo, Callback) {
        _.requestHybrid({
            tagname: 'paybyalipay',
            param: {
                payInfo: payInfo
            },
            callback: Callback
        });
    };

    // 微信支付
    PAY.payByWxPay = function(payInfo, Callback) {
        _.requestHybrid({
            tagname: 'paybywxpay',
            param: {
                payInfo: payInfo
            },
            callback: Callback
        });
    };

    //ios 内购
    PAY.iosbuy = function(pid, pnum) {
        _.requestHybrid({
            tagname: 'iosbuy',
            param: {
                pid: pid,
                pnum: pnum
            }
        });
    };


    //封装native跳转
    _.nativeForward = function (path, param) {
        if(!path) return;
        var topage = path;
        if(!param) param = {};
        var index = 0;
        var arr = [], tmp = {};

        for(var k in param ) {
            tmp = {};
            tmp.k = k;
            tmp.v = param[k];
            arr.push(tmp);
        }

        for(var i = 0, len = arr.length; i < len; i++) {
            if(i == 0) {
                topage += '?' + arr[i].k + '=' + encodeURIComponent(arr[i].v);
            } else {
                topage += '&' + arr[i].k + '=' + encodeURIComponent(arr[i].v);
            }
        }

        _.requestHybrid({
            tagname: 'forward',
            param: {
                topage: topage,
                type: 'native'
            }
        });
    };

    ENV = ENV || {};

    ENV.version = getHybridInfo().version || '';

    _.med = {
        env: ENV,
        payCallBack: PAY.payCallBack,
        payByAliPay: PAY.payByAliPay,
        payByWxPay: PAY.payByWxPay,
        iosbuy: PAY.iosbuy,
        open: function (url) {
            _.requestHybrid({
                tagname: 'forward',
                param: {
                    topage: url,
                    type: 'native'
                }
            });
        },
        setShareData: function (obj) {
            _.requestHybrid({
                tagname: 'share',
                param: {
                    title: obj.title,
                    desc: obj.desc,
                    image: obj.image,
                    link: obj.url
                },
                callback: function(data) {
                    //分享成功时候的回调
                }
            });
        },
        share: function (obj) {
            _.requestHybrid({
                tagname: 'share',
                param: {
                    title: obj.title,
                    desc: obj.desc,
                    image: obj.image,
                    link: obj.url
                }
            });
        },
        //***bug***此处需要蔡杨改造
        screenshot: function() {
            _.requestHybrid({
                tagname: 'medScreenshot'
            });
        },
        //***bug***此处需要蔡杨改造
        openLink: function (url) {

            //适配在浏览器里面打开app
            if(!isHybrid()) {
                //var url = window.location.href + extra;
                //return '/link?url=' + encodeURIComponent(url);

                window.location = 'medmedlinkerhybrid://link?url=' + encodeURIComponent(url);
                return;
            }

            _.requestHybrid({
                tagname: 'forward',
                param: {
                    topage: '/link?url=' + encodeURIComponent(url),
                    type: 'native'
                }
            });
        },
        medReward: function (type, id, callback ) {
            _.requestHybrid({
                tagname: 'medReward',
                param: {
                    dataId: id + '',
                    type: type
                },
                callback: function(data) {
                    callback && callback();
                }
            });
        },
        //***bug***此处需要蔡杨改造
        medComment: function (data ,callback) {
            //唤起输入文字的软键盘
            _.requestHybrid({
                tagname: 'showKeyboard',
                param: {

                    /*===图片参数===*/
                    //如果该键盘带参数的话一定要传以下参数
                    hasImg: 1, //必须传hasImg为1,否则认为键盘没有图片

                    //文件所属分类,包括（transform(出转诊),casem(病例), question(问题), post(帖子), help(求助), secret(深夜病房), logo, avatar(头像)，chat(聊天), idCard(身份证), profile(用户信息),panel, spread, media,live)
                    bucket: 'transform',
                    //1代表文件传入公共盘，所有人可以访问。0代表私人盘，需要授权访问
                    isPublic: 1,
                    //水印文字 ,如果没传参数则没有水印
                    //waterText: '水印文字',

                    //以下是基本参数
                    //1-9张限制
                    count: 1,
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    /*===图片参数===*/

                    /*键盘按钮文案
                     Done      —>    完成
                     Send      —>    发送
                     Search   —>  搜索
                     */
                    type: 'Done',
                    //如果设计了btnTxt type属性便失效,文本变成多行输入,并且多一个按钮,模仿头条
                    btnTxt: '确定',
                    value:  '',
                    tips: '',
                    textMin: 1, //文字要求最少输入字符数
                    textMax: 50000 //文字要求最多输入字符数
                },
                //输入结束的回调或者说点击发送时候的回调
                callback: function (data) {
                    callback(JSON.stringify({
                        text: data.text,
                        ids: data.ids,
                        urls: data.urls
                    }))
                }
            });
        }
    };

    //因为先加载我们这个再加载系统MED,所以我们这个会被覆盖
    window.MED = _.med;



})();