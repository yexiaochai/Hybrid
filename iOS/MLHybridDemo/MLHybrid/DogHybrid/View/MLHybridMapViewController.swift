//
//  MLHybridMapViewController.swift
//  Surgery
//
//  Created by caiyang on 2017/2/8.
//  Copyright © 2017年 Apple. All rights reserved.
//

import UIKit
import MapKit

class MLHybridMapViewController: UIViewController, MKMapViewDelegate {

    var latitude: Double = 0
    var longitude: Double = 0
    var name: String = "未知"
    var address: String = "未知"
    var infoUrl: String = ""
    
    @IBOutlet weak var backButton: UIButton!
    @IBAction func backButtonClick(_ sender: Any) {
        _ = self.navigationController?.popViewController(animated: true)
    }
    @IBOutlet weak var mapView: MKMapView!
    @IBOutlet weak var addressOne: UILabel!
    @IBOutlet weak var addressTwo: UILabel!
    @IBAction func navigationButtonClick(_ sender: Any) {
        
        let alertController = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        let mapArray = self.canOpenMap()
        if mapArray.first! {
            alertController.addAction(UIAlertAction(title: "百度地图", style: .default, handler: { (action) in
                let urlString = "baidumap://map/direction?origin=latlng:\(self.mapView.userLocation.coordinate.latitude),\(self.mapView.userLocation.coordinate.longitude)|name:\("我的位置")&destination=latlng:\(self.latitude),\(self.longitude)|name:\(self.name)&mode=driving".addingPercentEncoding(withAllowedCharacters: NSCharacterSet.urlQueryAllowed) ?? ""
                UIApplication.shared.openURL(URL(string: urlString)!)
            }))
        }
        if mapArray.last! {
            alertController.addAction(UIAlertAction(title: "高德地图", style: .default, handler: { (action) in
                let urlString = "iosamap://navi?sourceApplication=\("app name")&backScheme=\("backScheme")&poiname=\(self.name)&lat=\(self.latitude)&lon=\(self.longitude)&dev=1&style=2".addingPercentEncoding(withAllowedCharacters: NSCharacterSet.urlQueryAllowed) ?? ""
                UIApplication.shared.openURL(URL(string: urlString)!)
            }))
        }
        alertController.addAction(UIAlertAction(title: "苹果地图", style: .default, handler: { (action) in
            let startLocation = MKMapItem(placemark: MKPlacemark(coordinate: self.mapView.userLocation.coordinate, addressDictionary: nil))
            let endLocation = MKMapItem(placemark: MKPlacemark(coordinate: CLLocationCoordinate2DMake(self.latitude, self.longitude), addressDictionary: nil))
            endLocation.name = self.name
            let items = [startLocation, endLocation]
            let options = [MKLaunchOptionsDirectionsModeKey:MKLaunchOptionsDirectionsModeDriving,
                           MKLaunchOptionsShowsTrafficKey:true] as [String : Any]
            MKMapItem.openMaps(with: items, launchOptions: options)
        }))

        alertController.addAction(UIAlertAction(title: "取消", style: .cancel, handler: { (action) in
        }))

        self.present(alertController, animated: true, completion: nil)
        
    }
    
    @IBAction func openInfoUrl(_ sender: Any) {
        if self.infoUrl.characters.count > 0 {
            if let tempVC = MLHybridViewController.load(urlString: self.infoUrl) {
                tempVC.navigationController?.isNavigationBarHidden = false
                self.navigationController?.pushViewController(tempVC, animated: true)
            }
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewWillAppear(_ animated: Bool) {
        self.showLocation()
    }
    func showLocation() {
        let locationCoordinate = CLLocationCoordinate2DMake(latitude, longitude)
        self.addressOne.text = self.name
        self.addressTwo.text = self.address
        self.mapView.setCenter(locationCoordinate, animated: true)
        
        let span = MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
        let region = MKCoordinateRegion(center: locationCoordinate, span: span)
        self.mapView.setRegion(region, animated: true)

        let pinView = PinView(coordinate: locationCoordinate, title: "123", subtitle: "3333")
        self.mapView.addAnnotation(pinView)
    }
    
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        var pinView = self.mapView.dequeueReusableAnnotationView(withIdentifier: "location")
        if pinView == nil {
            pinView = MKPinAnnotationView(annotation: annotation as MKAnnotation?, reuseIdentifier: "location")
        }
        return pinView
    }
    
    func canOpenMap() -> [Bool] {
        let baidu = UIApplication.shared.canOpenURL(URL(string: "baidumap://map/")!)
        let gaode = UIApplication.shared.canOpenURL(URL(string: "iosamap://")!)
        return [baidu, gaode]
    }
}

class PinView: NSObject, MKAnnotation {

    var coordinate: CLLocationCoordinate2D
    var title: String?
    var subtitle: String?

    init(coordinate: CLLocationCoordinate2D, title: String, subtitle: String) {
        self.coordinate = coordinate
        self.title = title
        self.subtitle = subtitle
    }

}
