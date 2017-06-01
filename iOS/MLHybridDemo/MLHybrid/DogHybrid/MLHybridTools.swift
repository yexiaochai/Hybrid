//
//  MLHybridTools.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/31.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit
import MJRefresh
import CoreLocation

let MLHYBRID_SCHEME: String = MLHybridTools.readSetting()["hybridScheme"] as! String

let HybridEvent = "Hybrid.callback"
let NaviImageHeader = "hybrid_navi_"

class MLHybridTools: NSObject {
    
    //MARK: 事件类型

    enum FunctionType: String {
        case UpdateHeader = "updateheader"
        case Back = "back"
        case Forward = "forward"
        case ShowHeader = "showheader"
        case CheckVersion = "checkver"
        case OldPay = "oldpay"
        case OnWebViewShow = "onwebviewshow"
        case OnWebViewHide = "onwebviewhide"
        case SwitchCache = "switchcache"
        case CurrentPosition = "getcurlocpos"
        //支付相关
        case PayByAlipay = "paybyalipay"
        case PayByWXpay = "paybywxpay"
        case iOSBuy = "iosbuy"
        case PayCallBack = "paycallback"
        //5.0新增
        case CopyLink = "copyLink"
        case GetLocation = "getLocation"
        case OpenMap = "openMap"
        case Pop = "pop"
        case Openlink = "openLink"
        //5.1
        case Addtoclipboard = "addtoclipboard"
        //CRM
        case  login = "login"
    }
    
    //MARK: 资源路径相关
    fileprivate let checkVersionQAURL = "http://h5.qa.medlinker.com/app/version/latestList?app=medlinker&sys_p=i&cli_v="
    fileprivate let checkVersionURL = "http://h5.medlinker.com/app/version/latestList?app=medlinker&sys_p=i&cli_v="
    
    //MARK: Method
    
    /// 解析并执行hybrid指令
    ///
    /// - Parameters:
    ///   - urlString: 原始指令串
    ///   - webView: 触发指令的容器
    ///   - appendParams: 附加到指令串中topage地址的参数 一般情况下不需要
    open func analysis(urlString: String?, webView: UIWebView = UIWebView(), appendParams: [String: String] = [:]) {
        if let urlString = urlString {
            let contentResolver = self.contentResolver(urlString: urlString, appendParams: appendParams)
            self.handleEvent(funType: contentResolver.function,
                                args: contentResolver.args,
                          callbackID: contentResolver.callbackId,
                             webView: webView)
        }
    }
    
    /// 解析hybrid指令
    ///
    /// - Parameters:
    ///   - urlString: 原始指令串
    ///   - appendParams: 附加到指令串中topage地址的参数 一般情况下不需要
    /// - Returns: 执行方法名、参数、回调ID
    open func contentResolver(urlString: String, appendParams: [String: String] = [:]) -> (function: String, args: [String: AnyObject], callbackId: String) {
        if let url = URL(string: urlString) {
            if url.scheme == MLHYBRID_SCHEME {
                let functionName = url.host ?? ""
                let paramDic = url.hybridURLParamsDic()
                var args = (paramDic["param"] ?? "").hybridDecodeURLString().hybridDecodeJsonStr()
                if let newTopageURL = (args["topage"] as? String ?? "").hybridURLString(appendParams: appendParams) {
                    args.updateValue(newTopageURL as AnyObject, forKey: "topage")
                }
                let callBackId = paramDic["callback"] ?? ""
                return (functionName, args, callBackId)
            } else {
                var args = ["topage": urlString as AnyObject, "type": "h5" as AnyObject]
                if let newTopageURL = urlString.hybridURLString(appendParams: appendParams) {
                    args.updateValue(newTopageURL as AnyObject, forKey: "topage")
                }
                return (FunctionType.Forward.rawValue, args, "")
            }
        }
        return ("", [:], "")
    }
    
