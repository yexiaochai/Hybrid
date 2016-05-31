//
//  HybirdTransionPush.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/25.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class HybirdTransionPush: NSObject, UIViewControllerAnimatedTransitioning {
    func transitionDuration(transitionContext: UIViewControllerContextTransitioning?) -> NSTimeInterval {
        return 0.5
    }
    
    func animateTransition(transitionContext: UIViewControllerContextTransitioning) {
        //1.获取动画的源控制器和目标控制器
        let fromVC = transitionContext.viewControllerForKey(UITransitionContextFromViewControllerKey)!
        let toVC = transitionContext.viewControllerForKey(UITransitionContextToViewControllerKey)!
        let container = transitionContext.containerView()!

        
        var toViewRect = toVC.view.frame
        toViewRect.origin.x = -UIScreen.mainScreen().bounds.size.width/2
        toVC.view.frame = toViewRect

        container.addSubview(toVC.view)
        container.addSubview(fromVC.view)


        UIView.animateWithDuration(transitionDuration(transitionContext), delay: 0, options: UIViewAnimationOptions.CurveEaseInOut, animations: { () -> Void in
            toVC.view.frame = transitionContext.finalFrameForViewController(toVC)
            var rect = fromVC.view.frame
            rect.origin.x = UIScreen.mainScreen().bounds.size.width
            fromVC.view.frame = rect
        }) { (finish: Bool) -> Void in
            transitionContext.completeTransition(true)
        }
    }

}
