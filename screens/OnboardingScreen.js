import React from "react";
import uuid from "react-native-uuid";
import { View, Text, Button, PermissionsAndroid, Platform, NativeModules } from "react-native";

import { storeData, getData } from "../utils/Storage";

export default function OnboardingScreen({ onDone }) {

  const requestPermissions = async () => {
    // Notifications
    console.log('[Onboarding] Setting notification permissions...');

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const notif = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (notif !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('[Onboarding] Notification permission denied.');
        return;
      }

      console.log('[Onboarding] Notification Permission:', notif);
    }

    // Location
    console.log('[Onboarding] Setting location permissions...');
    const loc = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (loc !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('[Onboarding] Location permission denied.');
      return;
    }
    console.log('[Onboarding] Location Permission:', loc);

    await initForegroundService();
    onDone(); 
  };

  const initForegroundService = async () => {
    let id = await getData("id");
    if (!id) {
      id = uuid.v4();
      await storeData("id", id);
    }
    console.log('[Onboarding] Service starting with ID: ' + id);
    NativeModules.ForegroundServiceModule.startService(id);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Welcome to Ember Alert</Text>
      <Button title="Enable Permissions" onPress={requestPermissions} />
    </View>
  );
}
