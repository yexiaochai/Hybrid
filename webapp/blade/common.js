/**
 * @file 公共配置文件
 * @author wanglei48@baidu.com, zhaozhixin@baidu.com
 */

(function () {

    // 项目根路径，这个会跟着外层入口index.html而变化
    var app = '../blade/';
    // 模板路径

    require.config({
        waitSeconds: 60,
        shim: {

        },
        paths: {
            'text': app + 'libs/require.text',
            'AbstractApp': app + 'mvc/abstract.app',
            'AbstractView': app + 'mvc/abstract.view',
            'ModuleView': app + 'mvc/module.view',

            'AbstractModel': app + 'data/abstract.model',
            'AbstractEntity': app + 'mvc/abstract.entity',
            'AbstractStore': app + 'data/abstract.store',
            'AbstractStorage': app + 'data/abstract.storage',

            'cValidate': app + 'common/c.validate',
            'cUser': app + 'common/c.user',

            'HybridHeader': app + 'hybrid/ui.header',

            'UIAbstractView': app + 'ui/ui.abstract.view',
            'UIMask': app + 'ui/ui.mask',
            'UILayer': app + 'ui/ui.layer',
            'UIPageView': app + 'ui/ui.page.view',

            'UIScroll': app + 'ui/ui.scroll',

            'UISlider': app + 'ui/ui.slider',
            'T_UISlider': app + 'ui/ui.slider.html',
            'UIImageSlider': app + 'ui/ui.image.slider',

             //身份证组件
            'UIIdentitycard': app + 'ui/ui.identitycard',
            'T_UIIdentitycard': app + 'ui/ui.identitycard.html',

            'UIScrollLayer': app + 'ui/ui.scroll.layer',
            'T_UIScrollLayer': app + 'ui/ui.scroll.layer.html',

            'UIAlert': app + 'ui/ui.alert',
            'T_UIAlert': app + 'ui/ui.alert.html',

            // 日历
            'UICalendar': app + 'ui/ui.calendar',
            'T_UICalendar': app + 'ui/ui.calendar.html',

            // 日历
            'UICalendarBox': app + 'ui/ui.calendar.box',
            'T_UICalendarBox': app + 'ui/ui.calendar.box.html',

            // 评分
            'UIRated': app + 'ui/ui.rated',
            'T_UIRated': app + 'ui/ui.rated.html',

            //可拖动选择弹出层
            'UIRadioList': app + 'ui/ui.radio.list',
            'T_UIRadioList': app + 'ui/ui.radio.list.html',
            
            'APPUIHeader': app + 'ui/app.ui.header',
            'T_APPUIHeader': app + 'ui/app.ui.header.html',

            'UIHeader': app + 'ui/ui.header',
            'T_UIHeader': app + 'ui/ui.header.html',

            'UIToast': app + 'ui/ui.toast',
            'T_UIToast': app + 'ui/ui.toast.html',

            'UILoading': app + 'ui/ui.loading',
            'T_UILoading': app + 'ui/ui.loading.html',


            'UILayerList': app + 'ui/ui.layer.list',
            'T_UILayerList': app + 'ui/ui.layer.list.html',

            'UISelect': app + 'ui/ui.select',
            'T_UISelect': app + 'ui/ui.select.html',
            'UIGroupSelect': app + 'ui/ui.group.select',
            'T_UIGroupSelect': app + 'ui/ui.group.select.html',
            'T_UIGroupSelect2': app + 'ui/ui.group.select2.html',

            //日期时间选择控件1
            'UIDatetimepicker':app+'ui/ui.datetimepicker',
            'T_UIDatetimepicker':app+'ui/ui.datetimepicker.html',

            //原openapp
            'MED':app+'hybrid/openapp'

        }
    });

})();