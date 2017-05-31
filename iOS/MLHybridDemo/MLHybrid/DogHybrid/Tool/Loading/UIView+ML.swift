//
//  UIView+ML.swift
//  MedLinker
//
//  Created by 陈成 on 15/11/27.
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import Foundation

private let kTag = 199998
let kLoadingWH: CGFloat = 40

extension UIView {
    
    func beginAnimating(animatingY: CGFloat = 0) {
        
        if viewWithTag(kTag) != nil {
            return
        }
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIView.cilicBackgroud))
        
        let backgroud = UIView(frame: UIScreen.main.bounds)
        backgroud.tag = kTag
        backgroud.backgroundColor = UIColor.white
        backgroud.addGestureRecognizer(tap)
        self.addSubview(backgroud)
        
        let imvBgWH: CGFloat = 40
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        
        let image = UIImage(named: "loadding_ellipse1")
        imvBg.frame = CGRect(x: UIScreen.main.bounds.size.width/2 - imvBgWH*0.5, y: self.center.y - imvBgWH*0.5 + otherY - 64, width: imvBgWH, height: imvBgWH)
        imvBg.backgroundColor = UIColor.white
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.scaleAspectFit
        imv.frame = CGRect(x: imvBgWH * 0.5 - (image?.size.width)! * 0.5, y: imvBgWH * 0.5 - (image?.size.height)! * 0.5, width: (image?.size.width)!, height: (image?.size.height)!)
        
        var idleImages = [UIImage]()
        for i in 1...48 {
            if let image = UIImage(named: "new_refresh_loading_\(i)") {
                idleImages.append(image)
            }
        }
        
        imv.animationImages = idleImages
        imv.animationDuration = 1.2
        imv.animationRepeatCount = 0
        imv.startAnimating()
        
        imvBg.addSubview(imv)
    }
    
    func beginLoveEggAnimating(animatingY: CGFloat = 0) {
        
        if viewWithTag(kTag) != nil {
            return
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIView.cilicBackgroud))
        
        let backgroud = UIView(frame:self.frame)
        backgroud.tag = kTag
        backgroud.backgroundColor = UIColor.white
        //        backgroud.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0)
        backgroud.addGestureRecognizer(tap)
        self.addSubview(backgroud)
        
        let imvBgWH: CGFloat = kLoadingWH
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        let image = UIImage(named: "loadding_ellipse1")
        imvBg.frame = CGRect(x: self.center.x - imvBgWH*0.5, y: self.center.y - imvBgWH*0.5 + otherY - 64, width: imvBgWH, height: imvBgWH)
        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0)
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.scaleAspectFit
        imv.frame = imvBg.bounds
        
        imvBg.addSubview(imv)
        
        
        var idleImages = [UIImage]()
        for i in 1...48 {
            if let image = UIImage(named: "new_refresh_loading_\(i)") {
                idleImages.append(image)
            }
        }
        
        imv.animationImages = idleImages
        imv.animationDuration = 1.2
        imv.animationRepeatCount = 0
        imv.startAnimating()
    }
    
    func animationY(y: CGFloat) {
        let imvBg = _getImvBg()
        imvBg.frame = CGRect(x: imvBg.frame.origin.x, y: y, width: kLoadingWH, height: kLoadingWH)
    }
    
    func animationPoint(point: CGPoint) {
        let imvBg = _getImvBg()
        imvBg.frame = CGRect(x: point.x, y: point.y, width: kLoadingWH, height: kLoadingWH)
    }
    
    func endAnimating() {
        self.viewWithTag(kTag)?.removeFromSuperview()
    }
    
    private func _getImvBg() ->UIView {
        for view in (self.viewWithTag(kTag)?.subviews)! {
            if !(view is UIImageView) {
                return view
            }
        }
        return UIView()
    }
    
    func cilicBackgroud() {
    }
}
