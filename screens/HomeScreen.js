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
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle } from 'react-native-maps';
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

// --- radius helpers ---
const ACRE_TO_M2 = 4046.8564224;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const getRadiusMeters = (f) => {
  if (typeof f.radius_meters === 'number') return f.radius_meters;
  const areaM2 = Math.max(1, (f.acres_burned || 1) * ACRE_TO_M2);
  const r = Math.sqrt(areaM2 / Math.PI);
  return clamp(r, 120, 2500);
};

const baseColorFor = (f) =>
  f.is_active && !f.final ? [255, 64, 0] : [30, 150, 30];

const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

const GRADIENT_LAYERS = [
  [1.0, 0.18],
  [0.72, 0.28],
  [0.48, 0.4],
  [0.28, 0.55],
  [0.12, 0.75],
];

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [fireSpots, setFireSpots] = useState([]);
  const [loadingFires, setLoadingFires] = useState(false);
  const [region, setRegion] = useState(FALLBACK);
  const [status, setStatus] = useState('Booting…');

  // simulate panel state
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
          // still load fires for the default area
          fetchFires('Santa Clara');
          return;
        }
      }
      getOneFix();
    })();
  }, []);

  const animateTo = (next) => {
    setRegion(next);
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(next, 600);
    }
  };

  const fetchFires = async (county = 'Santa Clara') => {
    try {
      setLoadingFires(true);
      const url = `${API_BASE}/server/fires?county=${encodeURIComponent(county)}`;
      if (__DEV__) {
        console.log('[frontend] GET', url);
      }
      const res = await fetch(url);
      const text = await res.text();
      let data = [];
      try {
        data = JSON.parse(text);
      } catch {
        console.warn('[frontend] non-JSON response:', text.slice(0, 200));
      }
      if (__DEV__) {
        console.log(
          '[frontend] status=',
          res.status,
          'rows=',
          Array.isArray(data) ? data.length : 0
        );
      }
      setFireSpots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[frontend] fetchFires network error:', err?.message || err);
      setFireSpots([]);
    } finally {
      setLoadingFires(false);
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
      },
      (err) => {
        console.log('[Home] GPS ERROR:', err.code, err.message);
        setStatus(`GPS error (${err.code}). Showing default area.`);
        // still load fires for the default area
        fetchFires('Santa Clara');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

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
        // 👇 no more bbox fetching here – just track region
        onRegionChangeComplete={(r) => {
          setRegion(r);
        }}
        onLongPress={handleLongPress}
      >
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title={simulate ? 'Simulated' : 'Selected'}
        />

        {fireSpots.map((f, idx) => {
          const center = {
            latitude: Number(f.latitude),
            longitude: Number(f.longitude),
          };
          const R = getRadiusMeters(f);
          const rgb = baseColorFor(f);

          return (
            <React.Fragment key={f.id ?? `${center.latitude},${center.longitude},${idx}`}>
              {GRADIENT_LAYERS.map(([m, a], i) => (
                <Circle
                  key={`${f.id || idx}-layer-${i}`}
                  center={center}
                  radius={R * m}
                  strokeWidth={0}
                  fillColor={rgba(rgb, a)}
                  zIndex={1}
                />
              ))}

              <Marker coordinate={center} opacity={0}>
                <Callout tooltip>
                  <View style={{ backgroundColor: '#111', padding: 8, borderRadius: 8 }}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{f.name}</Text>
                    <Text style={{ color: '#fff' }}>
                      {f.county} • {Math.round(f.acres_burned || 0)} acres •{' '}
                      {Math.round(f.percent_contained || 0)}% contained
                    </Text>
                  </View>
                </Callout>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>

      {!!status && (
        <Text style={styles.banner}>
          {loadingFires ? `${status} • Loading fires…` : status}
        </Text>
      )}

      <TouchableOpacity style={styles.recenter} onPress={getOneFix}>
        <Text style={styles.btnText}>My Location</Text>
      </TouchableOpacity>

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
          <TouchableOpacity style={styles.setBtn} onPress={setFromInputs} disabled={!simulate}>
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

// styles
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
