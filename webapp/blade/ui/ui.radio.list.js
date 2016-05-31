define(['UILayer', 'text!T_UIRadioList', 'UIScroll'], function (UILayer, template, UIScroll) {

    return _.inherit(UILayer, {
        propertys: function ($super) {
            $super();
            //html模板
            this.template = template;

            this.title = '标题';
            this.data = [];
            this.selectId = null;
            this.index = -1;

            this.itemNum = this.data.length;
            this.displayNum = 5;
            this.checekdClass = 'active';

            this.scroll = null;

            this.addEvents({
                'click .js_items> li': 'clickAction'
            });

            this.onClick = function (data, index, e) {
                console.log(data);
            };

        },

        getViewModel: function () {
            return this._getDefaultViewModel(['title', 'data', 'selectId', 'index', 'itemFn']);
        },

        //要求唯一标识，根据id确定index
        resetPropery: function ($super) {
            $super();

            this._resetNum();
            this._resetIndex();
        },

        _resetIndex: function () {
            if (!this.selectId) return;
            for (var i = 0, len = this.data.length; i < len; i++) {
                if (this.selectId == this.data[i].id) {
                    this.index = i;
                    break;
                }
            }
        },

        _resetNum: function () {
            this.displayNum = this.displayNum % 2 == 0 ? this.displayNum + 1 : this.displayNum;
            this.itemNum = this.data.length;

        },

        clickAction: function (e) {
            var el = $(e.currentTarget)
            var i = el.attr('data-index');
            this.setIndex(i);
            if (this.onClick) this.onClick.call(this, this.getSelected(), i, e);

        },

        setId: function (id) {
            if (!id) return;
            var index = -1, i, len;
            for (i = 0, len = this.data.length; i < len; i++) {
                if (this.data[i].id == id) { index = i; break; }
            }
            if (index == -1) return;
            this.selectId = id;
            this.index = index;
            this.setIndex(index);
        },

        getId: function () {
            return this.selectId;
        },

        setIndex: function (i, position) {
            i = parseInt(i);
            if (i < 0 || i >= this.data.length) return;
            this.index = i;
            this.selectId = this.data[i].id;

            //这里不以datamodel改变引起整个dom变化了，不划算
            this.$('li').removeClass(this.checekdClass);
            this.$('li[data-index="' + i + '"]').addClass(this.checekdClass);
            if (position) this._position();
        },

        getIndex: function () {
            return this.index;
        },

        getSelected: function () {
            return this.data[this.index];
        },

        initElement: function () {
            this.swrapper = this.$('.js_wrapper');
            this.scroller = this.$('.js_items');
        },

        initSize: function () {
            var num = this.displayNum
            this.sheight = this.scroller.height();
            this.itemHeight = parseInt(this.sheight / this.itemNum);
            if (num > this.itemNum) num = this.itemNum;
            this.swrapper.height(this.itemHeight * num);
        },

        _position: function () {
            if (!this.scroll) return;
            var index = this.index, _top;
            if (index < 0) index = 0;
            if (this.itemNum - index < this.displayNum) index = this.itemNum - this.displayNum;

            _top = (this.itemHeight * index) * (-1);
            this.scroll.scrollTo(0, _top);
        },

        reposition: function ($super) {
            this.$el.css({
//                'width': '320px'
                'width': '16rem'
            });

            $super();


        },

        addEvent: function ($super) {
            $super();

            //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
            this.on('onShow', function () {
                this.initSize();
                if (this.scroll && this.scroll.destory) this.scroll.destory();
                if (this.itemNum > this.displayNum) {
                    this.scroll = new UIScroll({
                        wrapper: this.swrapper,
                        scroller: this.scroller
                    });
                    this._position();
                }

            }, 1);

            this.on('onHide', function () {
                if (this.scroll) {
                    this.scroll.destroy();
                    this.scroll = null;
                }
            });
        }
    });

});
