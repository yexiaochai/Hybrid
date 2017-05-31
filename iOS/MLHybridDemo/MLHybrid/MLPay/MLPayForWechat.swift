//
//  MLPayForWechat.swift
//  MedLinker
//
//  Created by cy on 16/4/27.
//  Copyright © 2016年 MedLinker. All rights reserved.
//


class MLPayForWechat: NSObject {
    
    var onRespBlock : ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())?

    func payWithOrderString(_ orderDic: [AnyHashable: Any],finishBlock: @escaping ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())) {

        if WeChatManager.defaultManager?.isInstalled() == true {
            let req = PayReq()
            let timeStampString = orderDic["timestamp"] as! NSNumber
            let timeStamp = timeStampString.uint32Value
            req.partnerId           = orderDic["partnerid"] as! String;
            req.prepayId            = orderDic["prepayid"] as! String;
            req.nonceStr            = orderDic["noncestr"] as! String;
            req.timeStamp           = timeStamp;
            req.package             = "Sign=WXPay";
            req.sign                = orderDic["sign"] as! String;
            WXApi.send(req)
            self.onRespBlock = finishBlock
            NotificationCenter.default.addObserver(self, selector: #selector(MLPayForWechat.success), name: NSNotification.Name(rawValue: "weChatPaySuccess"), object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(MLPayForWechat.fail), name: NSNotification.Name(rawValue: "weChatPayFail"), object: nil)
        }
        else {
            finishBlock(false, "未安装安装", "-5")
        }
    }
    
    func success() {
        if let finishBlock = self.onRespBlock {
            finishBlock(true, "", "0")
        }
    }

    func fail(_ notify: Notification) {
        if let finishBlock = self.onRespBlock {
            let error = (notify as NSNotification).userInfo?["errorMsg"] as? String
            let errorCode = (notify as NSNotification).userInfo?["code"] as? String

            if let errorSting = error, let code = errorCode {
                finishBlock(false, errorSting, code)
            }
            else {
                finishBlock(false, "", "-6")
            }
        }
    }

}
