define([],function () {
    var Base64 = function () {
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function (bin) {
            var t = {};
            for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
            return t;
        }(b64chars);
        var fromCharCode = String.fromCharCode;
        var cb_utob = function (c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 0x80 ? c
                    : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | ( cc & 0x3f)));
            } else {
                var cc = 0x10000
                    + (c.charCodeAt(0) - 0xD800) * 0x400
                    + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | ( cc & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function (u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function (ccc) {
            var padlen = [0, 2, 1][ccc.length % 3],
                ord = ccc.charCodeAt(0) << 16
                    | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                    | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
                chars = [
                    b64chars.charAt(ord >>> 18),
                    b64chars.charAt((ord >>> 12) & 63),
                    padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                    padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
                ];
            return chars.join('');
        };
        var btoa = function (b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = function (u) {
            return btoa(utob(u))
        };
        var encode = function (u, urisafe) {
            return !urisafe
                ? _encode(String(u))
                : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
        };
        var encodeURI = function (u) {
            return encode(u, true)
        };
        var re_btou = new RegExp([
            '[\xC0-\xDF][\x80-\xBF]',
            '[\xE0-\xEF][\x80-\xBF]{2}',
            '[\xF0-\xF7][\x80-\xBF]{3}'
        ].join('|'), 'g');
        var cb_btou = function (cccc) {
            switch (cccc.length) {
                case 4:
                    var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                            | ((0x3f & cccc.charCodeAt(1)) << 12)
                            | ((0x3f & cccc.charCodeAt(2)) << 6)
                            | (0x3f & cccc.charCodeAt(3)),
                        offset = cp - 0x10000;
                    return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
                case 3:
                    return fromCharCode(
                        ((0x0f & cccc.charCodeAt(0)) << 12)
                        | ((0x3f & cccc.charCodeAt(1)) << 6)
                        | (0x3f & cccc.charCodeAt(2))
                    );
                default:
                    return fromCharCode(
                        ((0x1f & cccc.charCodeAt(0)) << 6)
                        | (0x3f & cccc.charCodeAt(1))
                    );
            }
        };
        var btou = function (b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function (cccc) {
            var len = cccc.length,
                padlen = len % 4,
                n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                    | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                    | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                    | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
                chars = [
                    fromCharCode(n >>> 16),
                    fromCharCode((n >>> 8) & 0xff),
                    fromCharCode(n & 0xff)
                ];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = function (a) {
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = function (a) {
            return btou(atob(a))
        };
        var decode = function (a) {
            return _decode(
                String(a).replace(/[-_]/g, function (m0) {
                    return m0 == '-' ? '+' : '/'
                })
                    .replace(/[^A-Za-z0-9\+\/]/g, '')
            );
        };
        return  { encode: encodeURI, decode: decode };
    }();

    var urlData = function () {
        var _prefix = '#urldata_';
        var _suffix = '_urldata';
        var _match = new RegExp(_prefix + '(.+?)' + _suffix);
        return {
            encode: function (data) {
                return _prefix + Base64.encode(JSON.stringify(data)) + _suffix;
            },
            encodeWithHash: function (data) {
                return window.location.hash + this.encode(data);
            },
            decode: function () {
                var data = Base64.decode((window.location.hash.replace(/^#+/, '#').match(_match) || [])[1] || '');
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return {};
                }
            },
            clean: function (url) {
                return (url || window.location.hash).replace(_match, '');
            }
        };
    }();

    var ua = navigator.userAgent.toLowerCase();
    var imagePath = '//www.medlinker.com/src/m/common/img';
    var dummy = function () {
    }

    //环境变量
    var ENV = {
        iOS: /(iphone|ipad|ipod|ios)/.test(ua),
        Android: /android/.test(ua),
        Chrome: /chrome/.test(ua),
        QQ: /qq\//.test(ua),
        weixin: /micromessenger/.test(ua),
        weibo: /weibo/.test(ua),
        momo: /momowebview/.test(ua),
        aliapp: /aliapp/.test(ua),
        medlinker: /medlinker/.test(ua)
    };

    ENV.restricted = ENV.weixin || ENV.weibo || ENV.momo || ENV.aliapp || ENV.QQ;

    ENV.version = (function () {
        var version = '';
        if (ENV.medlinker) {
            var match = ua.match(/medlinker\/([\d.]+)/);
            version = match && match[1] || version;
        }
        return version;
    }());

    ENV.matchVersion = function (v) {
        return (new RegExp('^' + v)).test(ENV.version);
    }

    var gte = ENV.gteVersion = function (v) {
        return (parseInt(ENV.version, 10) >= v);
    }

    function each(array, fn) {
        for (var i = 0; i < array.length; ++i) {
            fn(array[i], i);
        }
    }

    function filter(array, fn) {
        var ret = [];
        each(array, function (n, i) {
            if (fn(n, i)) ret.push(n);
        });
        return ret;
    }

    function map(array, fn) {
        var ret = [];
        each(array, function (el, i) {
            ret.push(fn(el, i));
        });
        return ret;
    }

    function mixin() {
        var mix = {};
        each(arrayOf(arguments), function (arg) {
            for (var name in arg) {
                if (arg[name]) {
                    mix[name] = arg[name];
                }
            }
        });
        return mix;
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function arrayOf(arrayLike) {
        return [].slice.call(arrayLike || []);
    }

    function redirect(url) {
        if (url) {
            window.location.href = url;
        }
    }

    function isObject(obj) {
        return Object.prototype.toString.call(obj) == '[object Object]';
    }

    function isArray(arr) {
        return Array.isArray
            ? Array.isArray(arr)
            : Object.prototype.toString.call(arr) == '[object Array]';
    }

    function appendStyle(rules) {
        var style = document.createElement('style');
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            head.appendChild(style);
        }
        style.styleSheet
            ? style.styleSheet.cssText = rules
            : style.innerHTML = rules;
    }

    function normalizeLink(link) {
        return (link || '')
            .replace(/^\/+/, '/')
            .replace(/(\/link\?url=|\/link\/external\?url=)(.+)/, function (all, a, b) {
                return a + encodeURIComponent(b);
            });
    }

    function addDefaultHost(link) {
        if (/^http/.test(link)) return link;
        return (window.location.protocol || 'http:') + '//' + window.location.host + link;
    }

    function fixUserCompat(link) {
        if (isUserAction(link) && gte(3) && !/type=/.test(link)) {
            link = link + '&type=1';
        }
        return link;
    }

    function fixCircleCompat(link) {
        if (/\/circle/.test(link)) {
            var sub = gte(3) ? 'detail?' : 'item?';
            link = link.replace(/\/circle\/(item|detail)\?/, '/circle/' + sub);
        }
        return link;
    }

    function getLink(href) {
        var link = '';
        if (!/[\/#\?&]openapp/.test(href)) return link;
        if (/openapp=/.test(href)) {
            link = href.split(/openapp=/)[1] || '/';
        } else {
            link = href.split(/openapp\/?\?path=/)[1] || '/';
        }
        return normalizeLink(link);
    }

    function replaceAlias(data, alias, name) {
        var aliases = alias;
        if (!isObject(data)) return false;
        if (!isArray(aliases)) aliases = [alias];
        each(aliases, function (as) {
            if (data[as] !== undefined) {
                data[name] = data[as];
                delete data[as];
            }
        });
    }

    function isShareAction(href) {
        return /^\/?share/.test(href);
    }

    function isMailAction(href) {
        return /^\/?mailto/.test(href);
    }

    function isCirlceDetailAction(href) {
        return /\/circle\/(item|detail)/.test(href);
    }

    function isUserAction(href) {
        return /\/user\/home\?userId=/.test(href);
    }

    function getMailAddress(link) {
        return (link || '').replace(/^\/mailto[:\/]/, '');
    }

    function getHost() {
        return 'www.medlinker.net';
    }

    function getParameterByName(name, link) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(link || location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function serialize(data) {
        if (!isObject(data)) {
            data = {}
        }
        ;
        var ret = [];
        for (var name in data) {
            if (data.hasOwnProperty(name)) {
                var val = data[name];
                if (val !== null && val !== undefined && val !== '') {
                    ret.push(encodeURIComponent(name) + '=' + encodeURIComponent(val));
                }
            }
        }
        return ret.join('&').replace(/%20/g, '+')
    }

    function composeMedlinkerUrl(href) {
        var path = getHost() + href;
        if (ENV.Android && ENV.Chrome) {
            return 'intent://' + path + "#Intent;scheme=medlinker;package=net.medlinker.medlinker;end";
        } else {
            return 'medlinker://' + path;
        }
    }

    function updateDownloadButton() {
        var buttonClass = '.download-app-button';
        var buttons = document.querySelectorAll(buttonClass);
        if (!buttons.length) return false;
        for (var i = 0; i < buttons.length; ++i) (function (button) {
            var hasChannel = button.getAttribute('data-channel');
            button.addEventListener('click', function (e) {
                if (ENV.restricted && hasChannel) {
                    e.preventDefault();
                    Guide.show();
                }
            });
        }(buttons[i]));

        if (/redirect=true/.test(window.location.search)) {
            var button = document.querySelector(buttonClass);
            if (!button) return false;
            var href = button.getAttribute('href');
            var hasChannel = button.getAttribute('data-channel');
            if (!href) return false;
            if (ENV.restricted && hasChannel) {
                Guide.show();
            } else {
                redirect(href);
            }
        }
    }

    //在非默认浏览器内 引导提示
    var Guide = function () {
        var body = document.body;
        var guide = document.createElement('div');
        var delay;
        appendStyle([
            '.med-open-in-browser-mask { position: fixed; top: 0; left: 0; bottom: 0; right: 0; background-color: #000; background-color: rgba(0, 0, 0, .9); z-index: 20000000; text-align: right;}',
            '.med-open-in-browser-mask img { max-width: 80%; padding: 1em 2em; margin-left: 1em;}'
        ].join(''));

        guide.innerHTML = ([
            '<div class="med-open-in-browser-mask">',
            '<img src="' + imagePath + '/' + (ENV.iOS ? 'open-in-safari' : 'open-in-browser') + '.png"/>',
            '</div>'
        ]).join('');
        return {
            init: function () {
                delay = true;
                setTimeout(function () {
                    delay = false;
                }, 400);
                if (!this.inited) {
                    document.body.appendChild(guide);
                    this.inited = true;
                    guide.addEventListener('click', function () {
                        Guide.hide();
                        return false;
                    });
                }
            },
            show: function () {
                this.init();
                guide.style.display = 'block';
            },
            hide: function () {
                if (delay) return false;
                guide.style.display = 'none';
            }
        }
    }();

    // IOS 桥
    // https://github.com/ochameau/NativeBridge/blob/master/NativeBridge.js
    var NativeBridge = window.NativeBridge = {
        callbacksCount: 1,
        callbacks: {},
        resultForCallback: function resultForCallback(callbackId, resultArray) {
            try {
                var callback = NativeBridge.callbacks[callbackId];
                if (!callback) return;
                callback.apply(null, resultArray);
            } catch (e) {
                alert(e)
            }
        },
        call: function call(functionName, args, callback) {
            var hasCallback = callback && typeof callback == "function";
            var callbackId = hasCallback ? NativeBridge.callbacksCount++ : 0;
            if (hasCallback) {
                NativeBridge.callbacks[callbackId] = callback;
            }
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", "js-frame:" + functionName + ":" + callbackId + ":" + encodeURIComponent(JSON.stringify(args)));
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }
    };

    //全局入口
    var MED = {};

    //回调方法容器
    var callBackStack = {};

    MED.origin = function () {
        var methods = {
            medOpen: dummy,
            medShare: dummy,
            medSetShareData: dummy,
            medGetSess: dummy,
            medSendMail: dummy,
            medCallapp: dummy,
            medAlert: function (msg) {
                alert(msg)
            }
        };

        function shareArguments(data) {
            data.url = addDefaultHost(data.url);
            data.image = addDefaultHost(data.image);
            var group1 = [data.title, data.desc, data.url, data.image];
            var group2 = [data.desc, data.title, data.image, data.url];
            if (ENV.iOS) {
                // iOS 3.0 后参数顺序改成和Android一致
                return gte(3) ? group1 : group2;
            } else {
                return group1;
            }
        }

        function fallBackAlert(fn, msg, ctx) {
            return function () {
                if (gte(3)) {
                    return fn.apply(ctx, arguments);
                } else {
                    alert(msg || arguments[0]);
                }
            }
        }

        function gte3Only(fn) {
            return fallBackAlert(fn, "请升级到最新版本以使用更多功能!");
        }

        if (!ENV.medlinker) return methods;
        var Medlinker = window.Medlinker || {};


        ENV.iOS && (methods = {
            medOpen: function (url) {
                return NativeBridge.call('medOpen', arrayOf(arguments), dummy);
            },
            medShare: function (data) {
                return NativeBridge.call('medShare', shareArguments(data), dummy);
            },
            medSetShareData: function (data) {
                return NativeBridge.call('medSetShareData', shareArguments(data), dummy);
            },
            medSendMail: gte3Only(function (email, fn) {
                return NativeBridge.call('medSendMail', arrayOf(arguments), dummy);
            }),
            medCallapp: function () {
                var argsArr = arrayOf(arguments);
                var funname = argsArr.shift();
                return NativeBridge.call(funname, argsArr, dummy);
            },
            medAlert: fallBackAlert(function (msg, type, fn) {
                return NativeBridge.call('medAlert', arrayOf(arguments), dummy);
            }),

            payByAliPay:function(payInfo,Callback){
                return NativeBridge.call('payByAliPay', arrayOf(arguments), Callback);
            },
            payByWxPay:function(payInfo,Callback){
                return NativeBridge.call('payByWxPay', arrayOf(arguments), Callback);

            },
            payCallBack:function(status){
                return NativeBridge.call('payCallBack',arrayOf(arguments),dummy());
            },
            navigator: {
                accelerometer: {
                    getCurrentAcceleration: function (onSuccess) {
                        return NativeBridge.call('navigator.accelerometer.getCurrentAcceleration', [], onSuccess);
                    },
                    watchAcceleration: function (onSuccess, period) {
                        return NativeBridge.call('navigator.accelerometer.watchAcceleration', [period], onSuccess);
                    },
                    clearWatch: function () {
                        return NativeBridge.call('navigator.accelerometer.clearWatch', [], dummy);

                    }
                },
                vibrate: function (time) {
                    return NativeBridge.call('navigator.vibrate', [time]);
                },
                compass: {
                    getCurrentHeading: function (onSuccess) {
                        return NativeBridge.call('navigator.compass.getCurrentHeading', [], onSuccess);
                    },
                    watchHeading: function (onSuccess, period) {
                        return NativeBridge.call('navigator.compass.watchHeading', [period], onSuccess);
                    },
                    clearWatch: function () {
                        return NativeBridge.call('navigator.compass.clearWatch', [], dummy);
                    }
                },
                geolocation: {
                    getCurrentPosition: function (onSuccess) {
                        return NativeBridge.call('navigator.geolocation.getCurrentPosition', [], onSuccess);
                    },
                    watchPosition: function (onSuccess, period) {
                        return NativeBridge.call('navigator.geolocation.watchPosition', [period], onSuccess);
                    },
                    clearWatch: function () {
                        return NativeBridge.call('navigator.geolocation.clearWatch', [], dummy);
                    }
                },
                notification: {
                    alert: function (array, Callback) {
                        this.dialog(array, Callback);
                    },
                    confirm: function (array, Callback) {
                        this.dialog(array, Callback);
                    },
                    dialog: function (array, Callback) {
                        return NativeBridge.call('navigator.notification.dialog', array, Callback);
                    }
                },
                image: {
                    camera: function (onSuccess) {
                        return NativeBridge.call('navigator.image.camera', [], onSuccess);
                    },
                    album: function (onSuccess) {
                        return NativeBridge.call('navigator.image.album', [], onSuccess);
                    }
                }
            }

        });

        ENV.Android && (methods = {
            medOpen: function (url) {
                try {
                    return Medlinker.medOpen && Medlinker.medOpen(url);
                } catch (e) {
                    MED.origin.medAlert("打开失败!");
                }
            },
            medShare: function (data) {
                return Medlinker.medShare &&
                    Medlinker.medShare.apply(Medlinker, shareArguments(data));
            },
            medSetShareData: function (data) {
                return Medlinker.medSetShareData &&
                    Medlinker.medSetShareData.apply(Medlinker, shareArguments(data));
            },
            medSendMail: gte3Only(function (email) {
                try {
                    return Medlinker.medSendMail && Medlinker.medSendMail(email) ||
                        MED.origin.medAlert("请升级医联App以便使用更多功能!");
                } catch (e) {
                    MED.origin.medAlert("email格式错误或手机上未安装客户端!", 1);
                }
            }),
            medCallapp: function () {
                var argsArr = arrayOf(arguments);
                var funname = argsArr.shift();
                Medlinker[funname].apply(Medlinker, argsArr);
            },
            medAlert: fallBackAlert(function (text, type) {
                if (Medlinker.medAlert) {
                    Medlinker.medAlert(text, type);
                } else {
                    alert(text);
                }
            }),

            payByAliPay:function(payInfo,Callback){
                if (!callBackStack['payByAliPay-one']) {
                    callBackStack['payByAliPay-one'] = Callback;
                }
                return Medlinker.payByAliPay(payInfo,'payByAliPay-one');
            },
            payByWxPay:function(payInfo,Callback){
                if (!callBackStack['payByWxPay-one']) {
                    callBackStack['payByWxPay-one'] = Callback;
                }
                return Medlinker.payByWxPay(payInfo,'payByWxPay-one');

            },
            payCallBack:function(status){
                return Medlinker.payCallBack(status);
            },
            navigator: {
                accelerometer: {
                    getCurrentAcceleration: function (Callback) {
                        Callback(Medlinker.navigatorAccelerometerGetCurrentAcceleration());
                    },
                    watchAcceleration: function (Callback, period) {
                        if (!callBackStack['watchAcceleration']) {
                            callBackStack['watchAcceleration'] = Callback;
                        }
                        Medlinker.navigatorAccelerometerWatchAcceleration(period, 'watchAcceleration');
                    },
                    clearWatch: function () {
                        Medlinker.navigatorAccelerometerClearWatch();
                        if (callBackStack['watchAcceleration']) {
                            delete callBackStack['watchAcceleration'];

                        }
                    }
                },
                vibrate: function (time) {
                    Medlinker.navigatorVibrate(time);
                },
                compass: {
                    getCurrentHeading: function (Callback) {
                        Callback(Medlinker.navigatorCompassGetCurrentHeading());
                    },
                    watchHeading: function (Callback, period) {
                        if (!callBackStack['watchHeading']) {
                            callBackStack['watchHeading'] = Callback;
                        }
                        Medlinker.navigatorCompassWatchHeading(period, 'watchHeading');

                    },
                    clearWatch: function () {
                        if (callBackStack['watchHeading']) {
                            delete callBackStack['watchHeading'];

                        }
                        Medlinker.navigatorCompassClearWatch();
                    }
                },
                geolocation: {
                    getCurrentPosition: function (Callback) {
                        Callback(Medlinker.navigatorGeolocationGetCurrentPosition());
                    },
                    watchPosition: function (Callback, period) {
                        if (!callBackStack['watchPosition']) {
                            callBackStack['watchPosition'] = Callback;
                        }
                        Medlinker.navigatorGeolocationWatchPosition(period, 'watchPosition');

                    },
                    clearWatch: function () {
                        if (callBackStack['watchPosition']) {
                            delete callBackStack['watchPosition'];

                        }
                        Medlinker.navigatorGeolocationClearWatch();

                    }
                },
                notification: {
                    alert: function (array, Callback) {
                        this.dialog(array, Callback);
                    },
                    confirm: function (array, Callback) {
                        this.dialog(array, Callback);
                    },
                    dialog: function (array, Callback) {
                        if (!callBackStack['dialog-one'] && Callback) {
                            callBackStack['dialog-one'] = Callback;
                        }
                        Medlinker.navigatorNotificationDialog(array, 'dialog-one');
                    }
                },
                image: {
                    camera: function (Callback) {
                        if (!callBackStack['camera-one'] && Callback) {
                            callBackStack['camera-one'] = Callback;
                        }
                        Medlinker.navigatorImageCamera('camera-one');
                    },
                    album: function (Callback) {
                        if (!callBackStack['album-one'] && Callback) {
                            callBackStack['album-one'] = Callback;
                        }
                        Medlinker.navigatorImageAlbum('album-one');
                    }
                },
                AndroidCall: function (methodName, arg) {
                    if (methodName && typeof callBackStack[methodName] == "function") {
                        callBackStack[methodName].apply(null, [arg]);
                        if (methodName.lastIndexOf('-one') > 0) {
                            delete callBackStack[methodName];
                        }
                    }
                }
            }

        });

        return methods;
    }();

    var domready = function () {
        var fns = [], listener;
        var doc = document;
        var domContentLoaded = 'DOMContentLoaded';
        var loaded = /^loaded|^i|^c/.test(doc.readyState);
        if (!loaded) {
            doc.addEventListener(domContentLoaded, listener = function () {
                doc.removeEventListener(domContentLoaded, listener);
                loaded = 1;
                while (listener = fns.shift()) listener();
            })
        }
        return function (fn) {
            loaded ? fn() : fns.push(fn)
        }
    }();

    function getShareData(el) {
        if (isObject(el)) return el;
        var body = document.body;
        el = el || body;
        var data = {};
        each(['title', 'desc', 'url', 'image'], function (name) {
            var attr = 'data-share-' + name;
            data[name] = el.getAttribute(attr) || body.getAttribute(attr);
        });
        if (!data.image) {
            data.image = el.getAttribute('data-share-img') || body.getAttribute('data-share-img');
        }
        if (!data.desc) {
            data.desc = el.getAttribute('data-share-content') || body.getAttribute('data-share-content');
        }
        return data;
    }

    function getLogAttribute(el) {
        var ret = {};
        if (!el) return ret;
        each(
            filter(arrayOf(el.attributes), function (n) {
                return /data\-log/.test(n.name);
            }),
            function (obj) {
                ret[obj.name.replace('data-log-', '')] = obj.value;
            }
        );
        return ret;
    }

    function getLogData(el) {
        if (isObject(el)) return el;
        var data = getLogAttribute(el);
        each(['activityId', 'userId', 'sess', 'action', 'version', 'behavior'], function (name) {
            if (!data[name]) {
                if (name == 'sess') {
                    data[name] = getParameterByName(name) || getCookie(name);
                } else if (name == 'activityId') {
                    data[name] = data['activityid'] || getParameterByName('__activityId') || getCookie(name);
                    delete data['activityid'];
                } else if (name == 'userId') {
                    data[name] = data['userid'] || getParameterByName(name) || getCookie(name);
                    delete data['userid'];
                } else if (name == 'behavior') {
                    replaceAlias(data, 'name', 'behavior');
                } else if (name == 'action') {
                    data[name] = 1;
                } else if (name == 'version') {
                    data[name] = ENV.version;
                } else {
                    data[name] = getParameterByName(name);
                }
            }
        });
        return data;
    }

    function appendInappAction(link, extra) {
        var url = window.location.href + extra;
        if (!/sess=/.test(url)) {
            url += '&sess=sess';
        }
        return '/link?url=' + encodeURIComponent(url);
    }

    function fallbackRedirect(href, fallback) {
        if (ENV.Android) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute("style", "display:none;");
            iframe.src = href;
            document.body.appendChild(iframe);
            setTimeout(function () {
                iframe && iframe.parentNode.removeChild(iframe);
                iframe = null;
            }, 200);
        } else {
            redirect(href);
        }
        if (ENV.medlinker) {
            return false;
        }
        setTimeout(function () {
            redirect(fallback);
        }, 2e3);
    }

    function tryOpen(href, fallback) {
        if (ENV.restricted) {
            return Guide.show();
        }
        if (ENV.Android || ENV.iOS) {
            fallbackRedirect(href, fallback || 'http://www.medlinker.com/m/');
        } else {
            redirect(fallback);
        }
    }

    function cleanHash() {
        window.location.hash = urlData.clean();
    }

    function initializeInsideMed() {
        if (ENV.medlinker) {
            var shareData = getShareData(document.body);
            if (shareData.url) {
                MED.origin.medSetShareData(shareData);
            }
            var share = document.getElementById('medlinker-share');
            if (!share) {
                share = document.createElement('meta');
                share.id = 'medlinker-share';
                share.setAttribute('name', share.id);
                share.setAttribute('share-title', shareData.title);
                share.setAttribute('share-content', shareData.desc);
                share.setAttribute('share-url', shareData.url);
                share.setAttribute('share-image', shareData.image);
                var head = document.querySelector('head');
                if (head) {
                    head.appendChild(share);
                }
            }

            var extra = urlData.decode();
            if (extra.url) {
                MED.origin.medShare(mixin(getShareData(), extra))
                cleanHash();
            }
            if (extra.email) {
                MED.origin.medSendMail(extra.email);
                cleanHash();
            }
            if (extra.openlink) {
                setTimeout(function () {
                    MED.open(extra.openlink);
                    cleanHash();
                });
            }
        }
    }


    MED.env = ENV;

    var medConfig = {
        fallbackUrl: '',
        autoLog: true

    }
    /**
     * js调用app的方法
     * @paran app方法名，参数...
     */
    MED.callapp = function () {
        MED.origin.medCallapp(arguments);
    };

    MED.config = function (data) {
        medConfig = mixin(medConfig, data);
    }

    MED.period = {
        FAST: 0,
        NORMAL: 2,
        SLOW: 3
    };

    MED.open = function (link, data) {
        if (!link) return false;
        link = link.replace(/^\/?openapp\?path=/, '');
        link = fixCircleCompat(link);
        link = fixUserCompat(link);

        if (!ENV.medlinker) {
            if (isShareAction(link)) {
                link = appendInappAction(link, urlData.encodeWithHash(data));
            }
            if (isMailAction(link)) {
                link = appendInappAction(link, urlData.encodeWithHash({
                    'email': getMailAddress(link)
                }));
            }
            if (isCirlceDetailAction(link) || isUserAction(link)) {
                link = appendInappAction(link, urlData.encodeWithHash({
                    'openlink': link
                }));
            }
            tryOpen(composeMedlinkerUrl(link), medConfig.fallbackUrl);
        } else {
            if (/^\/share/.test(link)) {
                MED.origin.medShare(mixin(getShareData(), data));
            } else if (/^\/mailto/.test(link)) {
                MED.origin.medSendMail(getMailAddress(link));
            } else {
                MED.origin.medOpen(link);
            }
        }
    }

    MED.openLink = function (link) {
        if (/app\/activity/.test(link)) {
            return MED.openActivityLink(link);
        }
        return MED.open('/link?url=' + encodeURIComponent(link));
    }

    MED.openLinkExternal = function (link) {
        return MED.open('/link/external?url=' + encodeURIComponent(link));
    }

    MED.openActivityLink = function (link, extra) {
        var data = getLogData();
        var exists = {
            sess: getParameterByName('sess', link) || 'sess',
            __activityId: getParameterByName('__activityId', link)
        };

        if (exists.sess != 'sess') {
            delete exists.sess;
        }

        link += ((/\?/.test(link)) ? '&' : '?') + serialize(
            mixin({
                __activityId: data.activityId
            }, exists, extra)
        );
        return MED.open('/link?url=' + encodeURIComponent(link));
    }

    MED.share = function (data) {
        MED.open('/share', data);
    }

    MED.mailto = function (email) {
        MED.open('/mailto:' + email);
    }

    MED.setShareData = function (data) {
        var shareData = mixin(getShareData(), data);
        return MED.origin.medSetShareData(shareData);
    }

    MED.alert = function (msg) {
        return MED.origin.medAlert(msg, 1);
    }

    MED.copyMedlinker = function (msg) {
        return MED.origin.medAlert(msg || '复制medlinker到剪切版?', 10);
    }

    MED.showValidation = function (msg) {
        return MED.origin.medAlert(msg, 11);
    }

    MED.payByAliPay=function(payInfo,callBack){
        return MED.origin.payByAliPay(payInfo,callBack);

    }
    MED.payByWxPay=function(payInfo,callBack){
        return MED.origin.payByWxPay(payInfo,callBack);

    }
    MED.payCallBack=function(status){
        return MED.origin.payCallBack(status);
    }
    //摇一摇业务封装
    MED.shakeShake = function (callBack) {
        var lastTime = lastX = lastY = lastZ = 0;

        var finish = false;

        function onChange(acceleration) {
            var acceleration = JSON.parse(acceleration);
            var timeInterval = acceleration.timestamp - lastTime;

            if (finish || timeInterval < 200) {
                return;
            }
            lastTime = acceleration.timestamp;

            var dx = acceleration.x - lastX;
            var dy = acceleration.y - lastY;
            var dz = acceleration.z - lastZ;

            var speed = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2)) / timeInterval * 1000;
            if (speed >= 130) {
                finish = true;
                callBack();
            }
        }

        var instance = {
            start: function () {
                finish = false;
                MED.navigator.accelerometer.watchAcceleration(onChange, MED.period.SLOW);
            },
            stop: function () {
                finish = true;
                MED.navigator.accelerometer.clearWatch();
            }
        }

        return instance;
    }

    //ios 的频率的单位是秒。而android是5个级别。需要做一下转换
    function periodConvert(period) {
        if (ENV.Android) {
            return period;
        } else if (ENV.iOS) {
            return 1 / Math.pow(10, period);
        }
    }

    //3.1新增的访问底层硬件方法
    MED.navigator = {
        //运动传感器
        accelerometer: {
            getCurrentAcceleration: function (onSuccess) {
                return MED.origin.navigator.accelerometer.getCurrentAcceleration(onSuccess);
            },
            watchAcceleration: function (onSuccess, period) {

                return MED.origin.navigator.accelerometer.watchAcceleration(onSuccess, periodConvert(period));
            },
            clearWatch: function () {
                return MED.origin.navigator.accelerometer.clearWatch();
            }
        },
        //震动
        vibrate: function (time) {
            return MED.origin.navigator.vibrate(time);
        },
        //罗盘
        compass: {
            getCurrentHeading: function (onSuccess) {
                return MED.origin.navigator.compass.getCurrentHeading(onSuccess);
            },
            watchHeading: function (onSuccess, period) {
                return MED.origin.navigator.compass.watchHeading(onSuccess, periodConvert(period));
            },
            clearWatch: function () {
                return MED.origin.navigator.compass.clearWatch();
            }
        },
        //位置
        geolocation: {
            getCurrentPosition: function (onSuccess) {
                return MED.origin.navigator.geolocation.getCurrentPosition(onSuccess);
            },
            watchPosition: function (onSuccess, period) {
                return MED.origin.navigator.geolocation.watchPosition(onSuccess, periodConvert(period));
            },
            clearWatch: function () {
                return MED.origin.navigator.geolocation.clearWatch();
            }
        },
        //对话框组件  对外暴露3个方法。底层通过一个dialog 方法代理
        notification: {
            alert: function (msg, title, buttonName, onSuccess) {
                !title && '';
                !msg && '';
                !buttonName && '确定';
                this.dialog([msg, title, buttonName], onSuccess);
            },
            confirm: function (msg, title, buttonName1, buttonName2, onSuccess) {
                !title && '';
                !msg && '';
                !buttonName1 && '是';
                !buttonName2 && '否';
                this.dialog([msg, title, buttonName1, buttonName2], onSuccess);
            },
            dialog: function (array, onSuccess) {
                return MED.origin.navigator.notification.dialog(array, onSuccess);
            }
        },
        //相机 ，相册。目前的实现为app端上传到七牛然后返回url
        image: {
            camera: function (onSuccess) {
                return MED.origin.navigator.image.camera(onSuccess);
            },
            album: function (onSuccess) {
                return MED.origin.navigator.image.album(onSuccess);
            }
        },
        //android 异步回调 的通信方法
        AndroidCall: function (methodName, arg) {
            return MED.origin.navigator.AndroidCall(methodName, arg);
        }
    };

    var logConfig = {
        url: '/loger/actBehavior',
        request: function (url, data) {
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            req.send(serialize(data));
            return req;
        }
    };

    var logData = getLogData();

    MED.setLogConfig = function (data) {
        if (isObject(data)) {
            logConfig = mixin(logConfig, data);
        }
        return MED;
    }

    MED.getLogConfig = function () {
        return mixin(logConfig);
    }

    MED.setLogData = function (data) {
        if (!isObject(data)) data = {};
        replaceAlias(data, ['name'], 'behavior');
        replaceAlias(data, ['activityid', 'activity-id'], 'activityId');
        logData = mixin(logData, data);
        return MED;
    }

    MED.getLogData = function () {
        return mixin(logData);
    }

    MED.log = function (data) {
        if (typeof data == 'string') {
            data = { behavior: data };
        }

        if (!isObject(data)) {
            data = {};
        }

        replaceAlias(data, ['name'], 'behavior');
        replaceAlias(data, ['activityid', 'activity-id'], 'activityId');

        var data = mixin(logData, data);
        if (data.debug || !data.behavior || !data.activityId) return false;
        delete data['debug'];
        logConfig.request(logConfig.url, data);
    }

    domready(function () {
        updateDownloadButton();
        initializeInsideMed();
        var actionLink = getLink(window.location.href);
        if (actionLink) {
            MED.open(actionLink);
        }

        MED.setLogData({
            platform: 'web'
        });

        document.body.addEventListener('click', function (e) {
            var target = e.target || e.srcElement;
            var times = 0;
            if (target) {
                while (target && target.tagName && target.tagName.toLowerCase && target.tagName.toLowerCase() != 'a') {
                    if (++times > 20) break;
                    target = target.parentNode;
                }

                if (medConfig.autoLog) {
                    var logData = getLogData(target);
                    if (logData.behavior) {
                        MED.log(logData);
                    }
                }

                var href = target.getAttribute && target.getAttribute('href') || '';
                var link = getLink(href);
                if (link) {
                    e.preventDefault();
                    MED.open(link, getShareData(target));
                }
            }
        });
    });
    window[window.MED ? '_MED' : 'MED'] = MED;
    return MED;
});
