//
//  WeChatManager.swift
//  MedLinker
//
//  Created by 陈成 on 15/11/9.
//  Copyright © 2015年 MedLinker. All rights reserved.
//  微信Wrapper


import UIKit

let appKey = "wxcabf351984e9c178"
let appSecret = "2ce05046e24749b3aa8d4f441e8ddd96"


@objc protocol WeChatManagerDelegate: NSObjectProtocol {
    func onRespWeChat(_ weChatWrapper: WeChatManager, successed: Bool, description: String?)
}

class WeChatManager: NSObject {

    fileprivate static var _defaultManager: WeChatManager?
    static var defaultManager: WeChatManager? {
        if _defaultManager == nil {
            _defaultManager = WeChatManager()
        }
        return _defaultManager
    }

    weak var delegate: WeChatManagerDelegate?

    override init() {
        super.init()
        WXApi.registerApp(appKey)
    }

    func isInstalled () ->Bool {
        if !WXApi.isWXAppInstalled() {
            return false
        }
        if !WXApi.isWXAppSupport() {
            return false
        }
        return true
    }

    func handleOpenURL(_ URL: Foundation.URL) ->Bool {
        return WXApi.handleOpen(URL, delegate: self)
    }
}

extension WeChatManager: WXApiDelegate {

    func onResp(_ resp: BaseResp!) {

        if let payResponse = (resp as? PayResp) { //处理支付
            WeChatPayManager.handlePay(payResponse)
        } else {
            self.delegate?.onRespWeChat(self, successed: (resp.errCode == 0), description: resp.errStr)
        }
    }

}



