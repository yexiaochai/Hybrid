/*
******bug******
这个使用与定制化接太困难，需要更加方便的使用
太定制化的功能业务团队往往不能接受
*/
define(['UILayer', 'text!T_UICalendarBox', 'UICalendar'], function (UILayer, template, UICalendar) {

    return _.inherit(UILayer, {
        propertys: function ($super) {
            $super();
            this.template = template;
            //      this.needReposition = false;

            this.animateInClass = 'cm-down-in';
            this.animateOutClass = 'cm-down-out';

            this.addEvents({
                'click .js_back': 'backAction',
                'click .js_next': 'nextAction'
            });

            this.calendarIndex = 0;

            this.calendar = null;
            this.onBackAction = null;
            this.onNextAction = null;
        },

        backAction: function () {
            if (this.calendarIndex == 0) return;
            this._refreshView(this.calendarIndex - 1);

            if (_.isFunction(this.onBackAction)) this.onBackAction.call(this);
        },

        nextAction: function () {
            this._refreshView(this.calendarIndex + 1);

            if (_.isFunction(this.onNextAction)) this.onNextAction.call(this);
        },

        _refreshView: function (index) {
            var flag = -1;
            if (this.calendarIndex < index) flag = 1
            this.calendarIndex = index;
            this._initBackBtn();
            this.calendar.displayTime = new Date(this.calendar.year, this.calendar.month + flag);
//            if (this.calendar.displayTime.getTime() < new Date().getTime()) this.calendar.displayTime = null;
            this.calendar.refresh();

        },

        _initBackBtn: function () {
            if (this.calendarIndex != 0) {
                this.d_back.removeClass('disabled');
            } else {
                this.d_back.addClass('disabled');
            }
        },

        initElement: function () {
            this.d_title = this.$('.js_title');
            this.d_wrapper = this.$('.js_calendar_wrapper');
            this.d_back = this.$('.js_back');
            this.d_next = this.$('.js_next');
        },

        initCalendar: function () {
            if (this.calendar) return;
            var opts = this._getDefaultViewModel(['displayTime', 'endTime', 'weekDayArr', 'displayMonthNum', 'curTime', 'selectDate', 'dayItemFn', 'dayItemAction', 'year', 'month', 'endDate', 'onItemClick']);
            opts.MonthClapFn = function (year, month) {
                month = month + 1;
                return '<h2 class="calendar-title">' + year + '年' + _.dateUtil.formatNum(month) + '月</h2>';
            };
            opts.onItemClick = $.proxy(this.onItemClick, this);
            opts.wrapper = this.d_wrapper;
            opts.showOtherMonthDay = true;
            this.calendar = new UICalendar(opts);
            this.calendar.show();


            //当前显示的日期离最初的日期相差多少天
            var day = parseInt((this.calendar.displayTime - this.calendar.startTime) / 1000 / 60 / 60 / 24);
            //显示的月已经过了几天
            var displayDay = parseInt(this.calendar.displayTime.getDate());
            var index = 0;
            var year = this.calendar.displayTime.getFullYear()
            var month = this.calendar.displayTime.getMonth()
            var d = this.calendar.displayTime.getDate()
            var tmp = new Date();

            while (day - displayDay > 0) {
                index++;
                day = day - displayDay;
                tmp = new Date(year, month - index, d);
                displayDay = tmp.getDate();
            }
            this.calendarIndex = index;
            this._initBackBtn();
        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {
                this.initCalendar();
            });
        },

        reposition: function () {

            this.$el.css({
                'position': 'fixed',
                'left': '0',
                'right': '0',
                'bottom': '0'
            });
        }

    });

});
