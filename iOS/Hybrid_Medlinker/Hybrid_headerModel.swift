//
//  Hybrid_headerModel.swift
//  Hybrid_Medlinker
//
//  Created by caiyang on 16/5/13.
//  Copyright © 2016年 caiyang. All rights reserved.
//

import UIKit

class Hybrid_headerModel: NSObject {
    var title: Hybrid_titleModel?
    var left: [Hybrid_naviButtonModel]?
    var right: [Hybrid_naviButtonModel]?
    
    class func modelContainerPropertyGenericClass() -> [String : AnyObject]? {
        return ["right" : Hybrid_naviButtonModel.self, "left" : Hybrid_naviButtonModel.self]
    }

}
