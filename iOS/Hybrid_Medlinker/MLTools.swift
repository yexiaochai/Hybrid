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
    //    let BASE_URL = "http://medlinker.com/webapp/"
    let BASE_URL = "http://kuai.baidu.com/webapp/"
    let USER_AGENT_HEADER = "hybrid_"
    
    //事件类型
    let UpdateHeader = "updateheader"
    let Back = "back"
    let Forward = "forward"
    let Get = "get"
    let Post = "post"
    let ShowLoading = "showloading"
    let ShowHeader = "showheader"
    
    //Event前缀
    let HybirdEvent = "Hybrid.callback"
    
    //资源路径相关
    let NaviImageHeader = "hybird_navi_"
    let LocalResources = "DogHybirdResources/"

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
                print("   ")
                print("****************************************")
                print("funType    === \(funType)")
                print("args       === \(args)")
                print("callbackID === \(callbackID)")
                print("****************************************")
                print("   ")
        if funType == UpdateHeader {
            self.updateHeader(args, webView: webView)
        } else if funType == Back {
            self.back(args)
        } else if funType == Forward {
            self.forward(args)
        } else if funType == Get {
            self.hybirdGet(args, callbackID: callbackID, webView: webView)
        } else if funType == Post {
            self.hybirdPost(args, callbackID: callbackID, webView: webView)
        } else if funType == ShowLoading {
            self.showLoading(args, callbackID: callbackID)
        } else if funType == ShowHeader {
            self.setNavigationBarHidden(args, callbackID: callbackID)
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
        return webView.stringByEvaluatingJavaScriptFromString(self.HybirdEvent + "(\(dataString));") ?? ""
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

    
    ///////////
    func updateHeader(args: [String: AnyObject], webView: UIWebView) {
        if let header = Hybrid_headerModel.yy_modelWithJSON(args) {
            if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController, let titleModel = header.title, let rightButtons = header.right, let leftButtons = header.left {
                var navigationItem = vc.navigationItem
                if vc is UINavigationController {
                    let currentNavi = vc as! UINavigationController
                    navigationItem = currentNavi.viewControllers.last?.navigationItem ?? UINavigationItem()
                }
                navigationItem.titleView = self.setUpNaviTitleView(titleModel,webView: webView)
                navigationItem.setRightBarButtonItems(self.setUpNaviButtons(rightButtons,webView: webView), animated: true)
                navigationItem.setLeftBarButtonItems(self.setUpNaviButtons(leftButtons,webView: webView), animated: true)
            }
        }
    }
    
    func setUpNaviTitleView(titleModel:Hybrid_titleModel, webView: UIWebView) -> HybridNaviTitleView {
        let naviTitleView = HybridNaviTitleView()
        naviTitleView.frame = CGRectMake(0, 0, 150, 30)
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
            let buttonWidth = titleWidth > 30 ? titleWidth : 30
            button.frame = CGRectMake(0, 0, buttonWidth, 30)
            
            button.titleLabel?.font = UIFont.systemFontOfSize(14)
            button.setTitleColor(UIColor.blackColor(), forState: .Normal)
            
            if buttonModel.value.characters.count > 0 {
                button.setTitle(buttonModel.value, forState: .Normal)
            }
            if buttonModel.icon.characters.count > 0 {
                button.setImageForState(.Normal, withURL: NSURL(string: buttonModel.icon) ?? NSURL())
            }
            else if buttonModel.tagname.characters.count > 0 {
                button.setImage(UIImage(named: NaviImageHeader + buttonModel.tagname), forState: .Normal)
            }
            button.addBlockForControlEvents(.TouchUpInside, block: { (sender) in
                let backString = self.callBack("", errno: 0, msg: "成功", callback: buttonModel.callback,webView: webView)
                if buttonModel.tagname == "back" && backString == "" {
                    //假死 则执行本地的普通返回事件
                    self.back(["":""])
                }
            })
            let menuButton = UIBarButtonItem(customView: button)
            buttons.append(menuButton)
        }
        return buttons.reverse()
    }
    
    func back(args: [String: AnyObject]) {
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            var currentNavi = vc.navigationController ?? UINavigationController()
            if vc is UINavigationController {
                currentNavi = vc as! UINavigationController
            }
            if currentNavi.viewControllers.count > 1 {
                currentNavi.popViewControllerAnimated(true)
            }
            else {
                vc.dismissViewControllerAnimated(true, completion: nil)
            }
        }
    }
    
    func forward(args: [String: AnyObject] ) {
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            if  args["type"] as? String == "h5" {
                if let url = args["topage"] as? String {
                    let webViewController = MLWebViewController()
                    webViewController.hidesBottomBarWhenPushed = true
                    let localUrl = LocalResources + url.stringByReplacingOccurrencesOfString(".html", withString: "")
                    if let _ = NSBundle.mainBundle().pathForResource(localUrl, ofType: "html") {
                        //设置本地资源路径
                        webViewController.localUrl = localUrl
                    }
                    else {
                        webViewController.URLPath = url
                    }
                    if let animate = args["animate"] as? String where animate == "present" {
                        let navi = UINavigationController(rootViewController: webViewController)
                        vc.presentViewController(navi, animated: true, completion: nil)
                    }
                    else {
                        if let animate = args["animate"] as? String where animate == "pop" {
                            webViewController.animateType = .Pop
                        }
                        else {
                            webViewController.animateType = .Normal
                        }
                        if vc is UINavigationController {
                            
                            let currentNavi = vc as! UINavigationController
                            if let currentVC = currentNavi.viewControllers.last as? MLWebViewController {
                                currentVC.navigationController?.pushViewController(webViewController, animated: true)
                            }
                            else {
                                currentNavi.pushViewController(webViewController, animated: true)
                            }
                        }
                        else {
                            if let navi = vc.navigationController {
                                navi.pushViewController(webViewController, animated: true)
                            }
                            else {
                                let navi = UINavigationController(rootViewController: webViewController)
                                let viewController = UIApplication.sharedApplication().keyWindow?.rootViewController ?? UIViewController()
                                viewController.presentViewController(navi, animated: true, completion: nil)
                            }
                        }
                        
                    }
                }
            } else {
                //这里指定跳转到本地某页面   需要一个判断映射的方法
                if  args["topage"] as! String == "index2" {
                    let webTestViewController = WebTestViewController.instance()
                    if let animate =  args["animate"] as? String where animate == "present" {
                        let navi = UINavigationController(rootViewController: webTestViewController)
                        vc.presentViewController(navi, animated: true, completion: nil)
                    }
                    else {
                        if let animate =  args["navigateion"] as? String where animate == "none" {
                            vc.navigationController?.navigationBarHidden = true
                        }
                        else {
                            vc.navigationController?.navigationBarHidden = false
                        }
                        if let navi = vc.navigationController {
                            navi.pushViewController(webTestViewController, animated: true)
                        }
                        else {
                            let navi = UINavigationController(rootViewController: webTestViewController)
                            let viewController = UIApplication.sharedApplication().keyWindow?.rootViewController ?? UIViewController()
                            viewController.presentViewController(navi, animated: true, completion: nil)
                        }
                    }
                }
            }
        }
        else {
            print("UIApplication.sharedApplication().keyWindow?.rootViewController not found!")
        }
    }
    
    func showLoading(args: [String: AnyObject], callbackID: String) {
        dispatch_async(dispatch_get_main_queue()) {
            if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController  {
                if args["display"] as? Bool ?? true {
                    vc.startLoveEggAnimating()
                }
                else {
                    vc.stopAnimating()
                }
            }
        }
    }
    
    func setNavigationBarHidden(args: [String: AnyObject], callbackID: String) {
        let hidden: Bool = !(args["display"] as? Bool ?? true)
        let animated: Bool = args["animate"] as? Bool ?? true
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            vc.navigationController?.setNavigationBarHidden(hidden, animated: animated)
        }
    }

    
    func hybirdGet(args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let sessionManager = AFHTTPSessionManager(baseURL: nil)
        var parameters = args
        parameters.removeValueForKey("url")
        let url = args["url"] as? String ?? ""
        sessionManager.GET(url, parameters: parameters, progress: { (progress) in
            
            }, success: { (sessionDataTask, jsonObject) in
                if let callbackString = try? self.jsonStringWithObject(jsonObject!) {
                    self.callBack(callbackString, errno: 0, msg: "成功", callback: callbackID, webView: webView)
                }
            }, failure: { (sessionDataTask, error) in
                print("hybirdGet error == \(error)")
        })
    }
    
    func hybirdPost(args: [String: AnyObject], callbackID: String, webView: UIWebView) {
        let sessionManager = AFHTTPSessionManager(baseURL: nil)
        var parameters = args
        parameters.removeValueForKey("url")
        let url = args["url"] as? String ?? ""
        sessionManager.POST(url, parameters: parameters, progress: { (progress) in
            }, success: { (sessionDataTask, jsonObject) in
                if let callbackString = try? self.jsonStringWithObject(jsonObject!) {
                    self.callBack(callbackString, errno: 0, msg: "成功", callback: callbackID,webView: webView)
                }
            }, failure: { (sessionDataTask, error) in
                print("hybirdPost error == \(error)")
        })
    }

}
