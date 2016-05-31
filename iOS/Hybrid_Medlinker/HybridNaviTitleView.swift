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

    func loadTitleView(title: String, subtitle: String, lefticonUrl: NSURL, righticonUrl: NSURL, callback: String, currentWebView: UIWebView) {
        //标题
        self.titleLabel.text = title
        self.titleLabel.font = UIFont.systemFontOfSize(17)
        self.titleLabel.textColor = UIColor.blackColor()
        let titleWidth = title.stringWidthWith(17, height: 22)
        self.titleLabel.frame = CGRectMake(0, 0, titleWidth, 22)
        self.titleLabel.center = self.center
        self.titleLabel.textAlignment = .Center
        self.addSubview(self.titleLabel)
        
        //副标题
        if subtitle.characters.count > 0 {
            self.subtitleLabel.text = title
            self.subtitleLabel.font = UIFont.systemFontOfSize(13)
            self.subtitleLabel.textColor = UIColor.blackColor()
            let subtitleWidth = subtitle.stringWidthWith(13, height: 15)
            self.subtitleLabel.frame = CGRectMake(0, 0, subtitleWidth, 22)
            self.subtitleLabel.center = self.center
            self.subtitleLabel.center.y = self.center.y + 10
            self.titleLabel.center.y = self.center.y - 10
            self.subtitleLabel.textAlignment = .Center
            self.addSubview(self.subtitleLabel)
        }

        //右图标
        self.righticon.frame = CGRectMake(self.titleLabel.frame.origin.x + self.titleLabel.frame.size.width + 5, 0, 15, 15)
        self.righticon.setImageWithURL(righticonUrl)
        self.righticon.center.y = self.center.y
        self.addSubview(self.righticon)
        
        //左图标
        self.lefticon.frame = CGRectMake(self.titleLabel.frame.origin.x - 20, 0, 15, 15)
        self.lefticon.setImageWithURL(lefticonUrl)
        self.lefticon.center.y = self.center.y
        self.addSubview(self.lefticon)

        //事件按钮
        self.callBackButton.frame = self.frame
        self.callBackButton.backgroundColor = UIColor.clearColor()

        self.callBackButton.addBlockForControlEvents(.TouchUpInside) { (sender) in
            let data = ["data": "",
                        "errno": 0,
                        "msg": "title click",
                        "callback": callback]
            
            let dataString = MLTools().toJSONString(data)
            currentWebView.stringByEvaluatingJavaScriptFromString(MLTools().HybirdEvent + "(\(dataString));")
        }
        self.addSubview(self.callBackButton)
    }
    
}