    /// 根据指令执行对应的方法
    ///
    /// - Parameters:
    ///   - funType: 方法名
    ///   - args: 参数
    ///   - callbackID: 回调Id
    ///   - webView: 执行函数的容器
    func handleEvent(funType: String, args: [String: AnyObject], callbackID: String = "", webView: UIWebView) {
        print("\n****************************************")
        print("funType    === \(funType)")
        print("args       === \(args)")
        print("callbackID === \(callbackID)")
        print("****************************************\n")
        if let funType = FunctionType.init(rawValue: funType) {
            switch funType {
                case .UpdateHeader   : self.updateHeader(args, webView: webView)
                case .Back           : self.back(args, webView: webView)
                case .Forward        : self.forward(args)
                case .ShowHeader     : self.setNavigationBarHidden(args, callbackID: callbackID, webView: webView)
                case .CheckVersion   : self.checkVersion()
                case .OldPay         : self.oldPay(args, callbackID: callbackID, webView: webView)
                case .OnWebViewShow  : self.onWebViewShow(args, callbackID: callbackID, webView: webView)
                case .OnWebViewHide  : self.onWebViewHide(args, callbackID: callbackID, webView: webView)
                case .SwitchCache    : self.switchCache(args, callbackID: callbackID, webView: webView)
                case .CurrentPosition: self.handleGetCurrentPosition(callbackID, webView: webView)
                case .PayByAlipay    : self.handleAlipay(args, callbackID: callbackID, webView: webView)
                case .PayByWXpay     : self.handleWeChatPay(args, callbackID: callbackID, webView: webView)
                case .iOSBuy         : self.iOSBuy(args, callbackID: callbackID, webView: webView)
                case .PayCallBack    : self.handlePayCallBack(args, callbackID: callbackID, webView: webView)
                case .CopyLink       : self.handleCopyLink(webView: webView)
                case .GetLocation    : self.handleGetLocation(args, callbackID: callbackID, webView: webView)
                case .OpenMap        : self.handleOpenMap(args, callbackID: callbackID, webView: webView)
                case .Pop            : self.pop(args)
                case .Openlink       : self.openlink(args: args)
                case .Addtoclipboard : self.copy(args: args)
                case .login          : self.logout()
            }
        }
    }
    
    /// 执行回调
    ///
    /// - Parameters:
    ///   - data: 回调数据
    ///   - err_no: 错误码
    ///   - msg: 描述
    ///   - callback: 回调方法
    ///   - webView: 执行回调的容器
    /// - Returns: 回调执行结果
    func callBack(data:Any = "", err_no: Int = 0, msg: String = "succuess", callback: String, webView: UIWebView) -> String {
        let data = ["data": data,
                    "errno": err_no,
                    "msg": msg,
                    "callback": callback] as [String : Any]
        let dataString = data.hybridJSONString()
        return webView.stringByEvaluatingJavaScript(from: HybridEvent + "(\(dataString));") ?? ""
    }

    func currentNavi() -> UINavigationController? {
        if let vc = self.currentVC() {
            if vc is UINavigationController {
                return vc as? UINavigationController
            }
            else if vc is UITabBarController{
                let currentVC = vc as! UITabBarController
                let tabVC = currentVC.viewControllers![currentVC.selectedIndex]
                if tabVC is UINavigationController {
                    return tabVC as? UINavigationController
                }
                else {
                    return tabVC.navigationController ?? nil
                }
            }
            else {
                return vc.navigationController ?? nil
            }
        }
        return nil
    }
    
    func currentVC() -> UIViewController? {
        let vc = UIApplication.shared.keyWindow?.rootViewController ?? nil
//        while vc?.presentedViewController != nil {
//            vc = vc?.presentedViewController
//            if vc?.presentedViewController == nil {
//                if vc is RTRootNavigationController {
//                    let naviVC = vc as! RTRootNavigationController
//                    return naviVC.rt_visibleViewController
//                } else {
//                    return vc
//                }
//            }
//        }
        if vc is UITabBarController{
            let currentVC = vc as! UITabBarController
            let tabVC = currentVC.viewControllers![currentVC.selectedIndex]
            if tabVC is UINavigationController {
                let naviVC = tabVC as! UINavigationController
                return naviVC.viewControllers.last
            }
            return tabVC
        } else if vc is UINavigationController {
            let naviVC = vc as! UINavigationController
            return naviVC.viewControllers.last
        } else {
            return vc
        }
        return nil
    }
    
