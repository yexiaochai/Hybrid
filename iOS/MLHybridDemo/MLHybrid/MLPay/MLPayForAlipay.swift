//
//  MLPayForAlipay.swift
//  MedLinker
//
//  Created by cy on 16/4/27.
//  Copyright © 2016年 MedLinker. All rights reserved.
//


class MLPayForAlipay: NSObject {
    
    var onRespBlock : ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())?

    func payWithOrderString(_ orderString: String,finishBlock: @escaping ((_ success: Bool, _ errorMsg: String, _ resultCode: String) -> ())) {
        AlipaySDK.defaultService().payOrder(orderString, fromScheme: "mlmecrm") { (resultDic) in
            let errorString = resultDic?["memo"] as? String
            let resultStatus  = resultDic?["resultStatus"] as! String
            if resultStatus == "9000" {
                finishBlock(true,"", resultStatus);
            }
            else if let errorMsg = errorString{
                finishBlock(false,errorMsg, resultStatus);
            }
            else {
                finishBlock(false,"", resultStatus);
            }
        }
    }
    
}
