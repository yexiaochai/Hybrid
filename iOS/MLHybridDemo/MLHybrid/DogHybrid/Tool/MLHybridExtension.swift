//
//  String+MLHybrid.swift
//  MedLinker
//
//  Created by cy on 15/11/3.
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import Foundation
extension String{
    
    //MARK:获得string内容高度
    func hybridStringHeightWith(_ fontSize:CGFloat,width:CGFloat)->CGFloat{
        let font = UIFont.systemFont(ofSize: fontSize)
        let size = CGSize(width: width,height: CGFloat.greatestFiniteMagnitude)
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineBreakMode = .byWordWrapping;
        let attributes = [NSFontAttributeName:font, NSParagraphStyleAttributeName:paragraphStyle.copy()]
        let text = self as NSString
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: attributes, context:nil)
        let height = Int(rect.size.height) + 1
        return CGFloat(height)
    }
    
    //MARK:获得string内容宽度
    func hybridStringWidthWith(_ fontSize:CGFloat,height:CGFloat)->CGFloat{
        let font = UIFont.systemFont(ofSize: fontSize)
        let size = CGSize(width: CGFloat.greatestFiniteMagnitude,height: height)
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineBreakMode = .byWordWrapping;
        let attributes = [NSFontAttributeName:font, NSParagraphStyleAttributeName:paragraphStyle.copy()]
        let text = self as NSString
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: attributes, context:nil)
        let width = Int(rect.size.width) + 1
        return CGFloat(width)
    }

    func hybridDecodeURLString () -> String {
        let mutStr = NSMutableString(string: self)
        return mutStr.replacingPercentEscapes(using: String.Encoding.utf8.rawValue) ?? ""
    }
    
    func hybridUrlPathAllowedString () -> String {
        let mutStr = NSMutableString(string: self)
        let tempStr = mutStr.replacingPercentEscapes(using: String.Encoding.utf8.rawValue) ?? ""
        return tempStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlFragmentAllowed) ?? ""
    }

    func hybridDecodeJsonStr() -> [String: AnyObject] {
        if let jsonData = self.data(using: String.Encoding.utf8) , self.characters.count > 0 {
            do {
                return try JSONSerialization.jsonObject(with: jsonData, options: JSONSerialization.ReadingOptions.mutableContainers) as? [String: AnyObject] ?? ["":"" as AnyObject]
            } catch let error as NSError {
                print("decodeJsonStr == \(error)")
            }
        }
        return [:]
    }

    
    func hybridURLString(appendParams: [String: String]) -> String? {
        if let topageURL = URL(string: self) {
            var paramsDic = topageURL.hybridURLParamsDic()
            for key in appendParams.keys {
                if let value = appendParams[key] {
                    paramsDic.updateValue(value, forKey: key)
                }
            }
            var paramsArray = [String]()
            for key in paramsDic.keys {
                if let value = appendParams[key] {
                    paramsArray.append("\(key)=\(value)")
                }
            }
            let paramsString = paramsArray.joined(separator: "&")
            if let host = topageURL.host, let scheme = topageURL.scheme, paramsString.characters.count > 0 {
                let newTopageURL = "\(scheme + "://" + host + topageURL.path)?\(paramsString)"
                return newTopageURL
            }
        }
        return self
    }
}

extension URL {
    
    /// 获取URL参数字典
    ///
    /// - Returns: URL参数字典
    func hybridURLParamsDic() -> [String: String] {
        let paramArray = self.query?.components(separatedBy: "&") ?? []
        var paramDic: Dictionary = ["": ""]
        for str in paramArray {
            let tempArray = str.components(separatedBy: "=")
            if tempArray.count == 2 {
                paramDic.updateValue(tempArray[1], forKey: tempArray[0])
            }
        }
        return paramDic
    }

}

extension Dictionary {
    
    /// 字典转JSON字符串
    ///
    /// - Returns: JSON字符串
    func hybridJSONString() -> String {
        if let jsonData = try? JSONSerialization.data(withJSONObject: self, options: JSONSerialization.WritingOptions.prettyPrinted) {
            if let strJson = String(data: jsonData, encoding: .utf8) {
                return strJson
            }
            else {
                return ""
            }
        }
        else {
            return ""
        }
    }
    
}