    func viewControllerOf(_ view: UIView) -> UIViewController {
        var nextResponder = view.next
        while !(nextResponder is UIViewController) {
            nextResponder = nextResponder?.next ?? UIViewController()
        }
        return nextResponder as? UIViewController ?? UIViewController()
    }
    
    func updateHeader(_ args: [String: AnyObject], webView: UIWebView) {
        
        if let header = Hybrid_headerModel.yy_model(withJSON: args) {
            if let titleModel = header.title, let rightButtons = header.right, let leftButtons = header.left {
                let navigationItem = self.viewControllerOf(webView).navigationItem
                if titleModel.tagname == "searchbox" {
                    navigationItem.leftBarButtonItem = nil
                    let naviTitleView = HybridNaviTitleView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width - 16, height: 44))
                    let navigationItem = self.viewControllerOf(webView).navigationItem
                    let searchBox = HybridSearchBox(frame: naviTitleView.bounds)
                    searchBox.initSearchBox(navigationItem, titleModel: titleModel, currentWebView: webView, right: rightButtons)
                    naviTitleView.addSubview(searchBox)
                    navigationItem.titleView = naviTitleView
                }
                else {
                    if titleModel.isCustom() {
                        navigationItem.titleView = self.setUpNaviTitleView(titleModel,webView: webView)
                    } else {
                        self.viewControllerOf(webView).title = titleModel.title
                    }
                    
                    if let subviews = self.viewControllerOf(webView).navigationController?.navigationBar.subviews {
                        for view in subviews {
                            if view is UIButton {
                                //移除旧的按钮
                                view.removeFromSuperview()
                            }
                        }
                    }
                    self.setRightButtons(rightButtons, navigationItem: navigationItem, webView: webView)
                    self.setLeftButtons(leftButtons, navigationItem: navigationItem, webView: webView)
                }
            }
        }

    }
    
    func setLeftButtons(_ leftButtons:[Hybrid_naviButtonModel], navigationItem: UINavigationItem, webView: UIWebView) {
        if (leftButtons.count == 1 && leftButtons.first?.tagname == "back") || leftButtons.count == 0 {
            if let _ = self.viewControllerOf(webView) as? MLHybridViewController {
//                vc.setCustomBackBarButtonItem(handler: { (button) in
//                    if let callback = leftButtons.first?.callback, callback.characters.count > 0 {
//                        let _ = self.callBack(data: "" as AnyObject, err_no: 0, msg: "success", callback: callback,webView: webView)
//                    } else {
//                        let _ = self.viewControllerOf(webView).navigationController?.popViewController(animated: true)
//                    }
//                })
            } else {
                let _ = self.currentVC()?.navigationController?.popViewController(animated: true)
            }
        } else {
            self.viewControllerOf(webView).navigationItem.setLeftBarButton(UIBarButtonItem(), animated: true)
//            for v in self.setUpButtons(leftButtons, webView: webView) {
//                self.viewControllerOf(webView).navigationController?.navigationBar.addSubview(v)
//            }
            self.viewControllerOf(webView).navigationController?.navigationItem.setRightBarButtonItems(self.setUpButtons(leftButtons, webView: webView), animated: true)

        }
    }
    
    func setRightButtons(_ rightButtons:[Hybrid_naviButtonModel], navigationItem: UINavigationItem, webView: UIWebView) {
//        for v in self.setUpButtons(rightButtons, webView: webView, isRight: true) {
//            self.viewControllerOf(webView).navigationController?.navigationBar.addSubview(v)
////            self.viewControllerOf(webView).navigationController?.navigationItem.titleView?.addSubview(v)
//        }
        
        self.viewControllerOf(webView).navigationItem.setRightBarButtonItems(self.setUpButtons(rightButtons, webView: webView, isRight: true), animated: true)
    }

    func setUpNaviTitleView(_ titleModel:Hybrid_titleModel, webView: UIWebView) -> HybridNaviTitleView {
        let naviTitleView = HybridNaviTitleView(frame: CGRect(x: 0, y: 0, width: 150, height: 30))
        let leftUrl = NSURL(string: titleModel.lefticon) ?? NSURL()
        let rightUrl = NSURL(string: titleModel.righticon) ?? NSURL()
        naviTitleView.loadTitleView(titleModel.title, subtitle: titleModel.subtitle, lefticonUrl: leftUrl as URL, righticonUrl: rightUrl as URL, callback: titleModel.callback, currentWebView: webView)
        return naviTitleView
    }
    
    
    func setUpButtons(_ buttonModels:[Hybrid_naviButtonModel], webView: UIWebView, isRight: Bool = false) -> [UIBarButtonItem] {
        let buttonModels = buttonModels.reversed()
        var buttons = [UIBarButtonItem]()
        var buttonX: CGFloat = 0
        var lastButtonX: CGFloat = 0
        var lastButtonWidth: CGFloat = 0
        if isRight {
            lastButtonX = UIScreen.main.bounds.size.width
        }
        let margin: CGFloat = 13
        for buttonModel in buttonModels {
            let button = UIButton()
            let titleWidth = buttonModel.value.hybridStringWidthWith(15, height: 20) + 2*margin
            let buttonWidth = titleWidth > 42 ? titleWidth : 42
            if isRight {
                buttonX = UIScreen.main.bounds.size.width - buttonWidth - (UIScreen.main.bounds.size.width - lastButtonX)
            } else {
                buttonX = lastButtonX + lastButtonWidth
                lastButtonWidth = buttonWidth
            }
            lastButtonX = buttonX
//            button.frame = CGRect(x: buttonX, y: 0, width: buttonWidth, height: 44)
            
            button.frame = CGRect(x: 0, y: 0, width: buttonWidth, height: 44)

            
            button.titleLabel?.font = UIFont.systemFont(ofSize: 15)
//            button.setTitleColor(MLTheme.color.lightBlue, for: .normal)
            button.setTitleColor(.white, for: .normal)
            if buttonModel.icon.characters.count > 0 {
                button.setZYHWebImage(buttonModel.icon as NSString?, defaultImage: "", isCache: true)
            }
            else if buttonModel.tagname.characters.count > 0 {
                print("加载图片 \(NaviImageHeader + buttonModel.tagname)")
                print(UIImage(named: NaviImageHeader + buttonModel.tagname) ?? "未找到对应图片资源")
                button.setImage(UIImage(named: NaviImageHeader + buttonModel.tagname), for: .normal)
            }
            if buttonModel.value.characters.count > 0 {
                button.setTitle(buttonModel.value, for: .normal)
            }
            button.addBlock(for: .touchUpInside, block: { (sender) in
                let _ = self.callBack(data: "" as AnyObject, err_no: 0, msg: "success", callback: buttonModel.callback,webView: webView)
                if buttonModel.tagname == "back" && buttonModel.callback == "" {
                    //假死 则执行本地的普通返回事件
                    if webView.canGoBack {
                        webView.goBack()
                    } else {
                        self.back(["":"" as AnyObject], webView: webView)
                    }
                } else if buttonModel.tagname == "close" {
                    self.back(["":"" as AnyObject], webView: webView)
                }
            })
            buttons.append(UIBarButtonItem(customView: button))
        }
        return buttons
    }

    
    func back(_ args: [String: AnyObject], webView: UIWebView) {
        self.viewControllerOf(webView).navigationController?.popViewController(animated: true)
//        if let navi = self.viewControllerOf(webView).navigationController ?? self.currentNavi() {
//            if let rt_navi = navi as? RTContainerNavigationController {
//                if rt_navi.rt_navigationController.rt_viewControllers.count > 1 {
//                    rt_navi.popViewController(animated: true)
//                } else {
//                    rt_navi.dismiss(animated: true, completion: nil)
//                }
//            } else if navi.viewControllers.count > 1 {
//                navi.popViewController(animated: true)
//            } else {
//                navi.dismiss(animated: true, completion: nil)
//            }
//        }
//        else {
//            print("navi == nil")
//        }
    }
    
    func forward(_ args: [String: AnyObject]) {
        if  args["type"] as? String == "h5" {
            if let url = args["topage"] as? String {
                if let webViewController = MLHybridViewController.load(urlString: url) {
                    webViewController.Cookie = args["Cookie"] as? String
                    if let animate = args["animate"] as? String , animate == "present" {
                        let navi = UINavigationController(rootViewController: webViewController)
                        self.currentVC()?.present(navi, animated: true, completion: nil)
                    }
                    else {
                        if let navi =  self.currentNavi() {
                            if let vc  = navi.viewControllers.last as? MLHybridViewController {
                                if let animate = args["animate"] as? String , animate == "pop" {
                                    vc.animateType = .pop
                                }
                                else {
                                    vc.animateType = .normal
                                }
                            }
                            navi.pushViewController(webViewController, animated: true)
                        }
                    }
                }
            }
        } else {
//            if let url = args["topage"] as? String {
//                //这里指定跳转到本地某页面   需要一个判断映射的方法
////                MLPageUrlParseManager(currentVC: self.currentVC()).handlePageJumpWithUrl(url)
//            }
        }
    }
    
    
    func setNavigationBarHidden(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let hidden: Bool = !(args["display"] as? Bool ?? true)
        let animated: Bool = args["animate"] as? Bool ?? true
        let vc = self.viewControllerOf(webView)
        if vc.navigationController?.viewControllers.last == vc {
            vc.navigationController?.setNavigationBarHidden(hidden, animated: animated)
        }
        vc.navigationController?.isNavigationBarHidden = hidden
        vc.view.setNeedsLayout()
    }
    
    /**
     * 获取设备位置
     */
    func handleGetCurrentPosition(_ callBackId: String, webView: UIWebView) {
        if let vc = self.currentVC() as? MLHybridViewController {
            vc.locationModel.getLocation { (success, errcode, resultData) in
                _ = self.callBack(data: resultData as AnyObject? ?? "" as AnyObject, err_no: errcode, callback: callBackId, webView: webView)
            }
        }
    }
    
    func oldPay(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let payUrl = args["orderurl"] as? String ?? ""
        MLPay.wallet(payUrl, currentController: self.currentVC() ?? UIViewController()) { (success, errorMsg, resultCode) in
            webView.reload()
            print("状态： \(success)  errorMsg: \(errorMsg) resultCode: \(resultCode)")
        }
    }

    func onWebViewShow(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        if let vc = self.viewControllerOf(webView) as? MLHybridViewController {
            vc.onShowCallBack = callbackID
        }
    }
    
    func onWebViewHide(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        if let vc = self.viewControllerOf(webView) as? MLHybridViewController {
            vc.onHideCallBack = callbackID
        }
    }

    func switchCache(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        if let open = args["open"] as? Bool {
            UserDefaults.standard.set(!open, forKey: "HybridSwitchCacheClose")
        }
    }
    
}


