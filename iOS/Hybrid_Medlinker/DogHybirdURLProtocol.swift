//
//  DogHybirdURLProtocol.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/30.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit
import Foundation

let webAppBaseUrl = "http://yexiaochai.github.io/Hybrid/webapp/"
let DogHybirdURLProtocolHandled = "DogHybirdURLProtocolHandled"
let types = ["html","js","css","jpg","png"]

class DogHybirdURLProtocol: NSURLProtocol {
    
    override class func canInitWithRequest(request: NSURLRequest) -> Bool {
        
//        NSString *scheme = [[request URL] scheme];
//        if ( ([scheme caseInsensitiveCompare:@"http"] == NSOrderedSame ||
//        [scheme caseInsensitiveCompare:@"https"] == NSOrderedSame))
        //如果被标记为已处理 直接跳过
        if let hasHandled = NSURLProtocol.propertyForKey(DogHybirdURLProtocolHandled, inRequest: request) as? Bool where hasHandled == true {
            print("重复的url == \(request.URL?.absoluteString)")
            return false
        }
        if let url = request.URL?.absoluteString {
            if url.hasPrefix(webAppBaseUrl) {
                let str = url.stringByReplacingOccurrencesOfString(webAppBaseUrl, withString: "")
                var tempArray = str.componentsSeparatedByString("?")
                tempArray = tempArray[0].componentsSeparatedByString(".")
                let type = tempArray.last!
                tempArray.removeLast()
                let path = MLTools().LocalResources + tempArray.joinWithSeparator(".")
                
//                let basePath = NSBundle.mainBundle().pathForResource("DogHybirdResources", ofType: "")
////                let fileArray = NSFileManager.defaultManager().subpathsAtPath(NSHomeDirectory())
//                let fileArray = NSFileManager.defaultManager().subpathsAtPath(basePath!)
//
//                //                    循环出力取得路径
//                for file in fileArray! {
//                    print("      \(file)")
//                }

                
                
                let filePath = NSBundle.mainBundle().pathForResource(path, ofType: type)
                if let zipPath = filePath {
                    if types.contains(type) {
//                        print("文件存在")
//                        print("path == \(path)")
//                        print("type == \(type)")
                        return true
                    }
                    else {
                        print(zipPath)
                        print("发现文件 但是不处理 \(type) 类型")
                    }
                }
                else {
                    let documentPaths = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.DocumentDirectory, NSSearchPathDomainMask.UserDomainMask, true)
                    let documentPath = documentPaths[0]

                    let newPath = path.stringByReplacingOccurrencesOfString("DogHybirdResources/", withString: "")
                    let fileData = NSFileManager.defaultManager().contentsAtPath(documentPath + "/\(newPath).\(type)")

                    if fileData?.length > 0 {
//                        print("path == \(documentPath + "/\(newPath).\(type)")")
//                        print("fileList == \(fileData)")
                        return true
                    }
                }
            }
        }
        return false
    }

    override class func canonicalRequestForRequest(request: NSURLRequest) -> NSURLRequest {
        return request
    }

    override func startLoading() {
        //标记请求  防止重复处理
        let mutableReqeust: NSMutableURLRequest = self.request.mutableCopy() as! NSMutableURLRequest
        NSURLProtocol.setProperty(true, forKey: DogHybirdURLProtocolHandled, inRequest: mutableReqeust)
        
        dispatch_async(dispatch_get_main_queue()) {
            if let url = self.request.URL?.absoluteString {
                if url.hasPrefix(webAppBaseUrl) {
                    let str = url.stringByReplacingOccurrencesOfString(webAppBaseUrl, withString: "")
                    var tempArray = str.componentsSeparatedByString("?")
                    tempArray = tempArray[0].componentsSeparatedByString(".")
                    let type = tempArray.last!
                    tempArray.removeLast()
                    let path = MLTools().LocalResources + tempArray.joinWithSeparator(".")
                    let client: NSURLProtocolClient = self.client!
                    
                    var typeString = ""
                    switch type {
                    case "html":
                        typeString = "text/html"
                        break
                    case "js":
                        typeString = "application/javascript"
                        break
                    case "css":
                        typeString = "text/css"
                        break
                    case "jpg":
                        typeString = "image/jpeg"
                        break
                    case "png":
                        typeString = "image/png"
                        break
                    default:
                        break
                    }

                    if let localUrl = NSBundle.mainBundle().pathForResource(path, ofType: type) {
                        let fileData = NSData(contentsOfFile: localUrl)
                        let url = NSURL(fileURLWithPath: localUrl)
                        let dataLength = fileData?.length ?? 0
                        let response = NSURLResponse(URL: url, MIMEType: typeString, expectedContentLength: dataLength, textEncodingName: "UTF-8")
                        client.URLProtocol(self, didReceiveResponse: response, cacheStoragePolicy: .NotAllowed)
                        client.URLProtocol(self, didLoadData: fileData!)
                        client.URLProtocolDidFinishLoading(self)
                    }
                    else {
                        let documentPaths = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.DocumentDirectory, NSSearchPathDomainMask.UserDomainMask, true)
                        let documentPath = documentPaths[0]
                        
                        let newPath = path.stringByReplacingOccurrencesOfString("DogHybirdResources/", withString: "")
                        let docFilePath = documentPath + "/\(newPath).\(type)"
                        let docFileData = NSFileManager.defaultManager().contentsAtPath(docFilePath)
                        
                        if docFileData?.length > 0 {
//                            let fileData = NSData(contentsOfFile: localUrl)
                            let url = NSURL(fileURLWithPath: docFilePath)
                            let dataLength = docFileData?.length ?? 0
                            let response = NSURLResponse(URL: url, MIMEType: typeString, expectedContentLength: dataLength, textEncodingName: "UTF-8")
                            client.URLProtocol(self, didReceiveResponse: response, cacheStoragePolicy: .NotAllowed)
                            client.URLProtocol(self, didLoadData: docFileData!)
                            client.URLProtocolDidFinishLoading(self)
                        }
                        else {
                            print(">>>>> 未找到对应文件 \(path)\(type)<<<<<")
                        }
                    }
                }
                else {
                    print(">>>>> url不符合规则 <<<<<")
                }
            }
            else {
                print(">>>>> url字符串获取失败 <<<<<")
            }
        }
    }
    
    override func stopLoading() {
        
    }

}
