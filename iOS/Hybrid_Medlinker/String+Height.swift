//
//  String+Height.swift
//  MedLinker
//
//  Created by cy on 15/11/3.
//  Copyright © 2015年 MedLinker. All rights reserved.
//

import Foundation
extension String{
    
    //MARK:获得string内容高度
    
    func stringHeightWith(fontSize:CGFloat,width:CGFloat)->CGFloat{
        let font = UIFont.systemFontOfSize(fontSize)
        let size = CGSizeMake(width,CGFloat.max)
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineBreakMode = .ByWordWrapping;
        let attributes = [NSFontAttributeName:font, NSParagraphStyleAttributeName:paragraphStyle.copy()]
        let text = self as NSString
        let rect = text.boundingRectWithSize(size, options:.UsesLineFragmentOrigin, attributes: attributes, context:nil)
        let height = Int(rect.size.height) + 1
        return CGFloat(height)
    }
    
    //MARK:获得string内容宽度
    
    func stringWidthWith(fontSize:CGFloat,height:CGFloat)->CGFloat{
        let font = UIFont.systemFontOfSize(fontSize)
        let size = CGSizeMake(CGFloat.max,height)
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineBreakMode = .ByWordWrapping;
        let attributes = [NSFontAttributeName:font, NSParagraphStyleAttributeName:paragraphStyle.copy()]
        let text = self as NSString
        let rect = text.boundingRectWithSize(size, options:.UsesLineFragmentOrigin, attributes: attributes, context:nil)
        let width = Int(rect.size.width) + 1
        return CGFloat(width)
    }


}

