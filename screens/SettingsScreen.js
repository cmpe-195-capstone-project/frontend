import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}><Text>👤  Account</Text></TouchableOpacity>
      <TouchableOpacity style={styles.option}><Text>🎧  Help & Support</Text></TouchableOpacity>
      <TouchableOpacity style={styles.option}><Text>❓  About</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  option: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
