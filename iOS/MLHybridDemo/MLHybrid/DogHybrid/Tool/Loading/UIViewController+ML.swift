//
//  UIViewController+ML.swift
//  MedLinker
//
//  Created by 陈成 on 15/11/27.
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import Foundation

private let kTag = 199998

extension UIViewController {
    /**
     转菊花
     
     - parameter animatingY: 偏移量
     - parameter superView:  父view
     */
    public func startAnimating(animatingY: CGFloat = 0,superView: UIView? = nil) {
        
        if self.view.viewWithTag(kTag) != nil || superView?.viewWithTag(kTag) != nil  {
            return
        }
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(cilicBackgroud)) // 用于拦截点击
        
        let backgroud = UIView(frame: UIScreen.main.bounds)
        backgroud.tag = kTag
        backgroud.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0)
        backgroud.addGestureRecognizer(tap)
        
        if superView == nil {
            self.view.addSubview(backgroud)
        } else {
            superView?.addSubview(backgroud)
        }
        
        let imvBgWH: CGFloat = 40
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        
        let image = UIImage(named: "new_refresh_loading_1")
        imvBg.frame = CGRect(x: (UIScreen.main.bounds.width - imvBgWH) * 0.5, y: self.view.center.y - imvBgWH*0.5 + otherY - 64, width: imvBgWH, height: imvBgWH)
//        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.4)
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
        
        //        let rotationAnimation = CABasicAnimation(keyPath: "transform.rotation.z")
        //        rotationAnimation.toValue = M_PI * 2.0
        //        rotationAnimation.duration = 1.5
        //        rotationAnimation.repeatCount = .infinity
        //        imv.layer.addAnimation(rotationAnimation, forKey: "rotate-layer")
        
        imvBg.addSubview(imv)
    }
    /**
     跳蛋
     
     - parameter animatingY: 偏移量
     */
    public func startLoveEggAnimating(animatingY: CGFloat = 0) {
        
        if self.view.viewWithTag(kTag) != nil {
            return
        }
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(cilicBackgroud)) // 用于拦截点击
        
        let backgroud = UIView(frame: UIScreen.main.bounds)
        backgroud.tag = kTag
        backgroud.backgroundColor = UIColor.white
        backgroud.addGestureRecognizer(tap)
        self.view.addSubview(backgroud)
        
        let imvBgWH: CGFloat = kLoadingWH
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        
        let image = UIImage(named: "new_refresh_loading_1")
        imvBg.frame = CGRect(x: (backgroud.bounds.width - imvBgWH) * 0.5, y: (backgroud.bounds.height - imvBgWH) * 0.5 + otherY - 64, width: imvBgWH, height: imvBgWH)
        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0)
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        //        imvBg.backgroundColor = UIColor.redColor()
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.scaleAspectFit
        //        imv.frame = CGRectMake(imvBgWH * 0.5 - (image?.size.width)! * 0.5, imvBgWH * 0.5 , (image?.size.width)!, (image?.size.height)!)
        imv.frame = imvBg.bounds
        
        //        let image2 = UIImage(named: "loadding_ellipse2")
        //        let imv2 = UIImageView(image:image2)
        //        imv2.frame = CGRectMake(imvBgWH * 0.5 - (image2?.size.width)! * 0.5, imvBgWH - (image2?.size.height)! - 28, (image2?.size.width)!, (image2?.size.height)!)
        
        imvBg.addSubview(imv)
        //        imvBg.addSubview(imv2)
        
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
        
        //        var endCenter = imv.center
        //        endCenter.y -= 50
        //        let transform = CGAffineTransformScale(CGAffineTransformIdentity, 0.5, 0.5)
        //        UIView.animateWithDuration(0.33, delay: 0, options: [.Repeat, .Autoreverse], animations: { () -> Void in
        //            imv.center = endCenter
        //            imv2.transform = transform
        //            }, completion: nil)
    }
    
    
    public func stopAnimating(superView: UIView? = nil) {
        
        if superView == nil {
            if let view = self.view.viewWithTag(kTag) {
                view.removeFromSuperview()
            }
        } else {
            if let view = superView?.viewWithTag(kTag) {
                view.removeFromSuperview()
            }
        }
    }
    
    public func cilicBackgroud() { }
}
