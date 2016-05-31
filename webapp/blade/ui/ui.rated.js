define(['UIAbstractView', 'text!T_UIRated'], function (UIView, template) {

    return _.inherit(UIView, {
        propertys: function ($super) {
            $super();
            this.template = template;

            this.events = {
                'click .js-rated-wrap ': 'itemAction',
                'touchmove .js-rated-wrap ': 'moveAction'

            };

            this.STEP = 35;
            this.MAX = 5;
            this.initRated = 4;

            this.changedAction = function (rate) {

            };

        },

        //倒出当前评分
        getRated: function () {
            console.log();

            var s1 = this.rated.width();
            var s2 = this.STEP;
            var s3 = this.rated.width() / this.STEP;

            var step = parseInt(this.rated.width() / this.STEP);

            if(this.rated.width() / this.STEP - step > 0.5) step = step + 1;

            if(step > this.MAX) step = this.MAX;

            return step;
        },

        getViewModel: function () {
            return this._getDefaultViewModel(['initRated', 'STEP']);
        },

        moveAction: function (e) {
            var el = $(e.currentTarget);
            //鼠标位置
            var x1 = (e.changedTouches[0] || e.touches[0] ).pageX;
            //元素相对左边距离
            var x2 = el[0].offsetLeft || 0;

            var step = x1 - x2;
            var s1 = step / this.STEP;
            var s2 = parseInt(step / this.STEP);

            var step = ( s1 > s2 ? s2 + 1 : s2) * this.STEP;

            this.rated.width(step/20 + 'rem');

            this.changedAction(this.getRated());

            e.preventDefault();

        },

        itemAction: function (e) {
            var x = e.offsetX;

            var step = x;
            var s1 = step / this.STEP;
            var s2 = parseInt(step / this.STEP);

            var step = ( s1 > s2 ? s2 + 1 : s2) * this.STEP;

            this.rated.width(step/20 + 'rem');


            this.changedAction(this.getRated());

        },

        initElement: function () {
            this.rated = this.$('.js-rated');
            this.ratedWrap = this.$('.js-rated-wrap');

        }

    });

});
