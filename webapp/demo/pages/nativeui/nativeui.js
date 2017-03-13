define([
    'BaseView',
    'text!PagePath/nativeui/tpl.layout.html',
    'text!StylePath/common.css'
], function (AbstractView,
             layoutHtml,
             commonStyle) {

    return _.inherit(AbstractView, {
        propertys: function ($super) {

            $super();
            var scope = this;

            this.template = layoutHtml;
            this.commonstyle = commonStyle;

            this.events = {
                'click .js-btn01': function () {

                    /*
                    关闭当前页面,回到native上一步操作
                     */
                    _.requestHybrid({
                        tagname: 'closeWindow'
                    });

                },
                'click .js-btn02': function () {

//唤起输入文字的软键盘
_.requestHybrid({
    tagname: 'showKeyboard',
    param: {

        /*===图片参数===*/
        //如果该键盘带参数的话一定要传以下参数
        hasImg: 1, //必须传hasImg为1,否则认为键盘没有图片

        //文件所属分类,包括（transform(出转诊),casem(病例), question(问题), post(帖子), help(求助), secret(深夜病房), logo, avatar(头像)，chat(聊天), idCard(身份证), profile(用户信息),panel, spread, media,live)
        bucket: 'transform',
        //1代表文件传入公共盘，所有人可以访问。0代表私人盘，需要授权访问
        isPublic: 1,
        //水印文字 ,如果没传参数则没有水印
        waterText: '水印文字',

        //以下是基本参数
        //1-9张限制
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        /*===图片参数===*/

        /*键盘按钮文案
         Done      —>    完成
         Send      —>    发送
         Search   —>  搜索
        */
        type: 'Done',
        //如果设计了btnTxt type属性便失效,文本变成多行输入,并且多一个按钮,模仿头条
        btnTxt: '发送',
        value:  scope.$('.js-val01').val().trim(),
        tips: '描述信息',
        textMin: 5, //文字要求最少输入字符数
        textMax: 20 //文字要求最多输入字符数
    },
    //输入结束的回调或者说点击发送时候的回调
    callback: function (data) {
        scope.$('.js-val01').val(data);
    }
});

                },
                'click .js-btn002': function () {

//唤起输入文字的软键盘
                    _.requestHybrid({
                        tagname: 'showKeyboard',
                        param: {

                            /*===图片参数===*/
                            //如果该键盘带参数的话一定要传以下参数
                            hasImg: 0, //必须传hasImg为1,否则认为键盘没有图片

                            //文件所属分类,包括（transform(出转诊),casem(病例), question(问题), post(帖子), help(求助), secret(深夜病房), logo, avatar(头像)，chat(聊天), idCard(身份证), profile(用户信息),panel, spread, media,live)
                            bucket: 'transform',
                            //1代表文件传入公共盘，所有人可以访问。0代表私人盘，需要授权访问
                            isPublic: 1,
                            //水印文字 ,如果没传参数则没有水印
                            waterText: '水印文字',

                            //以下是基本参数
                            //1-9张限制
                            count: 1,
                            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                            /*===图片参数===*/

                            /*键盘按钮文案
                             Done      —>    完成
                             Send      —>    发送
                             Search   —>  搜索
                             */
                            type: 'Search',
                            //如果设计了btnTxt type属性便失效,文本变成多行输入,并且多一个按钮,模仿头条
                            //btnTxt: '发送',
                            value:  scope.$('.js-val01').val().trim(),
                            tips: '描述信息',
                            textMin: 5, //文字要求最少输入字符数
                            textMax: 20 //文字要求最多输入字符数
                        },
                        //输入结束的回调或者说点击发送时候的回调
                        callback: function (data) {
                            scope.$('.js-val01').val(data);
                        }
                    });

                },
                'click .js-btn03': function () {

/*
 获取网络状态
 */
_.requestHybrid({
    tagname: 'getNetworkType',
    callback: function(data) {
        //data.networkType 2g 3g 4g wifi
        scope.showToast(data.networkType);
    }
});

                },
                'click .js-btn04': function () {

//获取经纬度信息
_.requestHybrid({
    tagname: 'getLocation',
    callback: function(data) {
        var latitude = data.pos.lat; // 纬度，浮点数，范围为90 ~ -90
        var longitude = data.pos.lng; // 经度，浮点数，范围为180 ~ -180。
        //var speed = data.speed; // 速度，以米/每秒计
        //var accuracy = data.accuracy; // 位置精度

//根据经纬度等信息打开native地图
        _.requestHybrid({
            tagname: 'openMap',
            param: {
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                name: '你现在的位置', // 位置名
                address: '详细地址', // 地址详情说明
                scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: 'http://medlinker.com' // 在查看位置界面底部显示的超链接,可点击跳转
            }
        });

    }
});

                }
            };

        },

        initHeader: function () {
            var opts = {
                view: this,
                title: 'nativeUI Demo',
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
