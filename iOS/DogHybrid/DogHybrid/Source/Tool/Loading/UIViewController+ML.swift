//
//  UIViewController+ML.swift
//  MedLinker
//
//  Created by 陈成 on 15/11/27.
//  Copyright © 2015年 MedLinker. All rights reserved.
//
let kLoadingWH:CGFloat = 110

import Foundation

//extension UIViewController {
//    
//    func passSource
//    
//}

extension UIViewController {
    
    func circleDetailsStartLoveEggAnimating(animatingY: CGFloat = 0) {
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.cilicBackgroud))
        
        let backgroud = UIView(frame: UIScreen.mainScreen().bounds)
        backgroud.tag = 199998
//        backgroud.backgroundColor = UIColor.whiteColor()
                backgroud.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0)
        backgroud.addGestureRecognizer(tap)
        self.view.addSubview(backgroud)
        
        let imvBgWH: CGFloat = kLoadingWH
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        let image = UIImage(named: "loadding_ellipse1")
        imvBg.frame = CGRectMake(self.view.center.x - imvBgWH*0.5, self.view.center.y - imvBgWH*0.5 + otherY, imvBgWH, imvBgWH)
        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0)
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.ScaleAspectFit
        imv.frame = CGRectMake(imvBgWH * 0.5 - (image?.size.width)! * 0.5, imvBgWH * 0.5 , (image?.size.width)!, (image?.size.height)!)
        
        let image2 = UIImage(named: "loadding_ellipse2")
        let imv2 = UIImageView(image:image2)
        imv2.frame = CGRectMake(imvBgWH * 0.5 - (image2?.size.width)! * 0.5, imvBgWH - (image2?.size.height)! - 29, (image2?.size.width)!, (image2?.size.height)!)
        
        imvBg.addSubview(imv)
        imvBg.addSubview(imv2)

        var endCenter = imv.center
        endCenter.y -= 50
        let transform = CGAffineTransformScale(CGAffineTransformIdentity, 0.5, 0.5)
        UIView.animateWithDuration(0.33, delay: 0, options: UIViewAnimationOptions(rawValue: UIViewAnimationOptions.Repeat.rawValue | UIViewAnimationOptions.Autoreverse.rawValue ), animations: { () -> Void in
            imv.center = endCenter
            imv2.transform = transform
            }, completion: nil)
    }
    
    func startAnimating(animatingY: CGFloat = 0,superView: UIView? = nil) {
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.cilicBackgroud))
        
        let backgroud = UIView(frame: UIScreen.mainScreen().bounds)
        backgroud.tag = 199998
        backgroud.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0)
        backgroud.addGestureRecognizer(tap)
