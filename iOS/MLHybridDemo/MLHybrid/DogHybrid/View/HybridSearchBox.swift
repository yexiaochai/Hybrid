//
//  HybridSearchBox.swift
//  Surgery
//
//  Created by caiyang on 16/9/3.
//  Copyright © 2016年 Apple. All rights reserved.
//

import UIKit

class HybridSearchBox: UIView {
    
    func initSearchBox(_ navigationItem: UINavigationItem, titleModel: Hybrid_titleModel, currentWebView: UIWebView, right: [Hybrid_naviButtonModel]) {
        navigationItem.setHidesBackButton(true, animated: false)
        navigationItem.rightBarButtonItem?.customView?.isHidden = true

        let baseView = UIView(frame: CGRect(x: 5, y: 7, width: self.bounds.width - 10 - 40, height: 30))
        baseView.backgroundColor = UIColor.white
        baseView.layer.masksToBounds = true
        baseView.layer.cornerRadius = baseView.bounds.size.height/2
        self.addSubview(baseView)
        
        let searchImage = UIImageView(image: UIImage(named: "search-btn"))
        searchImage.frame = CGRect( x: 3, y: 0, width: baseView.bounds.size.height, height: 30)
        baseView.addSubview(searchImage)
        
        
        let searchTextField = UITextField(frame: CGRect( x: 35, y: 0, width: baseView.bounds.size.width - 35, height: baseView.bounds.size.height))
        searchTextField.clearButtonMode = .whileEditing
        searchTextField.tintColor = UIColor(red: 101/255.0, green: 141/255.0, blue: 254/255.0, alpha: 1.0)
        if titleModel.title.characters.count > 0 {
            searchTextField.text = titleModel.title
        }
        searchTextField.placeholder = titleModel.placeholder
        searchTextField.font = UIFont.systemFont(ofSize: 15)
//        searchTextField.textColor = UIColor(hexString: "848ca8")
        searchTextField.textColor = UIColor.gray

        baseView.addSubview(searchTextField)
        searchTextField.returnKeyType = .search
        
        if titleModel.focus {
            searchTextField.becomeFirstResponder()
        }
        
//        searchTextField.addBlock(for: .editingChanged) { (AnyObject) in
//            let data = ["type": "editingchanged",
//                        "data": searchTextField.text ?? ""]
//            let dataString = data.hybridJSONString()
//            _ = MLHybridTools().callBack(data: dataString, callback: titleModel.callback, webView: currentWebView)
//            print("EditingChanged")
//        }
//        
//        searchTextField.addBlock(for: .editingDidEndOnExit) { (AnyObject) in
//            let data = ["type": "editingdidend",
//                        "data": searchTextField.text ?? ""]
//            let dataString = data.hybridJSONString()
//            _ = MLHybridTools().callBack(data: dataString, callback: titleModel.callback, webView: currentWebView)
//            print("EditingDidEnd")
//        }
//        
//        searchTextField.addBlock(for: .editingDidBegin) { (AnyObject) in
//            let data = ["type": "editingdidbegin",
//                        "data": searchTextField.text ?? ""]
//            let dataString = data.hybridJSONString()
//            _ = MLHybridTools().callBack(data: dataString, callback: titleModel.callback, webView: currentWebView)
//            print("EditingDidBegin")
//        }
        
        let cancelBtn = UIButton(frame: CGRect(x: baseView.bounds.size.width + 5, y: 0, width: 40, height: 44))
        if right.count == 1 {
            cancelBtn.setTitle(right[0].value, for: .normal)
        }
        cancelBtn.titleLabel?.font = UIFont.systemFont(ofSize: 15)
        cancelBtn.titleLabel?.textColor = UIColor.white
        cancelBtn.contentHorizontalAlignment = .right
        self.addSubview(cancelBtn)
        
//        cancelBtn.addBlock(for: .touchUpInside, block: { (AnyObject) in
//            if right.count == 1 {
//                searchTextField.resignFirstResponder()
//                _ = MLHybridTools().callBack(callback: right[0].callback, webView: currentWebView)
//            }
//        })
    }

}

