import { View, Text, Image, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native'
import React from 'react'

export default function AboutContent() {
  return (
    <View style={{ padding: 1, paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

        <Text style={styles.text}>
          Ember Alert is a lightweight mobile application designed to keep people
          informed about important alerts in their area regarding fires.
        </Text>
        <Text style={styles.text}>
          California experiences some of the most frequent and severe wildfire seasons
          in the country. These wildfirescause billions in property loss and endanger
          public safety.
        </Text>
        <Text style={styles.text}>
          Ember Alert seeks to help mitigate these impacts by improving
          awareness and early response. We are currently focused on the Santa Clara
          County region, with plans to scale statewide across California so every
          Californian has a better chance to stay informed and stay safe.
        </Text>
        <Text style={styles.text}>
          We respect privacy — no accounts, and your data stays on your device.
        </Text>
        <Text style={styles.text}>
          Built by a small team passionate about safety and tech and helping people in need.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  text: {
    paddingTop: 15,
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 12,
    lineHeight: 25
  },

  version: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 13,
    color: '#999',
  },
})