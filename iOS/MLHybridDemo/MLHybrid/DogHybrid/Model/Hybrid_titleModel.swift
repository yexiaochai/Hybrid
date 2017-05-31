//
//  Hybrid_titleModel.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/13.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class Hybrid_titleModel: NSObject {
    var title: String = ""
    var subtitle: String = ""
    var tagname: String = ""
    var lefticon: String = ""
    var righticon: String = ""
    var placeholder: String = ""
    var focus: Bool = true
    var callback: String = ""
    
    func isCustom() -> Bool {
        if self.subtitle.characters.count == 0 && self.lefticon.characters.count == 0 && self.righticon.characters.count == 0 {
            return false
        }
        return true
    }
}
