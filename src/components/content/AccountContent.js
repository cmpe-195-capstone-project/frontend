import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput
} from 'react-native';
import { ChevronRight } from "lucide-react-native";
import { getData, storeData } from '../../utils/Storage';


export default function AccountSettings() {
  useEffect(() => {
    const loadRadius = async () => {
      const storedValue = await getData('radius');
      console.log(storedValue)
      if (storedValue) {
        setRadius(storedValue);
      }
    };
    loadRadius();
  }, [])

  const [radius, setRadius] = useState('');

  const normalizeRadius = (value) => {
    // strip non-digits
    const sanitized = value.replace(/\D/g, "")
    if (!sanitized) return "0"

    if (sanitized <= 0 || sanitized > 40) return "0"

    // round to nearest integer
    const parsed = Math.round(Number(sanitized))
    return parsed.toString()
  };

  const handleSavingRadius = async () => {
    await storeData('radius', radius);
  }

  return (
    <View style={{ padding: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>


        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openSettings()}>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.subLabel}>
                Control wildfire alerts from system settings.
              </Text>
            </View>
            <ChevronRight size={18} color="#888" />
          </TouchableOpacity>


          <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8, }} />


          <TouchableOpacity style={styles.row} onPress={() => Linking.openSettings()}>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Location Access</Text>
              <Text style={styles.subLabel}>
                Adjust location permissions to recieve incident alerts/info near you.
              </Text>
            </View>
            <ChevronRight size={18} color="#888" />
          </TouchableOpacity>
        </View>


        <Text style={styles.sectionTitle}>Alert Radius</Text>

        <View style={styles.card}>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Distance (in miles)</Text>
          </View>
          <Text style={styles.subLabel}>
            Choose how far away wildfire alerts should trigger. Recommended: 5-30.
          </Text>

          <View style={styles.radiusInputRow}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="e.g. 10"
              value={radius}
              onChangeText={(v) => setRadius(normalizeRadius(v))}
            />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#444' }}>mi</Text>
          </View>

          <Text style={{marginTop: 10, fontSize: 12,color: '#6B7280' }}>
            Alerts will notify you when incidents occur within this distance.
          </Text>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSavingRadius}>
            <Text style={{ color: 'black', fontWeight: '600', fontSize: 14,}}>Save Radius</Text>
          </TouchableOpacity>
        </View>


        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        <View style={styles.card}>
          <Text style={styles.subLabel}>
            Ember Alert does not create user accounts and does not store personal information.
          </Text>
          <Text style={[styles.subLabel, { marginTop: 8 }]}>
            All preferences and data stay on your device.
          </Text>
        </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2563EB10',
  },
  radiusInputRow: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
    justifyContent: 'center'
  },

  saveBtn: {
    marginTop: 14,
    backgroundColor: '#FEBA01',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },

  textBlock: {
    flex: 1,
    paddingRight: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },

  subLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2563EB10',
    borderColor: '#2563EB',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
