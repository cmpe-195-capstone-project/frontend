"""
Get Mac's actual location using CoreLocation
Requires: pip install pyobjc-framework-CoreLocation
"""

import sys
import json
import time

try:
    from CoreLocation import CLLocationManager, kCLAuthorizationStatusAuthorizedWhenInUse
    from Foundation import NSRunLoop, NSDefaultRunLoopMode, NSObject
except ImportError:
    print(json.dumps({"error": "pyobjc-framework-CoreLocation not installed. Run: pip3 install pyobjc-framework-CoreLocation"}))
    sys.exit(1)

location_data = {"error": None, "lat": None, "lon": None}
manager = None

def location_callback(manager, locations, error):
    global location_data
    if error:
        location_data["error"] = str(error)
    elif locations and len(locations) > 0:
        location = locations[0]
        location_data["lat"] = location.coordinate().latitude
        location_data["lon"] = location.coordinate().longitude
    NSRunLoop.currentRunLoop().performSelector_target_argument_order_modes_(
        None, None, None, 0, [NSDefaultRunLoopMode]
    )

def get_location():
    global manager
    manager = CLLocationManager.alloc().init()
    
    class LocationDelegate(NSObject):
        def locationManager_didUpdateLocations_(self, manager, locations):
            global location_data
            if locations and len(locations) > 0:
                location = locations[0]
                location_data["lat"] = location.coordinate().latitude
                location_data["lon"] = location.coordinate().longitude
    
    delegate = LocationDelegate.alloc().init()
    manager.setDelegate_(delegate)
    
    manager.requestWhenInUseAuthorization()
    
    time.sleep(2)
    
    status = manager.authorizationStatus()
    if status == 0:  
        return {"error": "Location permission not determined. Please check System Settings > Privacy & Security > Location Services and grant permission to Terminal or Python."}
    elif status == 1:  
        return {"error": "Location access is restricted."}
    elif status == 2:  
        return {"error": "Location permission denied. Please enable in System Settings > Privacy & Security > Location Services."}
    elif status not in [3, 4]:  
        return {"error": f"Location permission status: {status}. Expected 3 or 4."}
    
    manager.startUpdatingLocation()
    
    timeout = 15
    start_time = time.time()
    while location_data["lat"] is None and location_data["error"] is None:
        if time.time() - start_time > timeout:
            location_data["error"] = "Timeout waiting for location (15 seconds)"
            break
        NSRunLoop.currentRunLoop().runMode_beforeDate_(NSDefaultRunLoopMode, None)
        time.sleep(0.2)
    
    manager.stopUpdatingLocation()
    
    return location_data

if __name__ == '__main__':
    result = get_location()
    print(json.dumps(result))

