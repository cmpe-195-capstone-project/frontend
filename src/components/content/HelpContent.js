import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

export default function HelpContent() {
  const faqData = [
    {
      q: "How does Ember Alert work?",
      a: "Ember Alert provides updates about wildfire activity near your area. Alerts are based on public fire incident data and official sources."
    },
    {
      q: "What areas are currently supported?",
      a: "Right now Ember Alert focuses on Santa Clara County. As the app grows, we aim to expand to the entire state of California."
    },
    {
      q: "Do I need an account?",
      a: "No. Ember Alert is designed to work without accounts. Any preferences stay on your device."
    },
    {
      q: "What data do you collect?",
      a: "Ember Alert requests location access to show alerts in your area. We never store personal information, and your location does not leave your device or get shared with third parties."
    },
    {
      q: "Who made Ember Alert?",
      a: "A small team passionate about safety, technology, and helping California communities stay safe."
    },
    {
      q: "How do I report a bug or suggestion?",
      a: "Send us an email at: emberalert.bugs@outlook.com"
    },
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <FlatList
        data={faqData}
        keyExtractor={(item, idx) => idx.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.block}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  block: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },

  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
