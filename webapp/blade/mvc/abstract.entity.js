define([], function () {
    /*
    一些原则：
    init方法时，不可引起其它字段update
    */
    var Entity = _.inherit({
        initialize: function (opts) {
            this.propertys();
            this.setOption(opts);
        },

        propertys: function () {
            //只取页面展示需要数据
            this.data = {};

            //局部数据改变对应的响应程序，暂定为一个方法
            //可以是一个类的实例，如果是实例必须有render方法
            this.controllers = {};

            this.scope = null;

        },

        subscribe: function (namespace, callback, scope) {
            if (typeof namespace === 'function') {
                scope = callback;
                callback = namespace;
                namespace = 'update';
            }
            if (!namespace || !callback) return;
            if (scope) callback = $.proxy(callback, scope);
            if (!this.controllers[namespace]) this.controllers[namespace] = [];
            this.controllers[namespace].push(callback);
        },

        unsubscribe: function (namespace) {
            if (!namespace) this.controllers = {};
            if (this.controllers[namespace]) this.controllers[namespace] = [];
        },

        publish: function (namespace, data) {
            if (!namespace) return;
            if (!this.controllers[namespace]) return;
            var arr = this.controllers[namespace];
            var i, len = arr.length;
            for (i = 0; i < len; i++) {
                arr[i](data);
            }
        },

        setOption: function (opts) {
            for (var k in opts) {
                this[k] = opts[k];
            }
        },

        //首次初始化时，需要矫正数据，比如做服务器适配
        //@override
        handleData: function () { },

        //一般用于首次根据服务器数据源填充数据
        initData: function (data) {
            var k;

            //如果默认数据没有被覆盖可能有误
            if (data) {
                for (k in this.data) {
                    if (data[k]) this.data[k] = data[k];
                } 
            }

            this.handleData();
            this.publish('init', this.get());
        },

        //验证data的有效性，如果无效的话，不应该进行以下逻辑，并且应该报警
        //@override
        validateData: function () {
            return true;
        },

        //获取数据前，可以进行格式化
        //@override
        formatData: function (data) {
            return data;
        },

        //获取数据
        get: function () {
            if (!this.validateData()) {
                //需要log
                return {};
            }
            return this.formatData(this.data);
        },

        //数据跟新后需要做的动作，执行对应的controller改变dom
        //@override
        update: function (key) {
            key = key || 'update';
            var data = this.get();
            this.publish(key, data);
        }

    });

    return Entity;
});
