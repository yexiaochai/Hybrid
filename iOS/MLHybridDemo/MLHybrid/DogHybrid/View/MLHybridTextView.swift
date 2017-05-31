//
//  MLHybridTextView.swift
//  Surgery
//
//  Created by caiyang on 2017/2/7.
//  Copyright © 2017年 Apple. All rights reserved.
//

import UIKit

class MLHybridTextView: UITextView {

    private var placeholderLabel: UILabel
    var placeholder: String = "" {
        didSet {
            placeholderLabel.text = placeholder
            self.placeholderLabel.isHidden = self.hasText;
        }
    }
    var placeholderColor: UIColor = .black
    var textFont: UIFont = UIFont.systemFont(ofSize: 18)
    var maxLength: Int = 0
    var minLength: Int = 0
    var returnBlock: ((String) -> ()) = {_ in }

    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override init(frame: CGRect, textContainer: NSTextContainer?) {
        self.placeholderLabel = UILabel(frame: CGRect(x: 5, y: 8, width: 100, height: 20))
        self.placeholderLabel.backgroundColor = UIColor.clear
        self.placeholderLabel.text = placeholder
        self.placeholderLabel.textColor = placeholderColor
        self.placeholderLabel.font = self.textFont
        super.init(frame: frame, textContainer: textContainer)
        self.addSubview(self.placeholderLabel)
        self.font = self.textFont
        self.delegate = self
        NotificationCenter.default.addObserver(forName: NSNotification.Name.UITextViewTextDidChange, object: nil, queue: nil) { (notifi) in
            self.placeholderLabel.isHidden = self.hasText;
        }
    }
    
}

extension MLHybridTextView: UITextViewDelegate {
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        if text == "\n" {
            let inputString = textView.text ?? ""
            if inputString.characters.count < self.minLength {
//                MLToast.message("至少输入\(self.minLength)个字哟!")
            } else {
                self.returnBlock(inputString)
            }
            return false
        }
        let resultString = (textView.text as NSString).replacingCharacters(in: range, with: text)
        if self.maxLength == 0 {
            return true
        } else if resultString.characters.count > self.maxLength {
//            MLToast.message("不能超过\(self.maxLength)个字哟!")
            return false
        }
        return true
    }

}

