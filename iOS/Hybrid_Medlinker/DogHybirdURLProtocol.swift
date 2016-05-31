//
//  DogHybirdURLProtocol.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/30.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit
import Foundation

let webAppBaseUrl = "http://kuai.baidu.com/webapp"
let DogHybirdURLProtocolHandled = "DogHybirdURLProtocolHandled"

class DogHybirdURLProtocol: NSURLProtocol {

    override class func canInitWithRequest(request: NSURLRequest) -> Bool {
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
                let type = tempArray.last
                tempArray.removeLast()
                let path = MLTools().LocalResources + tempArray.joinWithSeparator(".")
                if let _ = NSBundle.mainBundle().pathForResource(path, ofType: type) {
                    print("文件存在")
                    print("path == \(path)")
                    print("type == \(type)")
                    return true
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
                    if let localUrl = NSBundle.mainBundle().pathForResource(path, ofType: type) {
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
                        let fileData = NSData(contentsOfFile: localUrl)
                        let url = NSURL(fileURLWithPath: localUrl)
                        let dataLength = fileData?.length ?? 0
                        let response = NSURLResponse(URL: url, MIMEType: typeString, expectedContentLength: dataLength, textEncodingName: "UTF-8")
                        client.URLProtocol(self, didReceiveResponse: response, cacheStoragePolicy: .NotAllowed)
                        client.URLProtocol(self, didLoadData: fileData!)
                        client.URLProtocolDidFinishLoading(self)
                    }
                    else {
                        print(">>>>> 未找到对应文件 \(path)\(type)<<<<<")
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
