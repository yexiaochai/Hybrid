//
//  WebTestViewController.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/12.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class WebTestViewController: UIViewController {
    
    class func instance() -> WebTestViewController {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let viewController = storyboard.instantiateViewControllerWithIdentifier("WebTestViewController") as! WebTestViewController
        return viewController
    }

    @IBAction func back(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
        self.dismissViewControllerAnimated(true, completion: nil)
    }
}
