
//
//  MLHybridWebView.swift
//  MedLinker
//
//  Created by 蔡杨
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import UIKit
import CoreMotion
import JavaScriptCore
import MJRefresh

class MLHybridContentView: UIWebView {
    
    var tool: MLHybridTools = MLHybridTools()

    let USER_AGENT_HEADER: String = MLHybridTools.readSetting()["userAgentHeader"] as! String
    
    var Cookie: String? {
        didSet {
            self.customerCookie()
        }
    }
    var htmlString: String?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.initUI()
        self.configUserAgent()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    func initUI () {
        self.backgroundColor = UIColor.white
        self.delegate = self
        self.scrollView.bounces = false
        self.translatesAutoresizingMaskIntoConstraints = false
        self.keyboardDisplayRequiresUserAction = false
        self.scalesPageToFit = true
    }
    
    //设置userAgent
    func configUserAgent () {
        var userAgentStr: String = UIWebView().stringByEvaluatingJavaScript(from: "navigator.userAgent") ?? ""
        if (userAgentStr.range(of: USER_AGENT_HEADER) == nil) {
            let versionStr = Bundle.main.infoDictionary!["CFBundleShortVersionString"]
            userAgentStr.append(" \(USER_AGENT_HEADER)\(versionStr!) ")
            UserDefaults.standard.register(defaults: ["UserAgent" : userAgentStr])
        }
    }

    //注入cookie
    func customerCookie() {
        let cookieDomian: String = MLHybridTools.readSetting()["cookieDomian"] as! String
        let platform: String = MLHybridTools.readSetting()["platform"] as! String
        if let sess = self.Cookie {
            var properties = [HTTPCookiePropertyKey: Any]()
            properties.updateValue(HTTPCookiePropertyKey(rawValue: sess), forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.value.rawValue))
            properties.updateValue(HTTPCookiePropertyKey(rawValue: "sess"), forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.name.rawValue))
            properties.updateValue(HTTPCookiePropertyKey(rawValue: cookieDomian) as AnyObject, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.domain.rawValue))
            properties.updateValue(Date(timeIntervalSinceNow: 60*60*3600) as AnyObject, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.expires.rawValue))
            properties.updateValue("/" as Any, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.path.rawValue))
            let cookie = HTTPCookie(properties: properties )
            HTTPCookieStorage.shared.setCookie(cookie!)
        }
        var properties = [HTTPCookiePropertyKey: Any]()
        properties.updateValue(HTTPCookiePropertyKey(rawValue: platform), forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.value.rawValue))
        properties.updateValue(HTTPCookiePropertyKey(rawValue: "platform"), forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.name.rawValue))
        properties.updateValue(HTTPCookiePropertyKey(rawValue: cookieDomian) as AnyObject, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.domain.rawValue))
        properties.updateValue(Date(timeIntervalSinceNow: 60*60*3600) as AnyObject, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.expires.rawValue))
        properties.updateValue("/" as Any, forKey: HTTPCookiePropertyKey(rawValue: HTTPCookiePropertyKey.path.rawValue))
        let cookie = HTTPCookie(properties: properties )
        HTTPCookieStorage.shared.setCookie(cookie!)
    }

}

extension MLHybridContentView: UIWebViewDelegate {
    
    func webViewDidFinishLoad(_ webView: UIWebView) {
        if self.scrollView.mj_header != nil {
            self.scrollView.mj_header?.endRefreshing()
        }
        if let title = webView.stringByEvaluatingJavaScript(from: "document.title"), title.characters.count > 0 {
            self.tool.viewControllerOf(webView).title = title
        }
        if let htmlString = self.htmlString {
            webView.stringByEvaluatingJavaScript(from: "document.body.innerHTML = document.body.innerHTML + '\(htmlString)'")
            self.htmlString = nil
        }
    }
    
    func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        if request.url!.absoluteString.hasPrefix("\(MLHYBRID_SCHEME)://") {
            self.tool.analysis(urlString: request.url?.absoluteString, webView: webView)
            return false
        }
        return true
    }
    
}




