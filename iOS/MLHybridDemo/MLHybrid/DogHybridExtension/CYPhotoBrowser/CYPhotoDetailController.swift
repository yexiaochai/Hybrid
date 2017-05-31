//
//  MLPhotoPageDetailController.swift
//  MedLinker
//
//  Created by cy on 16/3/29.
//  Copyright © 2016年 MedLinker. All rights reserved.
//

import UIKit
import AssetsLibrary

class CYPhotoDetailController: UIViewController, UIScrollViewDelegate {
    
    @IBAction func back(_ sender: Any) {
        self.dismiss(animated: true) {
        }
    }

    @IBOutlet weak var scrollView: UIScrollView!
    let imageView = UIImageView()
    var imageUrlString: String?
    
    private var frameView: UIView?

    class func instance() -> CYPhotoDetailController {
        let storyboard = UIStoryboard(name: "CYPhotoBrowser", bundle: nil)
        let viewController = storyboard.instantiateViewController(withIdentifier: "CYPhotoDetailController") as! CYPhotoDetailController
        return viewController
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.isNavigationBarHidden = true
        let frame = UIScreen.main.bounds
        self.imageView.frame = frame
        self.imageView.isUserInteractionEnabled = true
        self.imageView.contentMode = .scaleAspectFit
        self.imageView.backgroundColor = UIColor.black
        self.scrollView.addSubview(self.imageView)

        self.scrollView.maximumZoomScale = 2.5
        let xScale = frame.size.width/self.imageView.frame.size.width
        let yScale = frame.size.height/self.imageView.frame.size.height
        self.scrollView.minimumZoomScale = min(xScale, yScale)

        self.scrollView.minimumZoomScale = 1.0;
        self.scrollView.maximumZoomScale = 10.0;
        if let imageUrlString = imageUrlString {
            self.loadImageUrl(imgUrl: imageUrlString)
        }
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        self.scrollView.zoomScale = 1.0
    }
    
    func loadImageUrl(imgUrl: String?) {
//        if let imgUrl = imgUrl?.components(separatedBy: "*index")[0] {
//            if let url = URL(string: imgUrl) {
////                self.imageView.ml_setImage(url: url, placeholder: UIImage(named: "placeholder_big"))
//            }
//        }
    }

    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return self.imageView
    }
    
}
