
//获取版本信息
var getHybridInfo = function() {
    var platform_version = {};
    var na = navigator.userAgent;
    na = na.toLowerCase();
    var info = na.match(/hybrid_\w+_\d\.\d\.\d/);

    if (info && info[0]) {
        info = info[0].split('_');
        if (info && info.length == 4) {
            platform_version.platform = info[1];
            platform_version.app = info[2];
            platform_version.version = info[3];
        }
    }

    return platform_version;
};
