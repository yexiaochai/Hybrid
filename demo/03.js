define([], function () {

    var Model = _.inherit({
        //默认属性
        propertys: function () {
            this.protocol = 'http';
            this.domain = '';
            this.path = '';
            this.url = null;
            this.param = {};
            this.validates = [];
            //      this.contentType = 'application/json';

            this.ajaxOnly = true;

            this.contentType = 'application/x-www-form-urlencoded';
            this.type = 'GET';
            this.dataType = 'json';
        },

        setOption: function (options) {
            _.extend(this, options);
        },

        assert: function () {
            if (this.url === null) {
                throw 'not override url property';
            }
        },

        initialize: function (opts) {
            this.propertys();
            this.setOption(opts);
            this.assert();
        },

        pushValidates: function (handler) {
            if (typeof handler === 'function') {
                this.validates.push($.proxy(handler, this));
            }
        },

        setParam: function (key, val) {
            if (typeof key === 'object') {
                _.extend(this.param, key);
            } else {
                this.param[key] = val;
            }
        },

        //override
        getParam: function () {
            return this.param;
        },

        //override
        //构建url请求方式，子类可复写，我们的model如果localstorage设置了值便直接读取，但是得是非正式环境
        buildurl: function () {
            throw "[ERROR]abstract method:buildurl, must be override";
        },

        onDataSuccess: function () {
        },

        /**
         *    取model数据
         *    @param {Function} onComplete 取完的回调函
         *    传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
         *    @param {Function} onError 发生错误时的回调
         *    @param {Boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
         * @param {Boolean} scope 可选，设定回调函数this指向的对象
         * @param {Function} onAbort 可选，但取消时会调用的函数
         */
        execute: function (onComplete, onError, ajaxOnly, scope) {
            var __onComplete = $.proxy(function (data) {
                var _data = data;
                if (typeof data == 'string') _data = JSON.parse(data);

                // @description 开发者可以传入一组验证方法进行验证
                for (var i = 0, len = this.validates.length; i < len; i++) {
                    if (!this.validates[i](data)) {
                        // @description 如果一个验证不通过就返回
                        if (typeof onError === 'function') {
                            return onError.call(scope || this, _data, data);
                        } else {
                            return false;
                        }
                    }
                }

                // @description 对获取的数据做字段映射
                var datamodel = typeof this.dataformat === 'function' ? this.dataformat(_data) : _data;

                if (this.onDataSuccess) this.onDataSuccess.call(this, datamodel, data);
                if (typeof onComplete === 'function') {
                    onComplete.call(scope || this, datamodel, data);
                }

            }, this);

            var __onError = $.proxy(function (e) {
                if (typeof onError === 'function') {
                    onError.call(scope || this, e);
                }
            }, this);

            this.sendRequest(__onComplete, __onError);

        },

        sendRequest: function (success, error) {
            var url = this.buildurl();
            var params = _.clone(this.getParam() || {});
            var crossDomain = {
                'json': true,
                'jsonp': true
            };

            if (this.type == 'POST') {
                this.dataType = 'json';
            }

            //jsonp与post互斥
            $.ajax({
                url: url,
                type: this.type,
                data: params,
                dataType: this.dataType,
                contentType: this.contentType,
                crossDomain: crossDomain[this.dataType],
                timeout: 50000,
                xhrFields: {
                    withCredentials: true
                },
                success: function (res) {
                    success && success(res);
                },
                error: function (err) {
                    error && error(err);
                }
            });

        }

    });

    return Model;
});

