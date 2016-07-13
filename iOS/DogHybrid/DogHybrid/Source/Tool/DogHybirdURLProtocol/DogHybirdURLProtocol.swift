//
//  DogHybridURLProtocol.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/30.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit
import Foundation

//let webAppBaseUrl = "http://yexiaochai.github.io/Hybrid/webapp/"
let webAppBaseUrl = "http://kq.medlinker.com/webapp/"

let DogHybridURLProtocolHandled = "DogHybridURLProtocolHandled"
let types = ["html","js","css","jpg","png"]
let contentTpye = ["html": "text/html", "js": "application/javascript", "css": "text/css", "jpg": "image/jpeg", "png": "image/png"]

public class DogHybridURLProtocol: NSURLProtocol {
    
    //查找本地文件是否存在
    private class func findCache(request: NSURLRequest) -> String? {
        if let url = request.URL?.absoluteString where url.hasPrefix(webAppBaseUrl) {
            let str = url.stringByReplacingOccurrencesOfString(webAppBaseUrl, withString: "")
            var tempArray = str.componentsSeparatedByString("?")
            tempArray = tempArray[0].componentsSeparatedByString(".")
            let type = tempArray.last!
            
            print("type == \(type)")
            if type == "js" {
                print("url == \(url)")
            }
            if !types.contains(type) {
                return nil
            }
            tempArray.removeLast()
            let fileName = tempArray.joinWithSeparator(".")
            let path = MLHybridTools().LocalResources + fileName
            let documentPath = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.DocumentDirectory, NSSearchPathDomainMask.UserDomainMask, true)[0]
            if NSFileManager.defaultManager().fileExistsAtPath(documentPath + "/\(fileName).\(type)") {
//                print("从doc中读取资源 \(fileName).\(type)")
                return documentPath + "/\(fileName).\(type)"
            }
            else if let filePath = NSBundle.mainBundle().pathForResource(path, ofType: type) {
//                print("读取预先打入包中的资源 \(filePath.componentsSeparatedByString("/").last)")
                return filePath
            }
            print("未找到 ------> \(url)")
        }
//        print("不符合规范的 ------> \(request.URL?.absoluteString)")
        return nil
    }

    override public class func canInitWithRequest(request: NSURLRequest) -> Bool {
        //如果被标记为已处理 直接跳过
        if let hasHandled = NSURLProtocol.propertyForKey(DogHybridURLProtocolHandled, inRequest: request) as? Bool where hasHandled == true {
            print("重复的url == \(request.URL?.absoluteString)")
            return false
        }
        if let _ = self.findCache(request) {
            return true
        }
        return false
    }

    override public class func canonicalRequestForRequest(request: NSURLRequest) -> NSURLRequest {
        return request
    }

    override public func startLoading() {
        //标记请求  防止重复处理
        let mutableReqeust: NSMutableURLRequest = self.request.mutableCopy() as! NSMutableURLRequest
        NSURLProtocol.setProperty(true, forKey: DogHybridURLProtocolHandled, inRequest: mutableReqeust)
        if let url = self.request.URL?.absoluteString where url.hasPrefix(webAppBaseUrl) {
            if let cachePath = DogHybridURLProtocol.findCache(self.request), let client: NSURLProtocolClient = self.client {
//                print("读取了缓存资源 \(cachePath)")
                let type = cachePath.componentsSeparatedByString(".").last ?? ""
                let fileData = NSData(contentsOfFile: cachePath)
                let url = NSURL(fileURLWithPath: cachePath)
                let response = NSURLResponse(URL: url, MIMEType: contentTpye[type], expectedContentLength: fileData?.length ?? 0, textEncodingName: "UTF-8")
                client.URLProtocol(self, didReceiveResponse: response, cacheStoragePolicy: .NotAllowed)
                client.URLProtocol(self, didLoadData: fileData!)
                client.URLProtocolDidFinishLoading(self)
            }
        }
        else {
            print(">>>>> url不匹配 <<<<<")
        }
    }
    
    override public func stopLoading() {
        
    }
    
}
