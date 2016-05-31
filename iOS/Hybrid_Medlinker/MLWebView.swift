
//
//  MLWebView.swift
//  MedLinker
//
//  Created by 蔡杨
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import UIKit
import CoreMotion

class MLWebView: UIView {
    let USER_AGENT_HEADER = "hybrid_"
    /**************************************************/
    //MARK: - property
    var context = JSContext()

    var requestNative: (@convention(block) String -> Bool)?
    
    var myWebView = UIWebView()
    var urlStr = "" {
        didSet {
            urlStr = MLTools().decodeUrl(urlStr)
            self.loadUrl()
        }
    }
//    weak var delegate: UIViewController? = UIApplication.sharedApplication().keyWindow?.rootViewController

    var errorDataView: UIView?
    var motionManager: CMMotionManager = CMMotionManager()
    
    /**************************************************/
    //MARK: - life cycle
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.initUI()
        self.configUserAgent()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func initUI () {
        self.myWebView.frame = CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height)
        self.myWebView.backgroundColor = UIColor.whiteColor()
        
        self.myWebView.delegate = self
        self.addSubview(self.myWebView)
    }
    
    func loadUrl () {
        if let url = NSURL(string: self.urlStr) {
            let urlReq = NSURLRequest(URL: url)
            self.myWebView.loadRequest(urlReq)
        }
    }
    
    //设置userAgent
    func configUserAgent () {
        var userAgentStr: String = UIWebView().stringByEvaluatingJavaScriptFromString("navigator.userAgent") ?? ""
        if (userAgentStr.rangeOfString(USER_AGENT_HEADER) == nil) {
            let versionStr = NSBundle.mainBundle().infoDictionary!["CFBundleShortVersionString"]
            userAgentStr.appendContentsOf(" \(USER_AGENT_HEADER)\(versionStr!) ")
            NSUserDefaults.standardUserDefaults().registerDefaults(["UserAgent" : userAgentStr])
        }
    }

    /**************************************************/
    //MARK: -  public
    
    func loadRequest(request: NSURLRequest) {
        self.myWebView.loadRequest(request)
    }
    
    func loadHTMLString(str: String, baseURL: NSURL?) {
        self.myWebView.loadHTMLString(str, baseURL: baseURL)
    }
    
    func stopLoading() {
        self.myWebView.stopLoading()
    }

}

extension MLWebView: UIWebViewDelegate {
    
    func webViewDidStartLoad(webView: UIWebView) {
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            vc.startLoveEggAnimating()
        }
    }
    
    func webViewDidFinishLoad(webView: UIWebView) {
        if let vc = UIApplication.sharedApplication().keyWindow?.rootViewController {
            vc.stopAnimating()
        }

        //        self.requestNative = { input in
        //            let args = MLWebView().decodeJsonStr(input)
        //            if let tagname = args["tagname"] as? String {
        //                let callBackId = args["callback"] as? String ?? ""
        //                if let param = args["param"] as? [String: AnyObject] {
        //                    self.handleEvent(tagname, args: param, callbackID: callBackId)
        //                }
        //                else {
        //                    self.handleEvent(tagname, args: ["":""], callbackID: callBackId)
        //                }
        //                return true
        //            }
        //            else {
        //                print("tagname 空了哟")
        //                let alert = UIAlertView(title: "提示", message: "tagname 空了哟", delegate: nil, cancelButtonTitle: "cancel")
        //                alert.show()
        //                return false
        //            }
        //        }

//        self.context = webView.valueForKeyPath("documentView.webView.mainFrame.javaScriptContext") as? JSContext
//        self.context.exceptionHandler = { context, exception in
//            let alert = UIAlertView(title: "JS Error", message: exception.description, delegate: nil, cancelButtonTitle: "ok")
//            alert.show()
//            print("JS Error: \(exception)")
//        }
//        self.context.setObject(unsafeBitCast(self.requestNative, AnyObject.self), forKeyedSubscript: "HybridRequestNative")
//        self.myWebView.stringByEvaluatingJavaScriptFromString("Hybrid.ready();")
    }
    
    func webView(webView: UIWebView, didFailLoadWithError error: NSError?) {

    }
    
    func webView(webView: UIWebView, shouldStartLoadWithRequest request: NSURLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        MLTools().analysisUrl(request.URL?.absoluteString, webView: webView)
        return true
    }
    
}
