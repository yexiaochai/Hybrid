
define(['UIAbstractView', 'text!T_UIHeader'], function (UIView, template) {

  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();

      var d_header = $('#headerview');

      this.wrapper = d_header[0] ? d_header : $('body');

      //是否设置view所处作用域
      this.view;

      this.left = [];
      this.title = '百度bus';
      this.right = [];

      this.lastParam = null;

      //每次create时候清空容器
      this.needEmptyWrapper = true;

      //html模板
      this.template = template;
      this.events = {};
    },

    getViewModel: function () {
      return this._getDefaultViewModel(['left', 'title', 'right']);
    },

    //单纯的做老代码桥接......
    set: function (data, needFresh) {
      var left = [];
      var tmpPram;
      //如果仅仅是title的
      if (typeof data == 'string') {
        tmpPram = { title: data };

        if (!needFresh && this.lastParam) {
          this.lastParam.title = data;
          tmpPram = this.lastParam;
        }

        this.lastParam = tmpPram;
        this.setOption(tmpPram);
        this.refresh();
        this.show();
        return;
      }

      if (typeof data.back != 'undefined') {
        if (_.isObject(data.back)) left.push(data.back);
        if (_.isArray(data.back)) left = data.back;
        if (_.isFunction(data.back)) left = [{ tagname: 'back', callback: data.back}];
        if (_.isBoolean(data.back) && data.back) left = [{ tagname: 'back'}];
      }
      if (!data.left) data.left = left;

      this.resetDefaultPropertys();
      this.handleSpecialParam(data);

      //默认参数处理
      this.setOption(data);
      this.lastParam = data;

      // document.title = data.title || '医联';

      //初始化events参数
      this.setEventsParam();
      this.refresh();
      this.show();
    },

    resetDefaultPropertys: function () {
      this.left = [];
      this.title = '百度bus';
      this.right = [];
    },

    backDefaultCallback: function () {
      console.log('默认back回调');
      window.history.back();
    },

    setEventsParam: function () {
      var item, _callback = null, data = this.left.concat(this.right);

      for (var i = 0, len = data.length; i < len; i++) {
        item = data[i];

        //有默认的便赋值默认
        if (_.isFunction(this[item.tagname + 'DefaultCallback']))
          _callback = this[item.tagname + 'DefaultCallback'];

        //外部传入的优先级更高
        if (_.isFunction(item.callback))
          _callback = $.proxy(item.callback, this.view);

        if (_callback) {
          this.events['click .js_' + item.tagname] = _callback;
        }
        _callback = null;
      }
    },

    handleSpecialParam: function (data) {
      var k, i, len, item;
      for (k in data) {
        if (_.isArray(data[k])) {
          for (i = 0, len = data[k].length; i < len; i++) {
            item = data[k][i];
            if (this['customtHandle_' + item.tagname]) {
              this['customtHandle_' + item.tagname](data[k][i], k);
            } //if
          } //for
        } //if
      } //for
    },

    _getDir: function (dir) {
      var kv = { left: 'fl', right: 'fr' };
      return kv[dir];
    },

    //定制化信息
    customtHandle_tel: function (item, dir) {
      dir = this._getDir(dir);
      item.itemFn = function () {
        return '<a href="tel:' + item.number + '" class="cm-header-icon' + dir + ' js_' + item.tagname + ' " ><i class="icon-' + item.tagname + '"></i></a>';
      };
    },

    addEvent: function () {
      this.on('onPreShow', function () {
        this.wrapper.html('');
      });
    },

    hide: function ($super) {
      $super();
      this.wrapper.hide();
      
      if(APP && APP.setViewportSize)
        APP.setViewportSize();
    },

    show: function ($super) {
      $super();
      this.wrapper.show();
    }

  });
});
