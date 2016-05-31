//
//  ViewController.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/12.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var hybirdUrlTextField: UITextField!
    @IBAction func buttonClick(sender: AnyObject) {

        MLTools().analysisUrl(self.hybirdUrlTextField.text)
//        let web = MLWebViewController()
//        web.hidesBottomBarWhenPushed = true
//        web.URLPath = "http://kuai.baidu.com/webapp/demo/index.html"
//        self.navigationController?.pushViewController(web, animated: true)
    }

    @IBAction func localPageClick(sender: AnyObject) {
        self.hybirdUrlTextField.text = "hybrid://forward?param=%7B%22topage%22%3A%22index2%22%2C%22type%22%3A%22native%22%2C%22navigateion%22%3A%22none%22%7D"
    }
    override func viewDidAppear(animated: Bool) {
        self.hybirdUrlTextField.text = "hybrid://forward?param=%7B%22topage%22%3A%22http%3A%2F%2Fkuai.baidu.com%2Fwebapp%2Fdemo%2Findex.html%22%2C%22type%22%3A%22h5%22%7D"

        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }
    
}

