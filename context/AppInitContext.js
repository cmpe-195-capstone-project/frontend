import React, { createContext, useContext, useEffect } from 'react';
import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
import uuid from 'react-native-uuid';

import { LocationContext } from './LocationContext';
import { storeData, getData } from '../utils/Storage';

export const AppInitContext = createContext(null);

export function AppInitProvider({ children }) {
  const { location } = useContext(LocationContext);

  useEffect(() => {
    if (!location) return;
    initService();
  }, [location]);

  const initService = async () => {
    // Create of load ID
    let id = await getData('id');
    if (!id) {
      id = uuid.v4();
      console.log('[AppInit] Creating Unique ID')
      await storeData('id', id);
    }

    // Notification permissions
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      console.log('[App] Permission:', result);

      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('[AppInit] Notification permission denied.');
        return;
      }
    }

    console.log(`[AppInit] Starting service with: ID(${id}) and Location(${location.latitude}) - (${location.longitude})`);

    NativeModules.ForegroundServiceModule.startService(
      id,
      location.latitude.toString(),
      location.longitude.toString(),
    );
  }

  return (
    <AppInitContext.Provider value={{}}>
      {children}
    </AppInitContext.Provider>
  )
}