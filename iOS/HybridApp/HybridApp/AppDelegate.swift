//
//  AppDelegate.swift
//  HybridApp
//
//  Created by caiyang on 16/7/7.
//  Copyright © 2016年 Cy. All rights reserved.
//

import UIKit
import DogHybrid

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        NSURLProtocol.registerClass(DogHybridURLProtocol)
        return true
    }
    
    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
        if sourceApplication != "Cy.HybridApp" {
            MLHybridTools().analysisUrl(url.absoluteString)
        }
        return true
    }

}