//        if isNews == true {
//            self.view.superview!.addSubview(backgroud)
//        } else {
//            self.view.addSubview(backgroud)
//        }
        if superView == nil {
            self.view.addSubview(backgroud)
        } else {
            superView?.addSubview(backgroud)
        }
        
        let imvBgWH: CGFloat = 50
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        
        let image = UIImage(named: "loading_up_white")
        imvBg.frame = CGRectMake(self.view.center.x - imvBgWH*0.5, self.view.center.y - imvBgWH*0.5 + otherY - 64, imvBgWH, imvBgWH)
        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.4)
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.ScaleAspectFit
        imv.frame = CGRectMake(imvBgWH * 0.5 - (image?.size.width)! * 0.5, imvBgWH * 0.5 - (image?.size.height)! * 0.5, (image?.size.width)!, (image?.size.height)!)
        
        let rotationAnimation = CABasicAnimation(keyPath: "transform.rotation.z")
        rotationAnimation.toValue = M_PI * 2.0
        rotationAnimation.duration = 1.5
        rotationAnimation.repeatCount = .infinity
        imv.layer.addAnimation(rotationAnimation, forKey: "rotate-layer")
        
        imvBg.addSubview(imv)
    }
    
    func startLoveEggAnimating(animatingY: CGFloat = 0) {
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.cilicBackgroud))
        
        let backgroud = UIView(frame: UIScreen.mainScreen().bounds)
        backgroud.tag = 199998
        backgroud.backgroundColor = UIColor.whiteColor()
        //        backgroud.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0)
        backgroud.addGestureRecognizer(tap)
        self.view.addSubview(backgroud)
        
        let imvBgWH: CGFloat = kLoadingWH
        let imvBg = UIView()
        let otherY: CGFloat = animatingY
        
        
        let image = UIImage(named: "loadding_ellipse1")
        imvBg.frame = CGRectMake(self.view.center.x - imvBgWH*0.5, self.view.center.y - imvBgWH*0.5 + otherY - 64, imvBgWH, imvBgWH)
        imvBg.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0)
        imvBg.layer.masksToBounds = true
        imvBg.layer.cornerRadius = 5
        backgroud.addSubview(imvBg)
        
        let imv = UIImageView(image:image)
        imv.contentMode = UIViewContentMode.ScaleAspectFit
        imv.frame = CGRectMake(imvBgWH * 0.5 - (image?.size.width)! * 0.5, imvBgWH * 0.5 , (image?.size.width)!, (image?.size.height)!)
        
        let image2 = UIImage(named: "loadding_ellipse2")
        let imv2 = UIImageView(image:image2)
        imv2.frame = CGRectMake(imvBgWH * 0.5 - (image2?.size.width)! * 0.5, imvBgWH - (image2?.size.height)! - 28, (image2?.size.width)!, (image2?.size.height)!)
        
        imvBg.addSubview(imv)
        imvBg.addSubview(imv2)
        
        var endCenter = imv.center
        endCenter.y -= 50
        let transform = CGAffineTransformScale(CGAffineTransformIdentity, 0.5, 0.5)
        UIView.animateWithDuration(0.33, delay: 0, options: [.Repeat, .Autoreverse], animations: { () -> Void in
            imv.center = endCenter
            imv2.transform = transform
            }, completion: nil)
    }
    
//    func animationY(y: CGFloat) {
//        let imvBg = _getImvBg()
//        imvBg.frame = CGRectMake(imvBg.frame.origin.x, y, kLoadingWH, kLoadingWH)
//    }
//    
//    func animationPoint(point: CGPoint) {
//        let imvBg = _getImvBg()
//        imvBg.frame = CGRectMake(point.x, point.y, kLoadingWH, kLoadingWH)
//    }
    
    func stopAnimating(superView: UIView? = nil) {
        
        if superView == nil {
            if let view = self.view.viewWithTag(199998) {
                view.removeFromSuperview()
            }
        } else {
            if let view = superView?.viewWithTag(199998) {
                view.removeFromSuperview()
            }
        }
//        if isNews == true {
//            self.view.superview!.viewWithTag(199998)?.removeFromSuperview()
//        } else {
//            if let view = self.view.viewWithTag(199998) {
//                view.removeFromSuperview()
//            }
////            self.view.viewWithTag(199998)?.removeFromSuperview()
//        }
    }
    
    private func _getImvBg() ->UIView {
        for view in (self.view.viewWithTag(199998)?.subviews)! {
            if view.isKindOfClass(UIImageView) == false {
                return view
            }
        }
        return UIView()
    }
    
    func cilicBackgroud() {
    }
}

//extension UIViewController {
//    @objc func ML_viewDidAppear(animated: Bool) {
//        self.shieldingUselessViewController()
//        if self.shieldingUselessViewController() == true {
//
//        }
//    }
//    
//    @objc func ML_viewDidDisappear(animated: Bool) {
//        if self.shieldingUselessViewController() == true {
//
//        }
//        self.ML_viewDidDisappear(true)
//    }
//    
//    private func shieldingUselessViewController() -> Bool {
//        if self.isKindOfClass(BannerViewController.classForCoder()) == false
//            && self.isKindOfClass(UINavigationController.classForCoder()) == false
//            && self.isKindOfClass(UIPageViewController.classForCoder()) == false
//            && self.isKindOfClass(BannerPageViewController.classForCoder()) == false
//            && self.isKindOfClass(TimelineViewController.classForCoder()) == false {
//            return true
//        } else {
//            return false
//        }
//    }
//}