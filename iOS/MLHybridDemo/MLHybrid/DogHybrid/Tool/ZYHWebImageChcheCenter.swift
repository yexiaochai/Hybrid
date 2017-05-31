//
//  ZYHWebImageChcheCenter.swift
//  SwiftMovie
//
//  Created by apple on 15-6-25.
//  Copyright (c) 2015年 wutong. All rights reserved.
//

import UIKit
class ZYHWebImageChcheCenter: NSObject {
    class func readCacheFromUrl(_ url:NSString)->Data?{
        var data:Data?
        let path:NSString = ZYHWebImageChcheCenter.getFullCachePathFromUrl(url)
        if FileManager.default.fileExists(atPath: path as String) {
            // 蔡阳tbd
            //data = NSData.dataWithContentsOfMappedFile(path as String) as? Data
            data = NSData(contentsOfFile : path as String) as Data?;
        }
        return data
    }
    
    class func writeCacheToUrl(_ url:NSString, data:Data){
        let path:NSString=ZYHWebImageChcheCenter.getFullCachePathFromUrl(url)
       print((try? data.write(to: URL(fileURLWithPath: path as String), options: [.atomic])) != nil)
    }
    //设置缓存路径
    class func getFullCachePathFromUrl(_ url:NSString)->NSString{
        var chchePath=NSHomeDirectory() + "/Library/Caches/MyCache"
        let fileManager:FileManager=FileManager.default
        fileManager.fileExists(atPath: chchePath)
        if !(fileManager.fileExists(atPath: chchePath)) {
            do {
                try fileManager.createDirectory(atPath: chchePath, withIntermediateDirectories: true, attributes: nil)
            }
            catch  {
                
            }
        }
        //进行字符串处理
        var newURL:NSString
        newURL=ZYHWebImageChcheCenter.stringToZYHString(url)
        chchePath=chchePath.appendingFormat("/%@", newURL)
        return chchePath as NSString
    }
    //删除缓存
    class func removeAllCache(){
        let chchePath=NSHomeDirectory() + "/Library/Caches/MyCache"
        let fileManager:FileManager=FileManager.default
        if fileManager.fileExists(atPath: chchePath) {
            do {
                try fileManager.removeItem(atPath: chchePath)

            }
            catch  {
                
            }
        }
        
    }
    class func stringToZYHString(_ str:NSString)->NSString{
        let newStr:NSMutableString=NSMutableString()
        for i:NSInteger in 0 ..< str.length {
            let c:unichar=str.character(at: i)
            if (c>=48&&c<=57)||(c>=65&&c<=90)||(c>=97&&c<=122){
                newStr.appendFormat("%c", c)
            }
        }
        return newStr.copy() as! NSString
        
    }
}
