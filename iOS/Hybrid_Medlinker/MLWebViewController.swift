//
//  MLWebViewController.swift
//  MedLinker
//
//  Created by 蔡杨
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import UIKit

enum AnimateType {
    case Normal
    case Push
    case Pop
}

class MLWebViewController: UIViewController {

    var URLPath: String?
    var HTMLString: String?
    var originNaviHidden: Bool?
    var originTabBarHidden: Bool?
    var viewInitY: CGFloat = 0
    var localUrl: String = ""

    private var percentDrivenTransition: UIPercentDrivenInteractiveTransition?
    var webView: MLWebView!
    var animateType: AnimateType = .Normal

    /**************************************************/
    //MARK: - life cycle
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.hidesBottomBarWhenPushed = true
        NSURLCache.sharedURLCache().removeAllCachedResponses()

        
        self.webView = MLWebView(frame: CGRectMake(0, viewInitY, self.view.bounds.size.width, self.view.bounds.height - viewInitY))
        self.webView.autoresizingMask = [ .FlexibleHeight, .FlexibleWidth ]
//        self.webView.delegate = self

        self.navigationController?.delegate = self
        //手势监听器
        let edgePan = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(MLWebViewController.edgePanGesture(_:)))
        edgePan.edges = UIRectEdge.Left
        self.view.addGestureRecognizer(edgePan)

        self.view.addSubview(self.webView)
        
        if let path = self.URLPath {
            
            if let request = self.getRequestFromUrl(path) {
                self.webView.loadRequest(request)
            }
        } else if let string = self.HTMLString {
            self.webView.loadHTMLString(string, baseURL: nil)
        }
        else {
            if let htmlPath = NSBundle.mainBundle().pathForResource(self.localUrl, ofType: "html") {
                let url = NSURL(fileURLWithPath: htmlPath)
                let request = NSURLRequest(URL: url)
                self.webView.loadRequest(request)
            }
            else {
                print("未找到本地html文件")
            }
        }
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        
        self.originNaviHidden = self.navigationController?.navigationBar.hidden
        self.originTabBarHidden = self.tabBarController?.tabBar.hidden
        self.navigationController?.navigationBar.hidden = false
        self.tabBarController?.tabBar.hidden = true
        
        //加入删除之前页面的逻辑 最多保留3个 MLWebViewController
        self.deleteViewController()
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)
        
        if let naviHide = originNaviHidden {
            self.navigationController?.navigationBar.hidden = naviHide
        }
        
        if let tabBarHide = originTabBarHidden {
            self.tabBarController?.tabBar.hidden = tabBarHide
        }
        
        self.webView.stopLoading()
    }
    
    private func getRequestFromUrl(url: String) -> NSURLRequest? {
        let mutUrl = NSMutableString(string: url)
        if let uRL = NSURL(string: String(mutUrl)) {
            let request = NSMutableURLRequest(URL: uRL)
            return request
        }
        return nil
    }
    
    func deleteViewController() {
        
        var webViewControllers: [UIViewController] = []
        if let viewControllers = self.navigationController?.viewControllers {
            for vc in viewControllers {
                if vc is MLWebViewController {
                    webViewControllers.append(vc)
                }
            }
            if webViewControllers.count > 3 {
                self.navigationController?.viewControllers.removeAtIndex((self.navigationController?.viewControllers.indexOf(webViewControllers.first!))!)
            }
        }
    }
    
}

extension MLWebViewController: UINavigationControllerDelegate {
    
    func edgePanGesture(edgePan: UIScreenEdgePanGestureRecognizer) {
        let progress = edgePan.translationInView(self.view).x / self.view.bounds.width
        if edgePan.state == UIGestureRecognizerState.Began {
            self.percentDrivenTransition = UIPercentDrivenInteractiveTransition()
            self.navigationController?.popViewControllerAnimated(true)
        } else if edgePan.state == UIGestureRecognizerState.Changed {
            self.percentDrivenTransition?.updateInteractiveTransition(progress)
        } else if edgePan.state == UIGestureRecognizerState.Cancelled || edgePan.state == UIGestureRecognizerState.Ended {
            if progress > 0.5 {
                self.percentDrivenTransition?.finishInteractiveTransition()
            } else {
                self.percentDrivenTransition?.cancelInteractiveTransition()
            }
            self.percentDrivenTransition = nil
        }
    }

    func navigationController(navigationController: UINavigationController, animationControllerForOperation operation: UINavigationControllerOperation, fromViewController fromVC: UIViewController, toViewController toVC: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        if operation == UINavigationControllerOperation.Push {
            if self.animateType == .Pop {
                return HybirdTransionPush()
            }
            else {
                return nil
            }
        } else {
            return nil
        }
    }
    
    func navigationController(navigationController: UINavigationController, interactionControllerForAnimationController animationController: UIViewControllerAnimatedTransitioning) -> UIViewControllerInteractiveTransitioning? {
        if animationController is HybirdTransionPush {
            return self.percentDrivenTransition
        } else {
            return nil
        }
    }

}

