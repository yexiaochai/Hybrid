//
//  MLTools.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/31.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class MLTools: NSObject {

    //地址相关
//    let BASE_URL = "http://yexiaochai.github.io/Hybrid/webapp/"
    let BASE_URL = "http://kq.qa.medlinker.com/webapp/"

    
    let USER_AGENT_HEADER = "hybrid_"
    
    //事件类型
    let UpdateHeader = "updateheader"
    let Back = "back"
    let Forward = "forward"
    let Get = "get"
    let Post = "post"
    let ShowLoading = "showloading"
    let ShowHeader = "showheader"
    let CheckVersion = "checkver"

    //Event前缀
    let HybridEvent = "Hybrid.callback"
    
    //资源路径相关
    let NaviImageHeader = "hybrid_navi_"
    let LocalResources = "DogHybridResources/"

    func analysisUrl(url: String?, webView: UIWebView = UIWebView()) {
        if let requestStr = url {
            if requestStr.hasPrefix("hybrid://") {
                let dataString = requestStr.stringByReplacingOccurrencesOfString("hybrid://", withString: "")
                let dataArray = dataString.componentsSeparatedByString("?")
                let function: String = dataArray[0] ?? ""
                
                let paramString = dataString.stringByReplacingOccurrencesOfString(dataArray[0] + "?", withString: "")
                let paramArray = paramString.componentsSeparatedByString("&")
                
                var paramDic: Dictionary = ["": ""]
                for str in paramArray {
                    let tempArray = str.componentsSeparatedByString("=")
                    if tempArray.count > 1 {
                        paramDic.updateValue(tempArray[1], forKey: tempArray[0])
                    }
                }
                let args = self.decodeJsonStr(self.decodeUrl(paramDic["param"] ?? ""))
                let callBackId = paramDic["callback"] ?? ""
                self.handleEvent(function, args: args, callbackID: callBackId, webView: webView)
            }
        }
    }

    func handleEvent(funType: String, args: [String: AnyObject], callbackID: String = "", webView: UIWebView) {
//        print("   ")
//        print("****************************************")
//        print("funType    === \(funType)")
//        print("args       === \(args)")
//        print("callbackID === \(callbackID)")
//        print("****************************************")
//        print("   ")
        if funType == UpdateHeader {
            self.updateHeader(args, webView: webView)
        } else if funType == Back {
            self.back(args, webView: webView)
        } else if funType == Forward {
            self.forward(args)
        } else if funType == Get {
            self.hybridGet(args, callbackID: callbackID, webView: webView)
        } else if funType == Post {
            self.hybridPost(args, callbackID: callbackID, webView: webView)
        } else if funType == ShowLoading {
            self.showLoading(args, callbackID: callbackID)
        } else if funType == ShowHeader {
            self.setNavigationBarHidden(args, callbackID: callbackID)
        } else if funType == CheckVersion {
            self.checkVersion()
        }
        
        
    }

    func toJSONString(dict: NSDictionary!)->NSString{
        if let jsonData = try? NSJSONSerialization.dataWithJSONObject(dict, options: NSJSONWritingOptions.PrettyPrinted) {
            if let strJson = NSString(data: jsonData, encoding: NSUTF8StringEncoding) {
                return strJson
            }
            else {
                return ""
            }
        }
        else {
            return ""
        }
    }

    func callBack(data:AnyObject, errno: Int, msg: String, callback: String, webView: UIWebView) -> String {
        let data = ["data": data,
                    "errno": errno,
                    "msg": msg,
                    "callback": callback]
        let dataString = self.toJSONString(data)
        return webView.stringByEvaluatingJavaScriptFromString(self.HybridEvent + "(\(dataString));") ?? ""
    }

    /**
     * url decode
     */
    func decodeUrl (url: String) -> String {
        let mutStr = NSMutableString(string: url)
        mutStr.replaceOccurrencesOfString("+", withString: " ", options: NSStringCompareOptions.LiteralSearch, range: NSMakeRange(0, mutStr.length))
        return mutStr.stringByReplacingPercentEscapesUsingEncoding(NSUTF8StringEncoding) ?? ""
    }
    
    func decodeJsonStr(jsonStr: String) -> [String: AnyObject] {
        if let jsonData = jsonStr.dataUsingEncoding(NSUTF8StringEncoding) where jsonStr.characters.count > 0 {
            do {
                return try NSJSONSerialization.JSONObjectWithData(jsonData, options: NSJSONReadingOptions.MutableContainers) as? [String: AnyObject] ?? ["":""]
            } catch let error as NSError {
                print("decodeJsonStr == \(error)")
            }
        }
        return [String: AnyObject]()
    }

    func jsonStringWithObject(object: AnyObject) throws -> String {
        let data = try NSJSONSerialization.dataWithJSONObject(object, options: NSJSONWritingOptions(rawValue: 0))
        let string = String(data: data, encoding: NSUTF8StringEncoding)!
        return string
    }

    func currentNavi() -> UINavigationController {
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            if vc is UINavigationController {
                return vc as! UINavigationController
            }
            else {
                return vc.navigationController ?? UINavigationController()
            }
        }
        return UINavigationController()
    }
    
    func currentVC() -> UIViewController {
        return UIApplication.sharedApplication().keyWindow?.rootViewController ?? UIViewController()
    }

    func viewInController(view: UIView) -> UIViewController {
        var nextResponder = view.nextResponder()
        while !(nextResponder is UIViewController) {
            nextResponder = nextResponder?.nextResponder() ?? UIViewController()
        }
        return nextResponder as? UIViewController ?? UIViewController()
    }
    
    func updateHeader(args: [String: AnyObject], webView: UIWebView) {
        if let header = Hybrid_headerModel.yy_modelWithJSON(args) {
            if let titleModel = header.title, let rightButtons = header.right, let leftButtons = header.left {
                let navigationItem = self.viewInController(webView).navigationItem ?? UINavigationItem()
                navigationItem.titleView = self.setUpNaviTitleView(titleModel,webView: webView)
                navigationItem.setRightBarButtonItems(self.setUpNaviButtons(rightButtons,webView: webView), animated: true)
                navigationItem.setLeftBarButtonItems(self.setUpNaviButtons(leftButtons,webView: webView), animated: true)
            }
        }
    }
    
    func setUpNaviTitleView(titleModel:Hybrid_titleModel, webView: UIWebView) -> HybridNaviTitleView {
        let naviTitleView = HybridNaviTitleView(frame: CGRectMake(0, 0, 150, 30))
        let leftUrl = NSURL(string: titleModel.lefticon) ?? NSURL()
        let rightUrl = NSURL(string: titleModel.righticon) ?? NSURL()
        naviTitleView.loadTitleView(titleModel.title, subtitle: titleModel.subtitle, lefticonUrl: leftUrl, righticonUrl: rightUrl, callback: titleModel.callback, currentWebView: webView)
        return naviTitleView
    }
    
    func setUpNaviButtons(buttonModels:[Hybrid_naviButtonModel], webView: UIWebView) -> [UIBarButtonItem] {
        var buttons = [UIBarButtonItem]()
        for buttonModel in buttonModels {
            let button = UIButton()
            let titleWidth = buttonModel.value.stringWidthWith(14, height: 20)
            let buttonWidth = titleWidth > 42 ? titleWidth : 42
            button.frame = CGRectMake(0, 0, buttonWidth, 30)
            button.titleLabel?.font = UIFont.systemFontOfSize(14)
            button.setTitleColor(UIColor.blackColor(), forState: .Normal)
            if buttonModel.icon.characters.count > 0 {
                button.setImageForState(.Normal, withURL: NSURL(string: buttonModel.icon) ?? NSURL())
            }
            else if buttonModel.tagname.characters.count > 0 {
                button.imageEdgeInsets = UIEdgeInsetsMake(0, -30, 0, 0)
                button.setImage(UIImage(named: NaviImageHeader + buttonModel.tagname), forState: .Normal)
            }
            if buttonModel.value.characters.count > 0 {
                button.imageEdgeInsets = UIEdgeInsetsMake(0, -10, 0, 0)
                button.setTitle(buttonModel.value, forState: .Normal)
            }
            button.addBlockForControlEvents(.TouchUpInside, block: { (sender) in
                let backString = self.callBack("", errno: 0, msg: "success", callback: buttonModel.callback,webView: webView)
                if buttonModel.tagname == "back" && backString == "" {
                    //假死 则执行本地的普通返回事件
                    self.back(["":""], webView: webView)
                }
            })
            let menuButton = UIBarButtonItem(customView: button)
            buttons.append(menuButton)
        }
        return buttons.reverse()
    }
    
    func back(args: [String: AnyObject], webView: UIWebView) {
        let navi = self.viewInController(webView).navigationController ?? self.currentNavi()
        if navi.viewControllers.count > 1 {
            navi.popViewControllerAnimated(true)
        }
        else {
            navi.dismissViewControllerAnimated(true, completion: nil)
        }
    }
    
    func forward(args: [String: AnyObject] ) {
        if  args["type"] as? String == "h5" {
            if let url = args["topage"] as? String {
                let webViewController = MLWebViewController()
                webViewController.hidesBottomBarWhenPushed = true
                let localUrl = LocalResources + url.stringByReplacingOccurrencesOfString(".html", withString: "")
                if let _ = NSBundle.mainBundle().pathForResource(localUrl, ofType: "html") {
                    webViewController.localUrl = localUrl
                }
                else {
                    webViewController.URLPath = url
                }
                if let animate = args["animate"] as? String where animate == "present" {
                    let navi = UINavigationController(rootViewController: webViewController)
                    self.currentVC().presentViewController(navi, animated: true, completion: nil)
                }
                else {
                    let vc = self.currentNavi().viewControllers.last as? MLWebViewController
                    if let animate = args["animate"] as? String where animate == "pop" {
                        vc?.animateType = .Pop
                        
                    }
                    else {
                        vc?.animateType = .Normal
                    }
                    webViewController.navigationItem.setHidesBackButton(true, animated: false)
                    self.currentNavi().pushViewController(webViewController, animated: true)
                }
            }
        } else {
            //这里指定跳转到本地某页面   需要一个判断映射的方法
            if  args["topage"] as! String == "index2" {
                let webTestViewController = WebTestViewController.instance()
                if let animate =  args["animate"] as? String where animate == "present" {
                    let navi = UINavigationController(rootViewController: webTestViewController)
                    self.currentVC().presentViewController(navi, animated: true, completion: nil)
                }
                else {
                    if let hidden =  args["hasnavigation"] as? Bool where hidden == false {
                        self.currentNavi().navigationBarHidden = true
                    }
                    else {
                        self.currentNavi().navigationBarHidden = false
                    }
                    self.currentNavi().pushViewController(webTestViewController, animated: true)
                }
            }
        }
    }
    
    func showLoading(args: [String: AnyObject], callbackID: String) {
        dispatch_async(dispatch_get_main_queue()) {
            if args["display"] as? Bool ?? true {
                self.currentVC().startLoveEggAnimating()
            }
            else {
                self.currentVC().stopAnimating()
            }
        }
    }
    
    func setNavigationBarHidden(args: [String: AnyObject], callbackID: String) {
        let hidden: Bool = !(args["display"] as? Bool ?? true)
        let animated: Bool = args["animate"] as? Bool ?? true
        self.currentNavi().setNavigationBarHidden(hidden, animated: animated)
    }
    
    func hybridGet(args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let sessionManager = AFHTTPSessionManager(baseURL: nil)
        var parameters = args
        parameters.removeValueForKey("url")
        let url = args["url"] as? String ?? ""
        sessionManager.GET(url, parameters: parameters, progress: { (progress) in
            }, success: { (sessionDataTask, jsonObject) in
                if let callbackString = try? self.jsonStringWithObject(jsonObject!) {
                    self.callBack(callbackString, errno: 0, msg: "success", callback: callbackID, webView: webView)
                }
            }, failure: { (sessionDataTask, error) in
                print("hybridGet error == \(error)")
        })
    }
    
    func hybridPost(args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let sessionManager = AFHTTPSessionManager(baseURL: nil)
        var parameters = args
        parameters.removeValueForKey("url")
        let url = args["url"] as? String ?? ""
        sessionManager.POST(url, parameters: parameters, progress: { (progress) in
            }, success: { (sessionDataTask, jsonObject) in
                if let callbackString = try? self.jsonStringWithObject(jsonObject!) {
                    self.callBack(callbackString, errno: 0, msg: "success", callback: callbackID,webView: webView)
                }
            }, failure: { (sessionDataTask, error) in
                print("hybridPost error == \(error)")
        })
    }
    
    func checkVersion() {
        self.currentNavi().popToRootViewControllerAnimated(true)
        //创建NSURL对象
        let url:NSURL! = NSURL(string: "http://yexiaochai.github.io/Hybrid/webapp/hybrid_ver.json")
        //创建请求对象
        let urlRequest:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        urlRequest.HTTPMethod = "GET"
        //响应对象
        NSURLConnection.sendAsynchronousRequest(urlRequest, queue: NSOperationQueue.mainQueue(), completionHandler: { (response, data, error) -> Void in
            do{//发送请求
                if let responseData = data {
                    let dictionary = try NSJSONSerialization.JSONObjectWithData(responseData, options: NSJSONReadingOptions.AllowFragments)
                    print(dictionary)
                    if let dataDic = dictionary as? [String: String] {
                        for (key, value) in dataDic {
                            let defaultsDic = NSUserDefaults.standardUserDefaults().valueForKey("LocalResources") as? [String: String] ?? ["": ""]
                            if value.compare(defaultsDic[key] ?? "", options: NSStringCompareOptions.NumericSearch) == .OrderedDescending {
                                self.loadZip(key, value: value, urlString: "http://yexiaochai.github.io/Hybrid/webapp/" + key + ".zip", completion: { (success, msg) in
                                    if !success {
                                        let alert = UIAlertView(title: "更新失败", message: msg, delegate: nil, cancelButtonTitle: "确定")
                                        alert.show()
                                    }
                                })
                            }
                            else {
                                print("不更新 \(key).zip")
                            }
                        }
                    }
                }
                else {
                    print("data null")
                }
            }
            catch let error as NSError{
                print(error.localizedDescription)
            }
        })
    }
    
    func loadZip(key: String, value: String, urlString: String, completion: ((success: Bool, msg: String) -> Void)?) {
        //创建NSURL对象
        let url:NSURL! = NSURL(string: urlString)
        //创建请求对象
        let urlRequest:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        urlRequest.HTTPMethod = "GET"
        NSURLConnection.sendAsynchronousRequest(urlRequest, queue: NSOperationQueue.mainQueue(), completionHandler: { (response, data, error) -> Void in
            if let responseData = data {
                do{
                    let documentPath = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.DocumentDirectory, NSSearchPathDomainMask.UserDomainMask, true)[0]
                    let filePath = documentPath + "/" + key
                    let zipPath = filePath + ".zip"
                    //删除目录下所有文件
                    if let fileArray : [AnyObject] = NSFileManager.defaultManager().subpathsAtPath(filePath) {
                        for f in fileArray {
                            if NSFileManager.defaultManager().fileExistsAtPath(filePath + "/\(f)") {
                                try NSFileManager.defaultManager().removeItemAtPath(filePath + "/\(f)")
                            }
                            else {
                                print("删除文件 \(filePath + "/\(f)") 不存在")
                            }
                        }
                    }
                    if responseData.writeToFile(zipPath, atomically: true) {
                        if SSZipArchive.unzipFileAtPath(zipPath, toDestination: documentPath) {
                            print("下载并解压了 \(key)")
                            //取得当前应用下路径
                            let newKeyPath = documentPath + "/" + key
                            if let fileArray = NSFileManager.defaultManager().subpathsAtPath(newKeyPath) {
                                                        print("key == \(key)")
                                                        for file in fileArray {
                                                            print("     \(file)")
                                                        }
                                print("包含文件 \(fileArray.count)")
                            }
                            else {
                                print(NSFileManager.defaultManager().subpathsAtPath(documentPath))
                                print("fileArray 为空")
                            }

                            if NSFileManager.defaultManager().fileExistsAtPath(zipPath) {
                                try NSFileManager.defaultManager().removeItemAtPath(zipPath)
                            }
                            else {
                                print("删除文件 \(zipPath) 不存在")
                            }
                            var defaultsDic = NSUserDefaults.standardUserDefaults().valueForKey("LocalResources") as? [String: String] ?? ["": ""]
                            defaultsDic[key] = value
                            NSUserDefaults.standardUserDefaults().setObject(defaultsDic, forKey: "LocalResources")
                            completion?(success: true, msg: "")
                        }
                        else {
                            completion?(success: false, msg: "解压失败 \(zipPath)")
                        }
                    }
                    else {
                        completion?(success: false, msg: "写入失败 \(zipPath)")
                    }
                }
                catch let error as NSError{
                    completion?(success: false, msg: error.localizedDescription)
                }
            }
            else {
                completion?(success: false, msg: "更新包 为空")
            }
        })
    }

}
