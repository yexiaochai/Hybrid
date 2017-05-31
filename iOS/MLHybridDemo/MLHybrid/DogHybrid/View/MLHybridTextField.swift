//
//  MLHybridTextField.swift
//  Surgery
//
//  Created by caiyang on 2017/2/8.
//  Copyright © 2017年 Apple. All rights reserved.
//

import UIKit

class MLHybridTextField: UITextField {


    var textFont: UIFont = UIFont.systemFont(ofSize: 14)
    var minLength: Int = 0
    var maxLength: Int = 0
    var returnBlock: ((String) -> ()) = {_ in }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.font = self.textFont
        self.delegate = self
        self.clearButtonMode = .whileEditing
    }

}

extension MLHybridTextField: UITextFieldDelegate {
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let textString = textField.text ?? ""
        let resultString = (textString as NSString).replacingCharacters(in: range, with: string)
        if self.maxLength == 0 {
            return true
        } else if resultString.characters.count > self.maxLength {
//            MLToast.message("不能超过\(self.maxLength)个字哟!")
            return false
        }
        return true
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        let textString = textField.text ?? ""
        if self.minLength == 0 {
            self.returnBlock(textString)
            return true
        } else if textString.characters.count < minLength {
//            MLToast.message("至少输入\(self.minLength)个字哟!")
            return false
        } else {
            self.returnBlock(textString)
            return true
        }
    }
    
}
