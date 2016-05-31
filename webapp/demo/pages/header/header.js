define([
    'BaseView',
    'text!PagePath/header/tpl.layout.html',
    'text!StylePath/common.css'
], function (AbstractView,
             layoutHtml,
             commonStyle) {

    return _.inherit(AbstractView, {
        propertys: function ($super) {

            $super();

            this.template = layoutHtml;
            this.commonstyle = commonStyle;

            this.events = {
                'click .js-setheader0': function () {
                    var opts = {
                        view: this,
                        title: 'Header基本设置',
                        back: function () {
                            this.back();
                        }
                    };
                    this.header.set(opts);
                },

                'click .js-setheader1': function () {
                    var opts = {
                        view: this,
                        title: ['主标题', '子标题'],
                        back: function () {
                            this.back();
                        }
                    };
                    this.header.set(opts);

                },
                'click .js-setheader2': function () {
                    var opts = {
                        view: this,
                        back: function () {
                            this.back();
                        },
                        title: {
                            tagname: 'title',
                            title: '带图标title',
                            lefticon: 'http://images2015.cnblogs.com/blog/294743/201511/294743-20151102143118414-1197511976.png',
                            righticon: 'http://images2015.cnblogs.com/blog/294743/201511/294743-20151102143118414-1197511976.png',
                            callback: function () {
                                this.showToast('点击标题回调');
                            }
                        }
                    };
                    this.header.set(opts);
                },
                'click .js-setheader3': function () {
                    var opts = {
                        view: this,
                        back: function () {
                            this.back();
                        },
                        title: '设置右边按钮',
                        right: [
                            {
                                tagname: 'search',
                                icon: 'http://images2015.cnblogs.com/blog/294743/201511/294743-20151102143118414-1197511976.png',
                                callback: function () {
                                    this.showToast('图标读取线上资源');
                                }
                            }
                        ]
                    };
                    this.header.set(opts);
                },
                'click .js-setheader4': function () {
                    var opts = {
                        view: this,
                        back: function () {
                            sss11.show()
                            this.back();

                        },
                        title: '假死了'
                    };
                    this.header.set(opts);
                },
                'click .js-setheader5': function () {
                    this.header.hide();
                },
                'click .js-setheader6': function () {
                    this.header.show();
                }
            }

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: 'Header Demo',
                back: function () {
                    this.back();
                }
            };
            this.header.set(opts);
        },

        initElement: function () {

        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {


            });
        }

    });

});
