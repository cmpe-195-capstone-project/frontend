import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const FALLBACK = { latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.08, longitudeDelta: 0.08 };

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(FALLBACK);
  const [status, setStatus] = useState('Booting…');

  useEffect(() => {
    (async () => {
      console.log('[Home] starting permission flow');
      if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        console.log('[Home] permission result:', res);
        if (res !== PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('Location permission denied. Showing default area.');
          return;
        }
      }
      getOneFix();
    })();
  }, []);

  const getOneFix = () => {
    console.log('[Home] calling Geolocation.getCurrentPosition');
    setStatus('Centering on your location…');
    Geolocation.getCurrentPosition(
      (pos) => {
        console.log('[Home] GPS OK:', JSON.stringify(pos));
        const { latitude, longitude } = pos.coords;
        const next = { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };
        setRegion(next);
        setStatus('');
        mapRef.current?.animateToRegion(next, 600);
      },
      (err) => {
        console.log('[Home] GPS ERROR:', err.code, err.message);
        setStatus(`GPS error (${err.code}). Showing default area.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={() => console.log('[Home] Map onMapReady')}
        onMapLoaded={() => console.log('[Home] Map onMapLoaded')}
        onRegionChangeComplete={(r) => console.log('[Home] region change:', r)}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Selected" />
      </MapView>

      {!!status && <Text style={styles.banner}>{status}</Text>}

      <TouchableOpacity style={styles.recenter} onPress={getOneFix}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>My Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  banner: {
    position: 'absolute', top: 16, alignSelf: 'center',
    backgroundColor: '#0009', color: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8
  },
  recenter: {
    position: 'absolute', right: 16, bottom: 24,
    backgroundColor: '#1e88e5', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10
  },
});
