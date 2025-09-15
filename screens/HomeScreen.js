import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { LogBox } from 'react-native';

  if (__DEV__) {
    LogBox.ignoreAllLogs(true);
  }

const API_BASE = __DEV__ ? 'http://10.0.2.2:8000' : 'https://YOUR_API_DOMAIN';

const FALLBACK = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [fireSpots, setFireSpots] = useState([]);
  const [loadingFires, setLoadingFires] = useState(false);
  const [region, setRegion] = useState(FALLBACK);
  const [status, setStatus] = useState('Booting…');

  // manually set long and lats
  const [simulate, setSimulate] = useState(false);
  const [latInput, setLatInput] = useState(String(FALLBACK.latitude));
  const [lngInput, setLngInput] = useState(String(FALLBACK.longitude));

  useEffect(() => {
    (async () => {
      console.log('[Home] starting permission flow');
      if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('[Home] permission result:', res);
        if (res !== PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('Location permission denied. Showing default area.');
          return;
        }
      }
      getOneFix();
    })();
  }, []);

  const animateTo = (next) => {
    setRegion(next);
    if (mapRef.current && mapRef.current.animateToRegion) {
      mapRef.current.animateToRegion(next, 600);
    }
  };

  //getting fires
  const fetchFires = async (county = 'Santa Clara') => {
    try {
      const url = `${API_BASE}/server/fires?county=${encodeURIComponent(county)}`;
      console.log(`[frontend] GET ${url}`);
      const res = await fetch(url);
      const text = await res.text(); 
      let data = [];
      try { data = JSON.parse(text); } catch {
        console.warn('[frontend] non-JSON response:', text.slice(0, 200));
      }
      console.log(`[frontend] status=${res.status}, rows=${Array.isArray(data) ? data.length : 0}`);
      setFireSpots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[frontend] fetchFires network error:', err?.message || err);
      setFireSpots([]);
    }
  };

  let bboxTimer;
  const onRegionChangeComplete = (r) => {
    setRegion(r);
    if (bboxTimer) clearTimeout(bboxTimer);
    bboxTimer = setTimeout(() => {
      fetchFiresInBox(r, 'Santa Clara')
        .catch((err) => console.error('[frontend] bbox fetch unhandled:', err?.message || err));
    }, 400);
  };

  useEffect(() => () => { if (bboxTimer) clearTimeout(bboxTimer); }, []);


  const regionToBBox = (r) => ({
    minLat: r.latitude - r.latitudeDelta / 2,
    maxLat: r.latitude + r.latitudeDelta / 2,
    minLng: r.longitude - r.longitudeDelta / 2,
    maxLng: r.longitude + r.longitudeDelta / 2,
  });

  const fetchFiresInBox = async (region, county = 'Santa Clara') => {
    const { minLat, minLng, maxLat, maxLng } = regionToBBox(region);
    console.log(`[frontend] Fetching bbox fires: box=(${minLat},${minLng})→(${maxLat},${maxLng}) county=${county}`);
    try {
      const qs = new URLSearchParams({ minLat, minLng, maxLat, maxLng, county }).toString();
      const url = `${API_BASE}/server/fires/box?${qs}`;
      console.log(`[frontend] GET ${url}`);
      const res = await fetch(url);
      const data = await res.json();
      console.log(`[frontend] status=${res.status}, rows=${Array.isArray(data) ? data.length : 0}`);
      setFireSpots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[frontend] fetchFiresInBox error:', err?.message || err);
    }
};

  const getOneFix = () => {
    console.log('[Home] calling Geolocation.getCurrentPosition');
    setStatus('Centering on your location…');
    Geolocation.getCurrentPosition(
      (pos) => {
        console.log('[Home] GPS OK:', JSON.stringify(pos));
        const { latitude, longitude } = pos.coords;
        const next = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setStatus('');
        animateTo(next);
        fetchFires('Santa Clara');
        //fetchFiresInBox(next, 'Santa Clara');
      },
      (err) => {
        console.log('[Home] GPS ERROR:', err.code, err.message);
        setStatus(`GPS error (${err.code}). Showing default area.`);
        fetchFires('Santa Clara');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        forceRequestLocation: true, // Android-only
        showLocationDialog: true,   // Android-only
      }
    );
  };

  // set location from inputs
  const setFromInputs = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setStatus('Invalid coordinates. Use lat ∈ [-90,90], lng ∈ [-180,180].');
      return;
    }
    setStatus('');
    animateTo({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    Keyboard.dismiss();
  };

  // detect user input (long press)
  const handleLongPress = (e) => {
    if (!simulate) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatInput(latitude.toFixed(6));
    setLngInput(longitude.toFixed(6));
    animateTo({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

    return (
      <View style={styles.container}>
        <MapView
          ref={(r) => (mapRef.current = r)}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          region={region}
          showsUserLocation
          showsMyLocationButton={false}
          onRegionChangeComplete={(r) => {
            setRegion(r);
            fetchFiresInBox(r, 'Santa Clara');
          }}
          onLongPress={handleLongPress}
        >
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title={simulate ? 'Simulated' : 'Selected'}
          />

          {/* fire spots */}
          {fireSpots.map((f) => (
            <Marker
              key={f.id}
              coordinate={{ latitude: f.latitude, longitude: f.longitude }}
              title={f.name}
              description={`${f.county} • ${Math.round(f.acres_burned)} acres • ${Math.round(f.percent_contained)}% contained`}
              pinColor={f.is_active && !f.final ? 'red' : 'green'}
            />
          ))}
        </MapView>

        {!!status && (
          <Text style={styles.banner}>
            {loadingFires ? `${status} • Loading fires…` : status}
          </Text>
        )}

        {/* GPS recenter */}
        <TouchableOpacity style={styles.recenter} onPress={getOneFix}>
          <Text style={styles.btnText}>My Location</Text>
        </TouchableOpacity>

        {/* simulate option box */}
        <View style={styles.simPanel}>
          <TouchableOpacity
            onPress={() => setSimulate((v) => !v)}
            style={[styles.toggle, simulate ? styles.toggleOn : styles.toggleOff]}
          >
            <Text style={styles.btnText}>
              {simulate ? 'Simulating: ON' : 'Simulate: OFF'}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.label}>Lat</Text>
            <TextInput
              style={styles.input}
              value={latInput}
              onChangeText={setLatInput}
              keyboardType="numeric"
              placeholder="Latitude"
              placeholderTextColor="#999"
            />
            <Text style={[styles.label, { marginLeft: 8 }]}>Lng</Text>
            <TextInput
              style={styles.input}
              value={lngInput}
              onChangeText={setLngInput}
              keyboardType="numeric"
              placeholder="Longitude"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.setBtn}
              onPress={setFromInputs}
              disabled={!simulate}
            >
              <Text style={styles.btnText}>Set</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            {simulate
              ? 'Long-press the map to pick a point, or enter coordinates and press Set.'
              : 'Turn ON Simulate to type coords or long-press the map.'}
          </Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eef' },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    banner: {
      position: 'absolute',
      top: 16,
      alignSelf: 'center',
      backgroundColor: '#0009',
      color: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    recenter: {
      position: 'absolute',
      right: 16,
      bottom: 24,
      backgroundColor: '#1e88e5',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      zIndex: 2,
    },
    btnText: { color: '#fff', fontWeight: 'bold' },

    // Simulate panel
    simPanel: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 24,
      backgroundColor: '#000B',
      padding: 10,
      borderRadius: 12,
      zIndex: 1,
    },
    toggle: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      marginBottom: 8,
    },
    toggleOn: { backgroundColor: '#2e7d32' },
    toggleOff: { backgroundColor: '#6d6d6d' },
    row: { flexDirection: 'row', alignItems: 'center' },
    label: { color: '#fff', marginRight: 6, fontWeight: '600' },
    input: {
      flexGrow: 1,
      minWidth: 90,
      height: 38,
      paddingHorizontal: 8,
      backgroundColor: '#222',
      color: '#fff',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#444',
    },
    setBtn: {
      marginLeft: 8,
      backgroundColor: '#1e88e5',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
    },
    hint: { color: '#ccc', marginTop: 6, fontSize: 12 },
  });