//MARK: 支付

extension MLHybridTools {
    /**
     * 支付宝支付
     */
    func handleAlipay(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let orderString  = args["payInfo"] as? String ?? ""
        MLPay.sharedInstance.alipay(orderString) { (success, errorMsg, resultCode) in
            _ = self.callBack(data: resultCode, err_no: 0, msg: errorMsg, callback: callbackID, webView: webView)
            if let finishBlock = MLPay.sharedInstance.finishBlock {
                finishBlock(success, errorMsg, resultCode)
            }
        }
    }
    
    /**
     * 微信支付
     */
    func handleWeChatPay(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let orderString = args["payInfo"] as? String ?? ""

        let data = orderString.data(using: String.Encoding.utf8)
        let orderDic = try? JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.mutableContainers)

//        let orderDic = args["payInfo"] as? [AnyHashable: Any] ?? ["": ""]
        MLPay.sharedInstance.weChat(orderDic as! [AnyHashable : Any], finishBlock: { (success, errorMsg, resultCode) in
            _ = self.callBack(data: resultCode, err_no: 0, msg: errorMsg, callback: callbackID, webView: webView)
            if let finishBlock = MLPay.sharedInstance.finishBlock {
                finishBlock(success, errorMsg, resultCode)
            }
        })
    }
    
    /**
     * H5钱包支付回调
     */
    func handlePayCallBack(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        print("handlePayCallBack")
        print("args == \(args)")
        
        if let finishBlock = MLPay.sharedInstance.finishBlock, let vc = self.currentVC() {
            let status = args["status"] as? Int ?? 0
            _ = vc.navigationController?.popViewController(animated: true)
            switch status {
            case 1:
                //成功
                finishBlock(true, "钱包支付成功", "")
                break
            case 2:
                //失败
                finishBlock(false, "钱包支付失败", "")
                break
            case 3:
                //用户取消
                finishBlock(false, "用户取消钱包支付", "")
                break
            default:
                finishBlock(false, "钱包支付未知错误", "")
                break
            }
        }
        else {
            if let vc = self.currentVC() {
                _ = vc.navigationController?.popViewController(animated: true)
            }
        }
    }

    func iOSBuy(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
//        if MLIAPHelper.isIAPPurching {
//            return
//        }
//        MLIAPHelper.isIAPPurching = true
////        let productID = args["pid"] as? String ?? ""
//        let productID = args["pid"] as? String ?? ""
//        MLIAPHelper.buyWithProductID(productID) { (success, errorMsg) in
//            print("productID == \(productID)")
//            MLIAPHelper.isIAPPurching = false
//            NotificationCenter.default.post(name: Notification.Name(rawValue: "updateAccount"), object: nil)
//            if success {
//                //                MLTosat.message("充值成功")
//            } else {
//                print("充值失败")
//            }
//        }
    }

    /**
     * 复制网页链接
     */
    func handleCopyLink(webView: UIWebView) {
        if let urlString = webView.request?.url?.absoluteString {
            let pasteboard = UIPasteboard.general
            pasteboard.string = urlString
        }
    }

    
    
    /**
     * 获取位置
     */
    func handleGetLocation(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        if let vc = self.currentVC() as? MLHybridViewController {
            vc.locationModel.getLocation { (success, errcode, resultData) in
                _ = self.callBack(data: resultData as AnyObject? ?? "" as AnyObject, err_no: errcode, callback: callbackID, webView: webView)
            }
        }

    }
    
    /**
     * 打开地图并定位
     */
    func handleOpenMap(_ args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let latitude = Double(args["latitude"] as? String ?? "") ?? 0
        let longitude = Double(args["longitude"] as? String ?? "") ?? 0
        let name = args["name"] as? String ?? "未知"
        let address = args["address"] as? String ?? "未知"
        let infoUrl = args["infoUrl"] as? String ?? ""

        
        let vc = MLHybridMapViewController()
        vc.latitude = latitude
        vc.longitude = longitude
        vc.name = name
        vc.address = address
        vc.infoUrl = infoUrl
        self.currentNavi()?.pushViewController(vc, animated: true)
    }

    /**
     * pop 返回num个页面
     */
    func pop(_ args: [String: AnyObject]) {
//        let num = args["num"] as? Int ?? 0
//        //推出所有hybrid页面
//        if num == 999 {
//            guard let vcs = self.currentVC()?.rt_navigationController.rt_viewControllers else {return}
//            var toVC = vcs.first
//            var i = 0
//            while i < vcs.count {
//                if vcs[vcs.count - i - 1] is MLHybridViewController {
//                    toVC = vcs[vcs.count - i - 1]
//                }
//                i = i + 1
//            }
//            if let toVC = toVC {
//                let _ = self.currentVC()?.navigationController?.popToViewController(toVC, animated: true)
//            }
//        }
//        //返回指定步骤
//        if let vcs = self.currentVC()?.rt_navigationController.rt_viewControllers {
//            if vcs.count > num {
//                let vc = vcs[vcs.count - num - 1]
//                let _ = self.currentVC()?.navigationController?.popToViewController(vc, animated: true)
//            }
//        }
    }

    func openlink(args: [String: AnyObject]) {
        let url = args["url"] as? String ?? ""
        self.jumpToThirdParty(url: url)
    }
    
    func copy(args: [String: AnyObject]) {
        let content = args["content"] as? String ?? ""
        UIPasteboard.general.string = content
//        MLToast.message("已复制")
    }
    func logout() {
        MLHybridViewController.clearCookie(urlString: "www.medlinker.com")
    }
    
    func jumpToThirdParty(url: String) {
        if let vc = MLOpenWebViewController.loadURL(url: url) {
            self.currentNavi()?.pushViewController(vc, animated: true)
        }
    }

}

