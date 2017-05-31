//
//  MLPay.swift
//  MedLinker
//
//  Created by cy on 16/4/27.
//  Copyright © 2016年 MedLinker. All rights reserved.
//

var kPayBaseUrl = "https://pay.medlinker.com/"

class MLPay: NSObject {
    //单例对象
    static let sharedInstance = MLPay()
    //阻止其他对象使用这个类的默认的'()'初始化方法
    fileprivate override init() {}
    var finishBlock: ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())?
    var currentController: UIViewController?

    let payForWechat: MLPayForWechat = MLPayForWechat()
    let payForAlipay: MLPayForAlipay = MLPayForAlipay()
    
    //客户端通过url调起钱包
    class func wallet(_ payUrl: String, currentController: UIViewController, finishBlock: @escaping ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())) {
        self.sharedInstance.finishBlock = finishBlock
        self.sharedInstance.currentController = currentController
        if let vc = MLHybridViewController.load(urlString: payUrl) {
            currentController.navigationController?.pushViewController(vc, animated: true)
        }
    }

    ///H5钱包调起支付宝支付
    func alipay(_ orderString: String, finishBlock: @escaping ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())) {
        self.payForAlipay.payWithOrderString(orderString, finishBlock: { (success: Bool, errorMsg: String, resultCode: String) in
            finishBlock(success, errorMsg, resultCode)
        })
    }
    
    ///H5钱包调起微信支付
    func weChat(_ orderDic:[AnyHashable: Any], finishBlock: @escaping ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())) {
        self.payForWechat.payWithOrderString(orderDic) { (success, errorMsg, resultCode) in
            finishBlock(success, errorMsg, resultCode)
        }
    }

}
