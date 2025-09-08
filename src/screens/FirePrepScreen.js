import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import TopBar from '../src/components/TopBar'; 

export default function FirePrepScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.title}>Prepare for Wildfires</Text>
        <Text style={styles.subtitle}>Stay ready. Stay safe.</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Image source={require('../assets/bag.png')} style={styles.boximg} />
            <Text style={styles.cardText}>Fire Ready Bag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Image source={require('../assets/checklist.png')} style={styles.boximg} />
            <Text style={styles.cardText}>Pre Evac Preparation Steps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>Add More As Necessary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, color: 'black', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'black', textAlign: 'center', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: '#FFD54F',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardText: {
    paddingTop: 10,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  boximg: {
    width: 84,
    height: 84,
    alignSelf: 'center',
  },
});