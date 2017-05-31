//
//  HybridNaviTitleView.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/13.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class HybridNaviTitleView: UIView {

    let titleLabel = UILabel()
    let subtitleLabel = UILabel()
    let lefticon = UIImageView()
    let righticon = UIImageView()
    let callBackButton = UIButton()
    
    func loadTitleView(_ title: String, subtitle: String, lefticonUrl: URL, righticonUrl: URL, callback: String, currentWebView: UIWebView) {
        //标题
        self.titleLabel.text = title
        self.titleLabel.font = UIFont.systemFont(ofSize: 17)
//        self.titleLabel.textColor = MLTheme.color.black
        let titleWidth = title.hybridStringWidthWith(17, height: 22)
        self.titleLabel.frame = CGRect(x: 0, y: 0, width: titleWidth, height: 22)
        self.titleLabel.center = self.center
        self.titleLabel.textAlignment = .center
        self.addSubview(self.titleLabel)
        
        //副标题
        if subtitle.characters.count > 0 {
            self.subtitleLabel.text = subtitle
            self.subtitleLabel.font = UIFont.systemFont(ofSize: 13)
//            self.subtitleLabel.textColor = MLTheme.color.black
            let subtitleWidth = subtitle.hybridStringWidthWith(13, height: 15)
            self.subtitleLabel.frame = CGRect(x: 0, y: 0, width: subtitleWidth, height: 22)
            self.subtitleLabel.center = self.center
            self.subtitleLabel.center.y = self.center.y + 10
            self.titleLabel.center.y = self.center.y - 10
            self.subtitleLabel.textAlignment = .center
            self.addSubview(self.subtitleLabel)
        }

        //右图标
        self.righticon.frame = CGRect(x: self.titleLabel.frame.origin.x + self.titleLabel.frame.size.width + 5, y: 0, width: 15, height: 15)
        if righticonUrl.absoluteString.characters.count > 0 {
            self.righticon.setZYHWebImage(righticonUrl.absoluteString as NSString?, defaultImage: "", isCache: true)
        }
//        self.righticon.setImageWithURL(righticonUrl)
        self.righticon.center.y = self.center.y
        self.addSubview(self.righticon)
        
        //左图标
        self.lefticon.frame = CGRect(x: self.titleLabel.frame.origin.x - 20, y: 0, width: 15, height: 15)
        if lefticonUrl.absoluteString.characters.count > 0 {
            self.lefticon.setZYHWebImage(lefticonUrl.absoluteString as NSString?, defaultImage: "", isCache: true)
        }
//        self.lefticon.setImageWithURL(lefticonUrl)
        self.lefticon.center.y = self.center.y
        self.addSubview(self.lefticon)

        //事件按钮
        self.callBackButton.frame = self.frame
        self.callBackButton.backgroundColor = UIColor.clear

//        self.callBackButton.addBlock(for: .touchUpInside) { (sender) in
//            let data = ["data": "",
//                        "errno": 0,
//                        "msg": "title click",
//                        "callback": callback] as [String : Any]
//            
//            let dataString = data.hybridJSONString()
//            currentWebView.stringByEvaluatingJavaScript(from: HybridEvent + "(\(dataString));")
//        }
        self.addSubview(self.callBackButton)
    }
    
}
