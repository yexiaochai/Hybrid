//
//  MLHybridLocation.swift
//  Surgery
//
//  Created by caiyang on 16/9/5.
//  Copyright © 2016年 Apple. All rights reserved.
//

import UIKit
import CoreLocation

class MLHybridLocation: NSObject, CLLocationManagerDelegate {
    
    //定位管理器
    let locationManager:CLLocationManager = CLLocationManager()
    var finishBlock: ((_ success: Bool, _ errcode: Int, _ resultData: [String: AnyObject]?) -> ())?
//    * errcode错误码：0、无错误； 1、“Permission denied” - 用户不允许地理定位； 2、“Position unavailable” - 无法获取当前位置、3、“Timeout” - 操作超时、4、“No support” - 不支持

    func getLocation(_ finishBlock: @escaping ((_ success: Bool, _ errcode: Int, _ resultData: [String: AnyObject]?) -> ())) {
        self.finishBlock = finishBlock
        //设置定位服务管理器代理
        locationManager.delegate = self
        //设置定位进度
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        //更新距离
        locationManager.distanceFilter = 100
        ////发送授权申请
        
        locationManager.requestWhenInUseAuthorization()
        if (CLLocationManager.locationServicesEnabled())
        {
            //允许使用定位服务的话，开启定位服务更新
            self.locationManager.startUpdatingLocation()
        }
        else {
            self.finishBlock?(false, 1, nil)
        }
    }
    
    func stopUpdateLocation() {
        locationManager.stopUpdatingLocation()
    }
    
    //定位改变执行，可以得到新位置、旧位置
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        //获取最新的坐标
        if let currLocation:CLLocation = locations.last {
            let data = ["pos": ["lng": "\(currLocation.coordinate.longitude)", "lat": "\(currLocation.coordinate.latitude)"]]
            self.finishBlock?(true, 0, data as [String : AnyObject]?)
             self.finishBlock = nil
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        self.finishBlock?(false, 2, nil)
        self.finishBlock = nil

    }

}