//MARK: 离线包相关

extension MLHybridTools {
    open func showVersion() {
        let hybridVersionArray = UserDefaults.standard.value(forKey: "HybridVersion") as? NSMutableArray ?? ["未获取到版本信息"]
        let msg = hybridVersionArray.yy_modelToJSONString()
        let alert = UIAlertController(title: "离线包版本信息", message: msg, preferredStyle: .alert)
        let action = UIAlertAction(title: "确定", style: .default, handler: nil)
        alert.addAction(action)
        self.currentVC()?.present(alert, animated: true, completion: nil)
    }
    
    open func checkVersion() {
        let versionStr = Bundle.main.infoDictionary!["CFBundleShortVersionString"]
//        let checkVersionURLString = MLConfiguration.mlHTTPType == .qa ? checkVersionQAURL : checkVersionURL

        let checkVersionURLString = checkVersionURL

        
        let url:URL! = URL(string: checkVersionURLString + "\(versionStr!)")
        let urlRequest:NSMutableURLRequest = NSMutableURLRequest(url: url)
        urlRequest.httpMethod = "GET"
        //响应对象
        NSURLConnection.sendAsynchronousRequest(urlRequest as URLRequest, queue: OperationQueue.main, completionHandler: { (response, data, error) -> Void in
            do{//发送请求
                if let responseData = data {
                    let jsonData = try JSONSerialization.jsonObject(with: responseData, options: JSONSerialization.ReadingOptions.allowFragments)
                    if let dic = jsonData as? NSDictionary, let dataArray = dic["data"] as? [AnyObject] {
                        
                        UserDefaults.standard.setValue(dataArray, forKey: "HybridVersion")
                        for dataDic in dataArray {
                            let channel = dataDic["channel"] as? String ?? ""
                            let version = dataDic["version"] as? String ?? ""
                            let src = dataDic["src"] as? String ?? ""
                            if version.compare(self.localResourcesVersion(channel: channel), options: NSString.CompareOptions.numeric) == .orderedDescending {
                                self.loadZip(channel: channel, version: version, urlString: src, completion: nil)
                            }
                            else {
                                print("不更新 \(channel).zip")
                            }
                        }
                    }
                }
                else {
                    print("checkVersion data null")
                }
            }
            catch let error as NSError{
                print(error.localizedDescription)
            }
        })
    }
    
