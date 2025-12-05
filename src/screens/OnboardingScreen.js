import React, { useState, useEffect } from "react";
import uuid from "react-native-uuid";
import { View, Text, Button, PermissionsAndroid, Platform, NativeModules, TouchableOpacity, StyleSheet } from "react-native";

import { storeData, getData } from "../utils/Storage";
import { ImageBackground } from "react-native";

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
    <ImageBackground
      source={require("../assets/background.png")}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.overlay}>

        <Text style={styles.title}>Welcome to Ember Alert</Text>

        <Text style={styles.subtitle}>
          We need permission to enable wildfire alerts and location-based warnings.
        </Text>

        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={{ color: '#222', fontWeight: '600', fontSize: 16 }} >Enable Permissions</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0,0,0,0.35)'
  },
  subtitle: {
    fontSize: 15,
    color: '#F3F4F6',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 28,
    textAlign: 'center',
  },
  button: {
    width: '75%',
    paddingVertical: 14,
    backgroundColor: '#FFC700',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

    // subtle shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  }
})
