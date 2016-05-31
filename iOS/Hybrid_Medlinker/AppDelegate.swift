//
//  AppDelegate.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/12.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        NSURLProtocol.registerClass(DogHybirdURLProtocol)
        return true
    }
    
    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
        
//        MLTools().anaslysisUrl(url.absoluteString)
        return true
    }

}

