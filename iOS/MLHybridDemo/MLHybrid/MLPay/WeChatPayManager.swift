//
//  WeChatPayManager.swift
//  MedLinker
//
//  Created by 王洋 on 16/7/6.
//  Copyright © 2016年 MedLinker. All rights reserved.
//

import UIKit

class WeChatPayManager: NSObject {

    static func handlePay(_ resp: PayResp) {

        switch resp.errCode {
        case 0:
            //支付成功
            NotificationCenter.default.post(name: Notification.Name(rawValue: "weChatPaySuccess"), object: nil, userInfo: ["errorMsg": "", "code": "\(resp.errCode)"])
            break
        default:
            //支付失败
            let errorMsg = resp.errStr
            if let errorString = errorMsg {
                NotificationCenter.default.post(name: Notification.Name(rawValue: "weChatPayFail"), object: nil, userInfo: ["errorMsg": errorString, "code": "\(resp.errCode)"])
            } else {
                NotificationCenter.default.post(name: Notification.Name(rawValue: "weChatPayFail"), object: nil, userInfo: ["errorMsg": "", "code": "\(resp.errCode)"])
            }
        }
    }
}
