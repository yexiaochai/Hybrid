//
//  HybridTransionPush.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/25.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class HybridTransionPush: NSObject, UIViewControllerAnimatedTransitioning {
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 0.5
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        //1.获取动画的源控制器和目标控制器
        let fromVC = transitionContext.viewController(forKey: UITransitionContextViewControllerKey.from)!
        let toVC = transitionContext.viewController(forKey: UITransitionContextViewControllerKey.to)!
        let container = transitionContext.containerView

        
        var toViewRect = toVC.view.frame
        toViewRect.origin.x = -UIScreen.main.bounds.size.width/2
        toVC.view.frame = toViewRect

        container.addSubview(toVC.view)
        container.addSubview(fromVC.view)


        UIView.animate(withDuration: transitionDuration(using: transitionContext), delay: 0, options: UIViewAnimationOptions(), animations: { () -> Void in
            toVC.view.frame = transitionContext.finalFrame(for: toVC)
            var rect = fromVC.view.frame
            rect.origin.x = UIScreen.main.bounds.size.width
            fromVC.view.frame = rect
        }) { (finish: Bool) -> Void in
            transitionContext.completeTransition(true)
        }
    }

}
