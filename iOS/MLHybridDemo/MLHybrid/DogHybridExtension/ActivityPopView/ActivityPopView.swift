//
//  MLUpdateAlert.swift
//  MedLinker
//
//  Created by caiyang on 2016/10/18.
//  Copyright © 2016年 MedLinker. All rights reserved.
//

import UIKit

class ActivityPopView: UIView {
    
    @IBOutlet weak var contentView: UIView!
    
    @IBOutlet weak var backgroundView: UIView!
    @IBOutlet weak var imageView: UIImageView!
    
    var callbackID: String?
    var popViewClick: (() -> ())?
    
    class func show(imgUrl: String?, callbackID: String, callback: @escaping () -> ()) {
        let activityPopView = Bundle.main.loadNibNamed("ActivityPopView", owner: self, options: nil)!.first as! ActivityPopView
        activityPopView.frame = UIScreen.main.bounds
        //todo
//        if let imageUrl = URL(string: imgUrl ?? "") {
//            activityPopView.imageView.setImageWith(imageUrl)
//        }
        activityPopView.popViewClick = callback
        activityPopView.callbackID = callbackID
        var window = UIApplication.shared.keyWindow
        if window?.windowLevel != UIWindowLevelNormal {
            let windows = UIApplication.shared.windows
            for tmpWin in windows {
                if tmpWin.windowLevel == UIWindowLevelNormal {
                    window = tmpWin
                    break
                }
            }
        }
        window?.addSubview(activityPopView)
        activityPopView.contentView.transform = CGAffineTransform(scaleX: 0.5, y: 0.5)
        activityPopView.backgroundView.alpha = 0
        UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.5, initialSpringVelocity: 1, options: UIViewAnimationOptions.curveEaseInOut, animations: { () -> Void in
            activityPopView.contentView.transform = CGAffineTransform(scaleX: 1, y: 1)
            activityPopView.backgroundView.alpha = 1
        }) { (bool) -> Void in
        }
    }
    
    @IBAction func close(_ sender: UIButton) {
        var tempView = sender.superview
        while !(tempView is ActivityPopView) {
            tempView = tempView?.superview
        }
        UIView.animate(withDuration: 0.7, animations: {
            tempView?.alpha = 0
        }, completion: { (bool) in
            tempView?.removeFromSuperview()
        })
    }
    
    @IBAction func callBackAction(_ sender: UIButton) {
        var tempView = sender.superview
        while !(tempView is ActivityPopView) {
            tempView = tempView?.superview
        }
        UIView.animate(withDuration: 0.7, animations: {
            tempView?.alpha = 0
        }, completion: { (bool) in
            tempView?.removeFromSuperview()
        })
        if popViewClick != nil {
            self.popViewClick!()
        }
    }
    
}