    private func loadZip(channel: String, version: String, urlString: String, completion: ((_ success: Bool, _ msg: String) -> Void)?) {
//        if version == "forbidden" {
//            let filePath = self.filePath(channel: channel)
//            self.deleteAllFiles(path: filePath)
//            return
//        }
//        if let url = URL(string: urlString) {
//            let urlRequest:NSMutableURLRequest = NSMutableURLRequest(url: url)
//            urlRequest.httpMethod = "GET"
//            NSURLConnection.sendAsynchronousRequest(urlRequest as URLRequest, queue: OperationQueue.main, completionHandler: { (response, data, error) -> Void in
//                if error != nil {
//                    completion?(false, error!.localizedDescription)
//                }
//                if let responseData = data {
//                    let filePath = self.filePath(channel: channel)
//                    let zipPath = filePath + ".zip"
//                    self.deleteAllFiles(path: filePath)
//                    if (try? responseData.write(to: URL(fileURLWithPath: zipPath), options: [.atomic])) != nil {
//                        if SSZipArchive.unzipFile(atPath: zipPath, toDestination: filePath) {
//                            self.setLocalResourcesVersion(channel: channel, version: version)
//                            self.deleteAllFiles(path: zipPath)
//                            print("下载并解压了 \(channel)")
//                            completion?(true, "")
//                        }
//                        else {
//                            completion?(false, "解压失败 \(zipPath)")
//                        }
//                    }
//                    else {
//                        completion?(false, "写入失败 \(zipPath)")
//                    }
//                }
//                else {
//                    completion?(false, "更新包 为空")
//                }
//            })
//        }
    }
    
