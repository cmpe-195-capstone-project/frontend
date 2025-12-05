import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function TopBar() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Ember <Text style={styles.alert}>Alert</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 85,
    backgroundColor: '#F8C02D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    elevation: 4,
    zIndex: 100,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderBottomWidth: 2,
    borderBlockColor: '#e0a600',

  },
  logo: {
    width: 39,
    height: 47,
    marginRight: 8,
  },
  title: {
    fontSize: 30,
    paddingLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  alert: {
    color: 'black',
    fontWeight: 'normal',
  },
});
