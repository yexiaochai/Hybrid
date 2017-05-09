
_.requestHybrid({
    tagname: 'forward',
    param: {
        topage: window.location.origin + (window.location.href.toLowerCase().indexOf('/hybrid/') == -1 ? '' : '/Hybrid') +   '/webapp/' + hybridPage,
        type: 'h5',
        animate: animateName || 'push'
    }
});

//=>比如跳Native页面收口收口
var nativeForward = function(path, param) {
    if (!path) return;
    var topage = path;
    if (!param) param = {};
    var index = 0;
    var arr = [],
      tmp = {};

    for (var k in param) {
        tmp = {};
        tmp.k = k;
        tmp.v = param[k];
        arr.push(tmp);
    }

    for (var i = 0, len = arr.length; i < len; i++) {
        if (i == 0) {
            topage += '?' + arr[i].k + '=' + encodeURIComponent(arr[i].v);
        } else {
            topage += '&' + arr[i].k + '=' + encodeURIComponent(arr[i].v);
        }
    }

    _.requestHybrid({
        tagname: 'forward',
        param: {
            topage: topage,
            type: 'native'
        }
    });
};