    private func filePath(channel: String) -> String {
        do {
            let documentPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)[0] + "/h5"
            let fileManager = FileManager.default
            try fileManager.createDirectory(atPath: documentPath, withIntermediateDirectories: true, attributes: nil)
            return documentPath + "/" + channel
        } catch {
            return ""
        }
    }
    
    private func deleteAllFiles(path: String) {
        do {
            if let fileArray : [AnyObject] = FileManager.default.subpaths(atPath: path) as [AnyObject]? {
                for f in fileArray {
                    if FileManager.default.fileExists(atPath: path + "/\(f)") {
                        try FileManager.default.removeItem(atPath: path + "/\(f)")
                    }
                }
            }
            if FileManager.default.fileExists(atPath: path) {
                try FileManager.default.removeItem(atPath: path)
            }
        } catch {
        }
    }
    
    private func localResourcesVersion(channel:String) -> String {
        let versionDic = UserDefaults.standard.value(forKey: "LocalResourcesVersionDic") as? [String: String] ?? ["": ""]
        return versionDic[channel] ?? ""
    }
    
    private func setLocalResourcesVersion(channel:String, version: String) {
        var defaultsDic = UserDefaults.standard.value(forKey: "LocalResourcesVersionDic") as? [String: String] ?? ["": ""]
        defaultsDic[channel] = version
        UserDefaults.standard.set(defaultsDic, forKey: "LocalResourcesVersionDic")
    }

}

