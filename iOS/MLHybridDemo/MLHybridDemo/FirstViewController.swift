//
//  FirstViewController.swift
//  MLHybridDemo
//
//  Created by caiyang on 2017/5/31.
//  Copyright © 2017年 Nil. All rights reserved.
//

import UIKit

class FirstViewController: UIViewController {

    @IBAction func test(_ sender: Any) {

//        "hybrid://forward?param=%7B%22topage%22%3A%22index2%22%2C%22type%22%3A%22native%22%2C%22navigateion%22%3A%22none%22%7D"
//        "hybrid://forward?param=%7B%22topage%22%3A%22http%3A%2F%2Fkq.medlinker.com%2Fwebapp%2Fkq-desk%2Fadmorgs.html%22%2C%22type%22%3A%22h5%22%7D"
        
        let urlString = "http://yexiaochai.github.io/Hybrid/webapp/demo/index.html"
        
        if let vc = MLHybridViewController.load(urlString: urlString) {
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
    }

}

