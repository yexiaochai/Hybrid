/**
 * Created by xj on 2016/4/12.
 * 日期时间选择控件
 */


define(['UILayer', 'text!T_UIDatetimepicker', 'UISelect'], function (UILayer, template, UISelect) {

    return _.inherit(UILayer, {
        propertys: function ($super) {
            $super();
            //html模板
            this.template = template;
            this.scrollCreated = false;

            this.title = '';
            this.tips = '';
            this.beginTime = 0;
            this.endTime = 0;
            this.btns = [
                { name: '取消', className: 'cui-btns-cancel js_cancel' },
                { name: '确定', className: 'cui-btns-ok js_ok' }
            ];

            this.data = [];
            this.indexArr = [0, 0, 0];
            this.idArr = [];
            this.scrollArr = [];
            this.changedArr = [
                function (item) {
                },
                function (item) {
                },
                function (item) {
                }
            ];

            this.onOkAction = function (items) {
            };

            this.onCancelAction = function (items) {
                this.hide();
            };

            //这里便只有一个接口了
            this.displayNum = 5;

            this.addEvents({
                'click .js_ok': 'okAction',
                'click .js_cancel': 'cancelAction'
            });

        },

        getViewModel: function () {
            return this._getDefaultViewModel(['title', 'tips', 'btns']);
        },


        okAction: function (e) {
            var dateTime = 0;
            for (var i = 0, len = this.scrollArr.length; i < len; i++) {
//                console.log(this.scrollArr[i].getSelected().value);
                dateTime += this.scrollArr[i].getSelected().value;
            }
            this.onOkAction.call(this, dateTime);
        },

        cancelAction: function (e) {
            var items = [];
            for (var i = 0, len = this.scrollArr.length; i < len; i++) {
                items.push(this.scrollArr[i].getSelected());
            }
            this.onCancelAction.call(this, items);
        },

        initElement: function () {
            this.scrollWrapper = this.$('.js_wrapper');
            this.tips = this.$('.js_tips');
        },

        _initData: function () {

            var step = new Date(),end = new Date(),begin = new Date();
            if (this.beginTime) {
                begin.setTime(this.beginTime * 1000);
                end.setTime(this.beginTime * 1000);
                step.setTime(this.beginTime * 1000);
            }

            if (this.endTime) {
                end.setTime(this.endTime * 1000);
            } else {
                var m = begin.getMonth();
                if (m == 11) {
                    var y = begin.getFullYear();
                    end.setFullYear(y + 1);
                    end.setMonth(0);
                } else {
                    end.setMonth(m + 1);
                }

            }
            var days = (end.getTime() - begin.getTime()) / (1000 * 3600*24);
            var data1 = [];
            var tempTime = step.getTime();
            for (var i = 1; i <= days; i++) {
                var timeStr = [step.getFullYear(), step.getMonth() + 1, step.getDate()].join('/');
                var timeView = [step.getFullYear(), step.getMonth() + 1, step.getDate()].join('-');

                data1.push({
                    'name': timeView,
                    'id': i,
                    'value': parseInt((new Date(timeStr)).getTime(), 10) / 1000
                })
                step.setTime(tempTime + i * 3600 * 1000*24);
            }
            var data2 = [];
            for (var j = 0; j <= 23; j++) {
                data2.push({
                    'name': j,
                    'id': j,
                    'value': j * 3600
                })
            }
            var data3 = [
                {'name': '00', 'id': 1, 'value': 0},
                {'name': '30', 'id': 2, 'value': 1800}
            ];

            this.data = [data1, data2, data3];
        },
        _initScroll: function () {
            if (this.scrollCreated) return;
            this.scrollCreated = true;
            var scope = this;
            //      this._destroyScroll();
            var i, len, item, changeAction;
            for (i = 0, len = this.data.length; i < len; i++) {
                item = this.data[i];
                changeAction = this.changedArr[i] || function () {
                };
                this.scrollArr[i] = new UISelect({
                    data: item,
                    index: this.indexArr[i],
                    key: this.idArr[i],
                    onCreate: function () {
                        this.$el.addClass('cm-scroll-select-wrap');
                        if (scope.data.length === 1) {
                            this.$el.addClass('cm-single');
                        }
                    },
                    displayNum: this.displayNum,
                    changed: $.proxy(changeAction, this),
                    wrapper: this.scrollWrapper
                });

                //纯粹业务需求
                if (i == 0 && len == 3) {
                    this.scrollArr[i].on('onShow', function () {
                        //            this.$el.addClass('cm-scroll-select-wrap');
                    });
                }

                this.scrollArr[i].show();
            }
        },

        //缺少接口
        setTips: function (msg) {
            this.tips = msg;
            this.tips.html(msg);
        },

        _destroyScroll: function () {
            var i, len;
            for (i = 0, len = this.data.length; i < len; i++) {
                if (this.scrollArr[i]) {
                    this.scrollArr[i].destroy();
                    this.scrollArr[i] = null;
                }
            }
            this.scrollCreated = false;
        },

        initialize: function ($super, opts) {
            $super(opts);
        },

        setOption: function ($super, opts) {
            $super(opts);
            if(this.beginTime){
                var beginData=new Date();
                beginData.setTime(this.beginTime*1000);
                this.indexArr = [0, beginData.getHours(), 0];
            }
            if (this.defaultIndex) {
                this.indexArr = this.defaultIndex;
            }
            if(this.isDownIn){
                this.animateInClass = 'cm-down-in';
                this.animateOutClass = 'cm-down-out';
            }
        },

        reposition: function ($super) {

            if (this.isDownIn) {
                this.$el.css({
                    'position': 'fixed',
                    '-webkit-box-sizing': 'border-box',
                    'box-sizing': 'border-box',
                    'width': '100%',
                    'left': '0',
                    'bottom': '0'
                });
                return;
            }

            $super();

            this.$el.css({
                'width': '100%'
            });
        },

        addEvent: function ($super) {
            $super();

            //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
            this.on('onShow', function () {
                this._initData();
                this._initScroll();

            }, 1);

            this.on('onHide', function () {
                //        this._destroyScroll();

            }, 1);

        }

    });

});