private class MLOpenWebViewController: UIViewController, UIWebViewDelegate {
    let webview = UIWebView()
//    var _webViewProgressView = NJKWebViewProgressView()
//    let _webViewProgress = NJKWebViewProgress()
    
    var tool: MLHybridTools = MLHybridToolForMedlinker()
    
    class func loadURL(url: String) -> MLOpenWebViewController? {
        let vc = MLOpenWebViewController()
        let escapedAddress = url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        if let url = URL(string: escapedAddress ) {
            vc.webview.loadRequest(URLRequest(url: url))
            vc.hidesBottomBarWhenPushed = true
            return vc
        }
        return nil
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        webview.frame = CGRect(x: 0, y: 0, width: self.view.bounds.width, height: self.view.bounds.height - 64)
        self.view.addSubview(webview)
        
//        webview.delegate = _webViewProgress
//        _webViewProgress.webViewProxyDelegate = self;
//        _webViewProgress.progressDelegate = self;
        
        let navBounds = self.navigationController?.navigationBar.bounds
        let barFrame = CGRect(x: 0, y: (navBounds?.size.height ?? 0) - 2, width: navBounds?.size.width ?? 0, height: 2)
//        _webViewProgressView = NJKWebViewProgressView(frame: barFrame)
//        _webViewProgressView.setProgress(0, animated: true)
//        self.navigationController?.navigationBar.addSubview(_webViewProgressView)
        
        let navigationItem = MLHybridTools().viewControllerOf(webview).navigationItem
        let closeDic = ["tagname": "back"]
        let closeDic2 = ["tagname": "close",
                         "value": "关闭"]
        let buttonArray = [Hybrid_naviButtonModel.yy_model(withJSON: closeDic2)!,Hybrid_naviButtonModel.yy_model(withJSON: closeDic)!]
        MLHybridTools().setLeftButtons(buttonArray, navigationItem: navigationItem, webView: webview)
    }
    
    func webViewDidFinishLoad(_ webView: UIWebView) {
        if let title = webView.stringByEvaluatingJavaScript(from: "document.title") {
            self.title = title
        }
    }
    
    func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        if request.url!.absoluteString.hasPrefix("\(MLHYBRID_SCHEME)://") {
            self.tool.analysis(urlString: request.url?.absoluteString, webView: webView)
        }
        return true
    }
    
//    func webViewProgress(_ webViewProgress: NJKWebViewProgress!, updateProgress progress: Float) {
//        if progress > 0.7 {
//            _webViewProgressView.setProgress(progress, animated: true)
//        } else {
//            _webViewProgressView.setProgress(0.7, animated: true)
//        }
//    }
}

extension MLHybridTools {
    class func readSetting() -> NSDictionary {
        let settingListPath: String = Bundle.main.path(forResource: "MLHybridSetting", ofType:"plist")!
        return NSMutableDictionary(contentsOfFile:settingListPath)!
    }
}
