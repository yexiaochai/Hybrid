
define([], function () {
  'use strict';

  return _.inherit({

    propertys: function () {
      this.left = [];
      this.right = [];
      this.title = {};
      this.view = null;

      this.hybridEventFlag = 'Header_Event';
    },

    //全部更新
    set: function (opts) {
      if (!opts) return;

      var left = [];
      var right = [];
      var title = { tagname: 'title' };
      var tmp = {};
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

      _.requestHybrid({
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
      _.unRegisterHeaderCallback(this.hybridEventFlag);

      this._addEvent(this.left);
      this._addEvent(this.right);
      this._addEvent(this.title);

    },

    _addEvent: function (data) {
      if (!_.isArray(data)) data = [data];
      var i, len, tmp, fn;
      var t;

      for (i = 0, len = data.length; i < len; i++) {
        tmp = data[i];
        if(!tmp.tagname) continue;
        t = 'header_' + tmp.tagname + '_' + (new Date().getTime());
        if (tmp.callback) {
          fn = $.proxy(tmp.callback, this.view);
          tmp.callback = t;
          _.registerHeaderCallback(this.hybridEventFlag, t, fn);
        }
      }

    },

    show: function () {
      _.requestHybrid({
        tagname: 'showheader',
        param: {
          display: true,
          animate: true
        }
      });
    },

    hide: function () {
_.requestHybrid({
  tagname: 'showheader',
  param: {
    display: false
  }
});
    },

    //只更新title
    update: function (title) {

    },

    initialize: function () {
      this.propertys();
    }

  });

});
