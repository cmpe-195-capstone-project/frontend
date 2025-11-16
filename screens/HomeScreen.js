import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import { LocationContext, FALLBACK } from '../context/LocationContext';


export default function HomeScreen() {
  const { location, refresh, status } = useContext(LocationContext);
  const mapRef = useRef(null);
  const [region, setRegion] = useState(FALLBACK);

  useEffect(() => {
    if (location) {
      setRegion(location);
      mapRef.current?.animateToRegion(location, 600);
    }
  }, [location]);

  const recenter = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(next);
        mapRef.current?.animateToRegion(next, 600);
      },
      () => refresh(),
      { enableHighAccuracy: true }
    );
  };

  const getOneFix = () => {
    console.log('[Home] calling Geolocation.getCurrentPosition');
    Geolocation.getCurrentPosition(
      (pos) => {
        console.log('[Home] GPS OK:', JSON.stringify(pos));
        const { latitude, longitude } = pos.coords;
        const next = { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };
        setRegion(next);
        // setStatus('');
        mapRef.current?.animateToRegion(next, 600);
      },
      (err) => {
        console.log('[Home] GPS ERROR:', err.code, err.message);
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
        <Marker coordinate={region} title="Selected" />
      </MapView>

      {!!status && <Text style={styles.banner}>{status}</Text>}

      <TouchableOpacity style={styles.recenter} onPress={recenter}>
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
