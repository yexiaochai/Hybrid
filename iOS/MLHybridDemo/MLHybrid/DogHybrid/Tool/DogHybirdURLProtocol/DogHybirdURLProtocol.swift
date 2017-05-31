//
//  DogHybridURLProtocol.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/30.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit
import Foundation

//let webAppBaseUrl = URL(string: AppConfig.shared.h5Host)
//let webAppBaseUrl = URL(string: kH5ServiceHost)
//let webAppBaseUrl = "web.qa.medlinker.com"
let webAppBaseUrl = "web.qa.medlinker.com"


let DogHybridURLProtocolHandled = "DogHybridURLProtocolHandled"
let types = ["html","js","css","jpg","png"]
let contentTpye = ["html": "text/html", "js": "application/javascript", "css": "text/css", "jpg": "image/jpeg", "png": "image/png"]

open class DogHybridURLProtocol: URLProtocol {
    
    //查找本地文件是否存在
    fileprivate class func findCache(_ request: URLRequest) -> String? {
        let closeSwitch = UserDefaults.standard.bool(forKey: "HybridSwitchCacheClose")
        if closeSwitch {
            print("读取资源 关")
            return nil
        }
        if let url = request.url, request.url?.host == webAppBaseUrl  {
            if !types.contains(url.pathExtension) {
                return nil
            }
            let documentPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)[0]
            if FileManager.default.fileExists(atPath: documentPath + url.path) {
                return documentPath + url.path
            }
//            暂时取消此功能
//            else if let filePath = Bundle.main.path(forResource: url.path, ofType: "") {
//                let path = MLHybridTools().LocalResources + url.path
//                return filePath
//            }
        }
        return nil
    }

    override open class func canInit(with request: URLRequest) -> Bool {
        //如果被标记为已处理 直接跳过
        if let hasHandled = URLProtocol.property(forKey: DogHybridURLProtocolHandled, in: request) as? Bool , hasHandled == true {
            return false
        }
        if let _ = self.findCache(request) {
            return true
        }
        return false
    }

    override open class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override open func startLoading() {
        //标记请求  防止重复处理
        let mutableReqeust: NSMutableURLRequest = (self.request as NSURLRequest).mutableCopy() as! NSMutableURLRequest
        URLProtocol.setProperty(true, forKey: DogHybridURLProtocolHandled, in: mutableReqeust)
        if request.url?.host == webAppBaseUrl  {
            if let cachePath = DogHybridURLProtocol.findCache(self.request), let client: URLProtocolClient = self.client {
                let url = URL(fileURLWithPath: cachePath)
//                log.debug("读取了本地的 == \(url.path)")
                let type = url.pathExtension
                let fileData = try? Data(contentsOf: URL(fileURLWithPath: cachePath))
                let response = URLResponse(url: url, mimeType: contentTpye[type], expectedContentLength: fileData?.count ?? 0, textEncodingName: "UTF-8")
                client.urlProtocol(self, didReceive: response, cacheStoragePolicy: .allowed)
                client.urlProtocol(self, didLoad: fileData!)
                client.urlProtocolDidFinishLoading(self)
            }
        }
    }
    
    override open func stopLoading() {
        
    }
    
}
