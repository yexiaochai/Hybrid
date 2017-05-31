//
//  MLHybridInputView.swift
//  MedLinker
//
//  Created by caiyang on 2017/3/12.
//  Copyright © 2017年 medlinker. All rights reserved.
//

import UIKit
import AssetsLibrary

fileprivate let _pickerTag = 19900914
fileprivate let _textFieldTag = 40699
fileprivate let _blackViewTag = 40688

class MLHybridInputView: UIView {

    fileprivate var _btnTxt: String = ""
    fileprivate var _tips: String = ""
    fileprivate var _textMin: Int = 0
    fileprivate var _textMax: Int = 1000
    fileprivate var _textValue: String = ""
    fileprivate var _hasImg: Bool = false
    fileprivate var _type: String = "Done"
    fileprivate var _count: Int = 3

    fileprivate var _callbackID: String = ""
    fileprivate weak var _webView: UIWebView?

    fileprivate var _blackView: UIView!
    fileprivate var _inputView: UIView!

    fileprivate var _inputViewHeight: CGFloat = 100
    fileprivate var _margin: CGFloat = 13
    fileprivate var _imagePickerHeight: CGFloat = 40
    fileprivate var _imageUrls: [String]?
    fileprivate var _imageIds: [Int]?
    fileprivate var _dataArr = [ALAsset]()

    
    
    class func show(args: [String: AnyObject], callbackID: String, webView: UIWebView) {
//        MLVerify.shared.check { (bool, reason) in
//            if bool {
//                if let v = UIApplication.shared.keyWindow?.viewWithTag(_pickerTag) as? MLHybridInputView, v._webView == webView, v._callbackID == callbackID {
//                    v.isHidden = false
//                    let inputTextField = UIApplication.shared.keyWindow?.viewWithTag(_textFieldTag)
//                    let _ = inputTextField?.becomeFirstResponder()
//                    let blackView = UIApplication.shared.keyWindow?.viewWithTag(_blackViewTag)
//                    UIView.animate(withDuration: 0.3, animations: {
//                        blackView?.alpha = 0.5
//                    })
//                } else {
//                    UIApplication.shared.keyWindow?.viewWithTag(_pickerTag)?.removeFromSuperview()
//                    let view = MLHybridInputView(frame: UIScreen.main.bounds)
//                    view._btnTxt = args["btnTxt"] as? String ?? ""
//                    view._tips = args["tips"] as? String ?? ""
//                    view._textMin = args["textMin"] as? Int ?? 0
//                    view._textMax = args["textMax"] as? Int ?? 0
//                    view._textValue = args["value"] as? String ?? ""
//                    view._hasImg = args["hasImg"] as? Bool ?? false
//                    view._type = args["type"] as? String ?? "Done"
//                    view._count = args["count"] as? Int ?? 3
//                    view._callbackID = callbackID
//                    view._webView = webView
//                    view.createTextView()
//                }
//            }
//        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.tag = _pickerTag
        self.backgroundColor = UIColor.clear
        UIApplication.shared.keyWindow?.addSubview(self)
        _blackView = UIControl(frame: UIScreen.main.bounds)
        _blackView.backgroundColor = UIColor.black
        _blackView.alpha = 0
        _blackView.tag = _blackViewTag
        self.addSubview(_blackView)
        let tap = UITapGestureRecognizer(target: self, action: #selector(MLHybridInputView.hideInputView))
        _blackView.addGestureRecognizer(tap)
    }
    
