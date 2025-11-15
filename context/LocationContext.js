import React, {createContext, useState, useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';

export const LocationContext = createContext({
  location: FALLBACK,
  status: "",
  refresh: () => {}
});

export const FALLBACK = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export function LocationProvider({ children }) {

  const [location, setLocation] = useState(FALLBACK);
  const [status, setStatus] = useState('Booting...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Location] Context initializing...');
    getLocation();
  }, []);

  // Get location on app mount
  const getLocation = async () => {
    console.log('[Location] Booting location service...');
    console.log('[Location] starting permission flow');

    if (Platform.OS === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('[Location] permission result:', res);

      if (res !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[Location] Permision denied');
        setStatus('Location permission denied. Showing default area.');
        return;
      }
    }

    console.log('[Location] Fetching GPS...');

    // Get the location when app starts
    Geolocation.getCurrentPosition(
      async pos => {
        console.log('[Location] GPS OK:', JSON.stringify(pos));

        const {latitude, longitude} = pos.coords;
        const next = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setLocation(next);
        setStatus('');
        console.log("the location i ahve" + next);
        // await storeData('location', JSON.stringify(next));
        // await AsyncStorage.setItem("location", JSON.stringify(next));
        setLoading(false);
      },
      err => {
        console.log('[Location] GPS ERROR:', err.code, err.message);
        setStatus(`GPS error (${err.code}). Showing default area.`);
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 5000, 
        accuracy: { android: "balanced" }
      },
    );
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        status,
        refresh: getLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
}
