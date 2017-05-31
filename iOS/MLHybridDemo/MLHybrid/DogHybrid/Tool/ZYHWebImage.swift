//
//  ZYHWebImage.swift
//  SwiftMovie
//
//  Created by apple on 15-6-24.
//  Copyright (c) 2015年 wutong. All rights reserved.
//

import Foundation
import UIKit

extension UIImageView {
    /**
    *设置web图片
    *url:图片路径
    *defaultImage:默认缺省图片
    *isCache：是否进行缓存的读取
    */
    func setZYHWebImage(_ url:NSString?, defaultImage:NSString?, isCache:Bool){
        var ZYHImage:UIImage?
        if url == nil {
            return
        }
        //设置默认图片
        if defaultImage != nil {
            self.image=UIImage(named: defaultImage! as String)
        }
        
        if isCache {
            let data:Data?=ZYHWebImageChcheCenter.readCacheFromUrl(url!)
            if data != nil {
                ZYHImage=UIImage(data: data!)
                self.image=ZYHImage
            }else
            {

              let dispath = DispatchQueue.global(qos:.userInitiated);
                dispath.async(execute: { () -> Void in
                    let URL:Foundation.URL = Foundation.URL(string: url! as String)!
                    let data:Data?=try? Data(contentsOf: URL)
                    if data != nil {
                        ZYHImage=UIImage(data: data!)
                        //写缓存
                        ZYHWebImageChcheCenter.writeCacheToUrl(url!, data: data!)
                        DispatchQueue.main.async(execute: { () -> Void in
                            //刷新主UI
                            self.image=ZYHImage
                        })
                    }
                    
                })
            }
        }else{
            let dispath = DispatchQueue.global(qos:.userInitiated);
            dispath.async(execute: { () -> Void in
                let URL:Foundation.URL = Foundation.URL(string: url! as String)!
                let data:Data?=try? Data(contentsOf: URL)
                if data != nil {
                    ZYHImage=UIImage(data: data!)
                    //写缓存
                    DispatchQueue.main.async(execute: { () -> Void in
                        //刷新主UI
                        self.image=ZYHImage
                    })
                }
                
            })
        }
    }
    
}

extension UIButton {
    /**
     *设置web图片
     *url:图片路径
     *defaultImage:默认缺省图片
     *isCache：是否进行缓存的读取
     */
    func setZYHWebImage(_ url:NSString?, defaultImage:NSString?, isCache:Bool){
        var ZYHImage:UIImage?
        if url == nil {
            return
        }
        //设置默认图片
        if defaultImage != nil {
            //                button.setImageForState(.normal, withURL: NSURL(string: buttonModel.icon) ?? NSURL())
            self.setImage(UIImage(named: defaultImage! as String), for: .normal)
//            self.image=UIImage(named: defaultImage! as String)
        }
        
        if isCache {
            let data:Data?=ZYHWebImageChcheCenter.readCacheFromUrl(url!)
            if data != nil {
                ZYHImage=UIImage(data: data!)
                self.setImage(ZYHImage, for: .normal)
            }else{
                let dispath = DispatchQueue.global(qos: .userInteractive)
                dispath.async(execute: { () -> Void in
                    let URL:Foundation.URL = Foundation.URL(string: url! as String)!
                    let data:Data?=try? Data(contentsOf: URL)
                    if data != nil {
                        ZYHImage=UIImage(data: data!)
                        //写缓存
                        ZYHWebImageChcheCenter.writeCacheToUrl(url!, data: data!)
                        DispatchQueue.main.async(execute: { () -> Void in
                            //刷新主UI
                            self.setImage(ZYHImage, for: .normal)
                        })
                    }
                    
                })
            }
        }else{
            let dispath=DispatchQueue.global(qos: .userInitiated)
            dispath.async(execute: { () -> Void in
                let URL:Foundation.URL = Foundation.URL(string: url! as String)!
                let data:Data?=try? Data(contentsOf: URL)
                if data != nil {
                    ZYHImage=UIImage(data: data!)
                    //写缓存
                    DispatchQueue.main.async(execute: { () -> Void in
                        //刷新主UI
                        self.setImage(ZYHImage, for: .normal)
                    })
                }
                
            })
        }
    }
    
}