    deinit {
        _webView = nil
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    func hideInputView() {
        let inputTextField = UIApplication.shared.keyWindow?.viewWithTag(_textFieldTag)
        inputTextField?.resignFirstResponder()
    }

    func createTextView() {
//        _inputViewHeight = 100
//        if _hasImg {
//            _inputViewHeight = 150
//        } else {
//            _imagePickerHeight = 0
//        }
//        _inputView = UIView(frame: CGRect(x: 0, y: UIScreen.main.bounds.size.height, width: UIScreen.main.bounds.size.width, height: _inputViewHeight))
//        _inputView.backgroundColor = UIColor.white
//        self.addSubview(_inputView)
//        let inputTextView = MLHybridTextView(frame: CGRect(x: _margin - 6, y: _margin, width: _inputView.bounds.size.width - (_margin-6)*2, height: _inputView.bounds.size.height - _margin*3 - _imagePickerHeight))
//        inputTextView.text = _textValue
//        inputTextView.placeholder = _tips
//        inputTextView.minLength = _textMin
//        inputTextView.maxLength = _textMax
//        inputTextView.returnKeyType = .send
//        inputTextView.returnBlock = { [weak self] inputString in
//            self?.hideInputView()
//            guard let webView = self?._webView else {return}
//            MLHybridTools().viewControllerOf(webView).startAnimating()
//            let imageUploader = ImageUploadModel()
//            guard let dataArr = self?._dataArr else {return}
//            imageUploader.uploadImage(dataArr, authority: .isPublic, warterMark: .withMark, bucket: .post, completion: { (error) in
//                if error == nil {
//                    self?._imageUrls = imageUploader.imageUrls
//                    self?._imageIds = imageUploader.imageIds
//                }
//                MLHybridTools().viewControllerOf(webView).stopAnimating()
//                self?.callBack(text: inputTextView.text ?? "")
//            })
//        }
//        _inputView.addSubview(inputTextView)
//        inputTextView.tag = _textFieldTag
//        self.notifiRegister()
//        inputTextView.becomeFirstResponder()
//        UIView.animate(withDuration: 0.3, animations: {
//            self._blackView.alpha = 0.5
//        })
//        self.addImagePicker()
    }
    
    func createTextField() {
        
    }
    
    func notifiRegister() {
        NotificationCenter.default.addObserver(forName: NSNotification.Name.UIKeyboardWillShow, object: nil, queue: nil, using: { (notification) in
            let keyboardEndFrame = notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as? CGRect ?? CGRect()
            let duration = notification.userInfo?[UIKeyboardAnimationDurationUserInfoKey] as? CGFloat ?? 0
            UIView.animate(withDuration: TimeInterval(duration), animations: {
                var tempFrame = self._inputView.frame
                tempFrame.origin.y = keyboardEndFrame.origin.y - self._inputViewHeight
                self._inputView.frame = tempFrame
                
                var tempFrameForBlackView = self._blackView.frame
                tempFrameForBlackView.size.height = UIScreen.main.bounds.size.height - keyboardEndFrame.size.height
                self._blackView.frame = tempFrameForBlackView
            })
        })
        NotificationCenter.default.addObserver(forName: NSNotification.Name.UIKeyboardWillHide, object: nil, queue: nil, using: { (notification) in
            let keyboardEndFrame = notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as? CGRect ?? CGRect()
            let duration = notification.userInfo?[UIKeyboardAnimationDurationUserInfoKey] as? CGFloat ?? 0
            UIView.animate(withDuration: TimeInterval(duration), animations: {
                var tempFrame = self._inputView.frame
                tempFrame.origin.y = keyboardEndFrame.origin.y
                self._inputView.frame = tempFrame
                var tempFrameForBlackView = self._blackView.frame
                tempFrameForBlackView.size.height = UIScreen.main.bounds.size.height
                self._blackView.frame = tempFrameForBlackView
                self._blackView.alpha = 0
            }, completion: { (bool) in
                self.isHidden = true
            })
        })
    }
    
    func addImagePicker() {
//        if _hasImg {
//            let imageInput = MLImagePickerView.loadInstance(_imagePickerHeight, deleteBtnSize: 16)
//            imageInput.delegate = self
//            imageInput.needHideActionBtn = true
//            imageInput.navigationController = MLHybridTools().currentVC()?.navigationController
//            
//            let y = _inputView.bounds.size.height - _margin - _imagePickerHeight
//            let width = UIScreen.main.bounds.size.width - _margin*3
//            imageInput.frame = CGRect(x: _margin, y: y, width: width, height: _imagePickerHeight)
//            imageInput.maxCount = 3 //最多支持三张图片评论
//            _inputView.addSubview(imageInput)
//        }
    }
    
    func callBack(text: String) {
        guard let webView = self._webView else {return}
        let dic = ["text": text,
                   "urls": _imageUrls ?? [],
                   "ids": _imageIds ?? []] as [String : Any]
        _ = MLHybridTools().callBack(data: dic, err_no: 0, msg: "", callback: self._callbackID, webView: webView)
        self.removeFromSuperview()
    }
}

//extension MLHybridInputView: MLImagePickerViewDelegate {
//    internal func imagePickerViewDidClickAddBtn() {
//        UIApplication.shared.keyWindow?.endEditing(true)
//    }
//    
//    func imagePickerViewDidFinishChoose(picker: MLImagePickerView) {
//        self._dataArr = picker.dataArr
//        if let v = UIApplication.shared.keyWindow?.viewWithTag(_pickerTag) {
//            v.isHidden = false
//            let inputTextField = UIApplication.shared.keyWindow?.viewWithTag(_textFieldTag)
//            let _ = inputTextField?.becomeFirstResponder()
//            let blackView = UIApplication.shared.keyWindow?.viewWithTag(_blackViewTag)
//            UIView.animate(withDuration: 0.3, animations: {
//                blackView?.alpha = 0.5
//            })
//            return
//        }
//    }
//}
