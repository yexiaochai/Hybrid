//
//  ZYHWebImageChcheCenter.swift
//  SwiftMovie
//
//  Created by apple on 15-6-25.
//  Copyright (c) 2015年 wutong. All rights reserved.
//

import UIKit
class ZYHWebImageChcheCenter: NSObject {
    class func readCacheFromUrl(url:NSString)->NSData?{
        var data:NSData?
        let path:NSString=ZYHWebImageChcheCenter.getFullCachePathFromUrl(url)
        if NSFileManager.defaultManager().fileExistsAtPath(path as String) {
            data=NSData.dataWithContentsOfMappedFile(path as String) as? NSData
        }
        return data
    }
    
    class func writeCacheToUrl(url:NSString, data:NSData){
        let path:NSString=ZYHWebImageChcheCenter.getFullCachePathFromUrl(url)
       print(data.writeToFile(path as String, atomically: true))
    }
    //设置缓存路径
    class func getFullCachePathFromUrl(url:NSString)->NSString{
        var chchePath=NSHomeDirectory().stringByAppendingString("/Library/Caches/MyCache")
        let fileManager:NSFileManager=NSFileManager.defaultManager()
        fileManager.fileExistsAtPath(chchePath)
        if !(fileManager.fileExistsAtPath(chchePath)) {
            do {
                try fileManager.createDirectoryAtPath(chchePath, withIntermediateDirectories: true, attributes: nil)
            }
            catch  {
                
            }
        }
        //进行字符串处理
        var newURL:NSString
        newURL=ZYHWebImageChcheCenter.stringToZYHString(url)
        chchePath=chchePath.stringByAppendingFormat("/%@", newURL)
        return chchePath
    }
    //删除缓存
    class func removeAllCache(){
        let chchePath=NSHomeDirectory().stringByAppendingString("/Library/Caches/MyCache")
        let fileManager:NSFileManager=NSFileManager.defaultManager()
        if fileManager.fileExistsAtPath(chchePath) {
            do {
                try fileManager.removeItemAtPath(chchePath)

            }
            catch  {
                
            }
        }
        
    }
    class func stringToZYHString(str:NSString)->NSString{
        let newStr:NSMutableString=NSMutableString()
        for i:NSInteger in 0 ..< str.length {
            let c:unichar=str.characterAtIndex(i)
            if (c>=48&&c<=57)||(c>=65&&c<=90)||(c>=97&&c<=122){
                newStr.appendFormat("%c", c)
            }
        }
        return newStr.copy() as! NSString
        
    }
}
