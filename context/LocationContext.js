import React, { createContext, useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { NativeModules } from 'react-native';

export const LocationContext = createContext({
  location: FALLBACK,
  status: "",
  refresh: () => { }
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
  const [watchId, setWatchId] = useState(null);


  useEffect(() => {
    // if (!ready) return;
    (async () => {

      await getLocation();
      await watchLocation();
    })();

    return () => {
      if (watchId !== null) {
        console.log("[Location] Clearing location watcher");
        Geolocation.clearWatch(watchId);
      }
    }
  }, []);


  const watchLocation = async () => {
    console.log('[WatchLocation] Starting to watch location');

    const id = Geolocation.watchPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;

        const next = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        // Update UI location
        setLocation(next);

        console.log(`[WatchLocation] New updated location: latitude[${next.latitude}] longitude[${next.longitude}]`)

        // Send update to native
        NativeModules.ForegroundServiceModule.sendUpdateLocation(
          next.latitude.toString(),
          next.longitude.toString()
        );
      },
      err => {
        console.log('[WatchLocation] WATCHING GPS SERVICE ERROR:', err.code, err.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,   // triggers after user moves 10 meters
        interval: 10000,      // Android: 10 seconds max between events
        fastestInterval: 5000, // Android: at least 5 seconds apart
        accuracy: { android: "balanced" }
      }

    );

    setWatchId(id);
  }

  // Get location on app mount
  const getLocation = async () => {
    console.log('[Location] Booting location service...');
    console.log('[Location] starting permission flow');

    console.log('[Location] Fetching GPS...');

    // Get the location when app starts
    Geolocation.getCurrentPosition(
      async pos => {
        console.log('[Location] GPS OK:', JSON.stringify(pos));

        const { latitude, longitude } = pos.coords;
        const next = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setLocation(next);
        setStatus('');
        console.log("the location I have" + next);

        NativeModules.ForegroundServiceModule.sendUpdateLocation(
          next.latitude.toString(),
          next.longitude.toString()
        );

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
