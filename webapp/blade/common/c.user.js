define([], function () {
    var host = window.location.host;

    var loginIn = '';
    var loginOut = '';

    //暂时这样封装
    var cUser = {
        login: function (url) {
            var hybridInfo = _.getHybridInfo();
            url = buildUrl(url);

            if (!url) url = encodeURIComponent(window.location.href);
            else url = encodeURIComponent(url)

            if (hybridInfo.platform == 'baidubox' && host.indexOf('kuai.baidu.com') != -1) {
                clouda.mbaas.account.bdLogin({
                    onsuccess: function () {
                        window.location.href = decodeURIComponent(url);
                    },
                    onfail: function () {
                        window.location.href = decodeURIComponent(url);
                    },
                    tpl: 'bdbus',
                    u: decodeURIComponent(url),
                    login_type: 'sms'
                });
            } else if (hybridInfo.platform == 'nuomi') {
                // 调用login方法体
                BNJS.account.login({
                    onSuccess: function () {
                        //解决糯米页面刷新不执行readyBUG
                        window.location.href = 'bainuo://component?url=' + url;
                    },
                    onFail: function (res) {
                        return;
                        window.location.href = decodeURIComponent(url);
                    }
                });

            } else {
                window.location.href = loginIn + url;
            }

        },
        logout: function (url) {


        }
    };

    return cUser;
});