
define([], function () {
  'use strict';

  var getBiggerzIndex = (function () {
    var index = 2000;
    return function (level) {
      return level + (++index);
    };
  })();

  return _.inherit({

    propertys: function () {
      //这里设置UI的根节点所处包裹层
      this.wrapper = $('body');
      this.id = _.uniqueId('ui-view-');
      this.classname = '';

      //模板字符串，各个组件不同，现在加入预编译机制
      this.template = '';
      //事件机制
      this.events = {};

      //自定义事件
      //此处需要注意mask 绑定事件前后问题，考虑scroll.radio插件类型的mask应用，考虑组件通信
      this.eventArr = {};

      //初始状态为实例化
      this.status = 'init';

    },

    getViewModel: function () {
      //假如有datamodel的话，便直接返回，不然便重写，这里基本为了兼容
      if (_.isObject(this.datamodel)) return this.datamodel;
      return {};
    },

    _getDefaultViewModel: function (arr) {
      var k, i, len, obj = {};
      for (i = 0, len = arr.length; i < len; i++) {
        k = arr[i];
        if (!_.isUndefined(this[k]) && !_.isNull(this[k])) obj[k] = this[k];
      }
      return obj;
    },


    //子类事件绑定若想保留父级的，应该使用该方法
    addEvents: function (events) {
      if (_.isObject(events)) _.extend(this.events, events);
    },

    //阻止默认冒泡事件
    _preventDefault: function (e) {
      e.preventDefault();
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

    createRoot: function (html) {
      //UI的根节点
      this.$el = $('<div class="view ' + this.classname + '" style="display: none; " id="' + this.id + '">' + html + '</div>');
      this.wrapper.append(this.$el);
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

    },

    $: function (selector) {
      return this.$el.find(selector);
    },

    //提供属性重置功能，对属性做检查
    resetPropery: function () {
    },

    //各事件注册点，用于被继承override
    addEvent: function () {
    },

    create: function () {
      this.trigger('onPreCreate');
      //如果没有传入模板，说明html结构已经存在
      if (_.isString(this.template)) {
        this.createRoot(this.render());
      }
      else {
        //如果没有准备template，则$el便是wrapper
        this.$el = this.wrapper;
      }

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
    show: function () {
      if (!this.wrapper[0] || !this.$el[0]) return;
      this.trigger('onPreShow');

      //如果包含就不要乱搞了
      if (!$.contains(this.wrapper[0], this.$el[0])) {
        //如果需要清空容器的话便清空
        if (this.needEmptyWrapper) this.wrapper.html('');
        this.wrapper.append(this.$el);
      }

      this.$el.show();

      if (this.needAnimat && _.isFunction(this.animateShowAction) && this.status != 'show') {
        this.animateShowAction.call(this, this.$el);
      } else {
        this.$el.show();
      }

      this.status = 'show';

      this.bindEvents();

      this.trigger('onShow');
    },

    hide: function () {
      if (!this.$el || this.status !== 'show') return;

      this.trigger('onPreHide');

      if (this.needAnimat && _.isFunction(this.animateHideAction) && this.status == 'show') {
        this.animateHideAction.call(this, this.$el);
      } else {
        this.$el.hide();
      }
      this.status = 'hide';
      this.unBindEvents();
      this.trigger('onHide');
    },

    destroy: function () {
      this.status = 'destroy';
      this.unBindEvents();
      this.$el.remove();
      this.trigger('onDestroy');
      delete this;
    },

    setzIndexTop: function (el, level) {
      if (!el) el = this.$el;
      if (!level || level > 10) level = 0;
      level = level * 1000;
      el.css('z-index', getBiggerzIndex(level));

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
    }
  });

});
