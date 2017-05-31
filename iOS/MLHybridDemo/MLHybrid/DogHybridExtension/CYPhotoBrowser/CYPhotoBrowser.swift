//
//  CYPhotoBrowser.swift
//  Surgery
//
//  Created by caiyang on 2016/11/30.
//  Copyright © 2016年 Apple. All rights reserved.
//

import UIKit

class CYPhotoBrowser: UIViewController {
    @IBOutlet weak var indicatorLabel: UILabel!
    var pageViewController: UIPageViewController?
    var imgs: [String] = []
    var index: Int = 0
    
    @IBAction func downloadClick(_ sender: Any) {
        if let vc = self.pageViewController?.viewControllers?.first as? CYPhotoDetailController {
            if let savedImage = vc.imageView.image {
                self.saveImage(image: savedImage)
            }
        }
    }
    class func instance(index: Int, imgs: [String]) -> CYPhotoBrowser {
        let storyboard = UIStoryboard(name: "CYPhotoBrowser", bundle: nil)
        let vc = storyboard.instantiateViewController(withIdentifier: "CYPhotoBrowser") as! CYPhotoBrowser
        vc.index = index
        var i = 0
        for imgString in imgs {
            vc.imgs.append(imgString + "*index\(i)")
            i  = i + 1
        }
        return vc
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.initPageViewController()
        self.setIndicator(index: index)
    }

    func setIndicator(index : Int) {
        if imgs.count == 0 { return }
        self.indicatorLabel.text = "\(index + 1)/\(imgs.count)"
    }
    
    func initPageViewController() {
        self.pageViewController = UIPageViewController(transitionStyle: .scroll, navigationOrientation: .horizontal, options: [UIPageViewControllerOptionInterPageSpacingKey: 40])
        self.pageViewController!.delegate = self
        let startingViewController = CYPhotoDetailController.instance()
        startingViewController.imageUrlString = self.imgs[self.index]
        let viewControllers = [startingViewController]
        self.pageViewController!.setViewControllers(viewControllers, direction: .forward, animated: false, completion: {done in })
        self.pageViewController!.dataSource = self
        self.addChildViewController(self.pageViewController!)
        self.view.insertSubview(self.pageViewController!.view, at: 0)
        let pageViewRect = self.view.bounds
        self.pageViewController!.view.frame = pageViewRect
        self.pageViewController!.view.backgroundColor = UIColor.black
        self.pageViewController!.didMove(toParentViewController: self)
    }

}

extension CYPhotoBrowser: UIPageViewControllerDelegate, UIPageViewControllerDataSource {
    
    func indexOfViewController(viewController: CYPhotoDetailController) -> Int {
        if let imgUrl = viewController.imageUrlString, let imgIndex = self.imgs.index(of: imgUrl) {
            return imgIndex
        }
        else {
            return NSNotFound
        }
    }
    
    func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController) -> UIViewController? {
        self.index = self.indexOfViewController(viewController: viewController as! CYPhotoDetailController)
        if (self.index == self.imgs.count - 1) {
            return nil
        }
        self.index = self.index + 1
        let vc = CYPhotoDetailController.instance()
        vc.imageUrlString = self.imgs[self.index]
        return vc
    }
    
    func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController) -> UIViewController? {
        self.index = self.indexOfViewController(viewController: viewController as! CYPhotoDetailController)
        if (self.index == 0) {
            return nil
        }
        self.index = self.index - 1
        let vc = CYPhotoDetailController.instance()
        vc.imageUrlString = self.imgs[self.index]
        return vc
    }

    func pageViewController(_ pageViewController: UIPageViewController, willTransitionTo pendingViewControllers: [UIViewController]) {
        
    }

    func pageViewController(_ pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {
        if finished {
            if let vc = self.pageViewController?.viewControllers?.first as? CYPhotoDetailController {
                let index = imgs.index(of: vc.imageUrlString!)
                self.setIndicator(index: index!)
            }
        }
    }
    
    func saveImage(image: UIImage) {
        UIImageWriteToSavedPhotosAlbum(image, self, #selector(CYPhotoBrowser.image(image:didFinishSavingWithError:contextInfo:)), nil)

    }
    
    func image(image: UIImage, didFinishSavingWithError error: NSError?, contextInfo:UnsafeRawPointer){
            if let ee = error as NSError? {
                print(ee)
            } else {
                UIAlertView(title:nil, message: "图片已保存", delegate: nil, cancelButtonTitle: "确定").show()
            }
    }
    
}



