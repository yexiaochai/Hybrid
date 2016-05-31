/*
******bug******
这个使用与定制化接太困难，需要更加方便的使用
太定制化的功能业务团队往往不能接受
*/
define(['UIAbstractView', 'text!T_UICalendar'], function (UIView, template) {

    return _.inherit(UIView, {
        propertys: function ($super) {
            $super();
            this.template = template;

            //阳历节日
            this.solarHoliday = {
                '0101': '元旦节',
                '0214': '情人节',
                '0501': '劳动节',
                '0601': '儿童节',
                '0910': '教师节',
                '1001': '国庆节',
                '1225': '圣诞节'
            };

            //阴历节日
            this.lunarHoliday = {
                '20150218': '除夕',
                '20150219': '春节',
                '20150305': '元宵',
                '20150405': '清明',
                '20150620': '端午',
                '20150820': '七夕',
                '20150828': '中元',
                '20150927': '中秋',
                '20151021': '重阳',

                '20160207': '除夕',
                '20160208': '春节',
                '20160222': '元宵',
                '20160404': '清明',
                '20160609': '端午',
                '20160809': '七夕',
                '20160817': '中元',
                '20160915': '中秋',
                '20161009': '重阳',

                '20170127': '除夕',
                '20170128': '春节',
                '20170211': '元宵',
                '20170404': '清明',
                '20170530': '端午',
                '20170828': '七夕',
                '20170905': '中元',
                '20171004': '中秋',
                '20171028': '重阳',

                '20180215': '除夕',
                '20180216': '春节',
                '20180302': '元宵',
                '20180405': '清明',
                '20180618': '端午',
                '20180817': '七夕',
                '20180825': '中元',
                '20180924': '中秋',
                '20181017': '重阳'

            };

            //特殊时刻
            this.specialDates = false;

            //是否选择不在本月的时间
            this.showOtherMonthDay = false;

            //要求必须要传入日期对象
            this.scope = this;

            //具体显示那一个月由displayTime决定
            this.displayTime = null;
            //可选日期由startTime定，并且最初可选时间也由
            this.startTime = null;
            this.endTime = null;
            //应该由服务器读出
            this.curTime = new Date();

            this.weekDayArr = ['日', '一', '二', '三', '四', '五', '六'];
            this.displayMonthNum = 1;

            //当前选择的日期
            this.selectDate = null;
            //分割月之间的显示
            this.MonthClapFn = function (year, month) {
                month = month + 1;
                return year + '年' + (month) + '月';
            };

            //******bug******乱源
            //具体显示项目定制化
            this.dayItemFn = function (year, month, day, dateObj, difftime) {

                var dayObj = {
                    day: day
                };
                var dayStrArr = [];
                var _solarHoliday = _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
                var _lunarHoliday = year.toString() + _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
                var _deffHour = parseInt(-1 * difftime / 3600000 * 100) / 100; ;
                var isMulti = false;

                //处理日
                if (_deffHour == 0) {
                    dayObj.day1 = '今天';
                } else if (_deffHour == -24) {
                    dayObj.day1 = '明天';
                } else if (_deffHour == -48) {
                    dayObj.day1 = '后天';
                }

                //处理节日
                if (this.solarHoliday[_solarHoliday]) {
                    dayObj.solarHoliday = this.solarHoliday[_solarHoliday];
                }

                //阴历节日
                if (this.lunarHoliday[_lunarHoliday]) {
                    dayObj.lunarHoliday = this.lunarHoliday[_lunarHoliday];
                }

                //处理特殊标志
                if (this.specialDates) {
                    //默认不处理特殊标志，但是阴历需要处理
                }

                dayStrArr[0] = '<div class="cm-field-title">' + (dayObj.day1 || dayObj.day) + '</div>';

                if (dayObj.solarHoliday || dayObj.lunarHoliday) {
                    isMulti = true;
                    dayStrArr[0] = '<div class="cm-field-title">' + (dayObj.lunarHoliday || dayObj.solarHoliday) + '</div>';
                    //          dayStrArr[0] += '<div class="cm-field-label">' + (dayObj.lunarHoliday || dayObj.solarHoliday) + '</div>';
                }

                if (this.dayItemAction) {
                    return this.dayItemAction.call(this, dayObj, year, month, day, dateObj, difftime);
                } else {
                    return '<div class="cm-field-wrapper ' + (isMulti ? 'multi-item' : '') + '">' + dayStrArr.join('') + '</div>';
                }
            };

            this.dayItemAction = null;

            this.events = {
                'click .js_calendar_item ': 'itemAction'
            };

            this.onItemClick = function (date, el, e) {
                console.log(arguments);
            };

        },

        //重置属性，将所有数据合理化
        resetPropery: function ($super) {
            $super();

            if (this.selectDate)
                this.selectDate = new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate());

            if (!_.isDate(this.curTime)) this.curTime = new Date();
            this.curTime = new Date(this.curTime.getFullYear(), this.curTime.getMonth(), this.curTime.getDate());

            if (!this.startTime) this.startTime = this.curTime;
            if (!this.displayTime) {
                if (this.selectDate)
                    this.displayTime = this.selectDate;
                else
                    this.displayTime = this.curTime;
            }
            //将日期全部设置为北京时间
            //      this.startTime = _.dateUtil.getBeijingDate(this.startTime);
            //      this.curTime = _.dateUtil.getBeijingDate(this.curTime);
            //      this.displayTime = _.dateUtil.getBeijingDate(this.displayTime);

            this.curTime = this.curTime.getTime();
            this.year = this.displayTime.getFullYear();
            this.month = this.displayTime.getMonth();
            this.endDate = new Date(this.year, this.month + this.displayMonthNum, 0);

        },

        getViewModel: function () {
            return this._getDefaultViewModel(['scope', 'startTime', 'endTime', 'weekDayArr', 'displayMonthNum', 'curTime', 'selectDate', 'MonthClapFn', 'dayItemFn', 'year', 'month', 'endDate', 'showOtherMonthDay', 'displayTime']);
        },

        //中国操作习惯，月份以1开始
        handleCnDay: function (selectorDay, callback) {
            var dayStr = selectorDay, dayArr = [], el;
            if (_.isDate(selectorDay)) {
                dayStr = selectorDay.getFullYear() + '-' + selectorDay.getMonth() + '-' + selectorDay.getDate();
            } else if (_.isString(selectorDay)) {
                dayArr = selectorDay.split('-');
                dayStr = dayArr[0] + '-' + (parseInt(dayArr[1]) - 1) + '-' + dayArr[2];
            }
            this.handleDay(dayStr, callback);
        },

        //操作某一日期
        handleDay: function (selectorDay, callback) {
            var dayStr = selectorDay, dayArr = [], el;

            if (_.isDate(selectorDay)) {
                dayStr = selectorDay.getFullYear() + '-' + selectorDay.getMonth() + '-' + selectorDay.getDate();
            }

            el = this.$('li[data-date="' + dayStr + '"]');
            if (el[0] && _.isFunction(callback)) {
                callback.call(this, el);
            }
        },

        itemAction: function (e) {
            var el = $(e.currentTarget);
            if (el.hasClass('cm-item--disabled')) return;
            var date = el.attr('data-date');
            date = date.split('-');
            if (date.length != 3) return false;

            date = new Date(date[0], date[1], date[2]);

            this.selectDate = date;
            this.d_calendar_items.removeClass('active');
            el.addClass('active');

            if (this.onItemClick) this.onItemClick.call(this, date, el, e);
        },

        initElement: function () {
            this.weekDay = this.$('.js_weekend');
            this.d_calendar_items = this.$('.js_calendar_item');
        }

    });

});
