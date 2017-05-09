/*
 无论成功与否皆会关闭登录框
 参数包括：
 success 登录成功的回调
 error 登录失败的回调
 url 如果没有设置success，或者success执行后没有返回true，则默认跳往此url
 */
HybridUI.Login = function (param) {
};
//=>
requestHybrid({
    tagname: 'login',
    param: param,
    callback: function(data) {
        //data中带有code信息,我们根据code判断登录成功或者失败
    }
});
//与登录接口一致，参数一致
HybridUI.logout = function () {
};