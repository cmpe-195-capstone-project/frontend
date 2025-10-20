import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Modal, FlatList, Alert } from 'react-native';
import TopBar from '../components/TopBar'; 

export default function FirePrepScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);    
  const firePrepCategories = [  // ADD THIS ENTIRE SECTION
    {
      id: 'ready-bag',
      title: 'Fire Ready Bag',
      icon: require('../assets/bag.png'),
      description: 'Essential items for evacuation',
      items: [
        'Important documents (ID, insurance, deeds)',
        'Prescription medications (7-day supply)',
        'First aid kit',
        'Flashlight and extra batteries',
        'Cell phone and charger',
        'Cash and credit cards',
        'Emergency contact list',
        'Pet supplies (if applicable)',
        'Change of clothes',
        'Water (1 gallon per person)',
        'Non-perishable food (3-day supply)',
        'Personal hygiene items'
      ]
    },
    {
      id: 'pre-evac',
      title: 'Pre-Evacuation Steps',
      icon: require('../assets/checklist.png'),
      description: 'Actions to take before evacuation',
      items: [
        'Close all windows and doors',
        'Remove flammable materials from around house',
        'Turn off gas, electricity, and water',
        'Move vehicles to safe location',
        'Prepare emergency kit and documents',
        'Inform family members of evacuation plan',
        'Check emergency radio for updates',
        'Secure outdoor furniture and decorations',
        'Clear gutters and roof of debris',
        'Keep garden hoses connected and ready',
        'Park car facing exit direction',
        'Prepare pets for evacuation'
      ]
    },
    {
      id: 'home-prep',
      title: 'Home Preparation',
      icon: require('../assets/checklist.png'),
      description: 'Long-term home fire safety',
      items: [
        'Create 30-foot defensible space around home',
        'Trim trees and remove dead vegetation',
        'Install spark arresters on chimneys',
        'Use fire-resistant roofing materials',
        'Install dual-pane windows',
        'Clear debris from roof and gutters',
        'Store firewood away from house',
        'Install smoke detectors on every level',
        'Have fire extinguishers readily available',
        'Create multiple evacuation routes',
        'Install emergency lighting',
        'Keep important documents in fire-safe box'
      ]
    },
    {
      id: 'santa-clara-resources',
      title: 'Santa Clara Emergency Resources',
      icon: require('../assets/checklist.png'),
      description: 'Local food banks, shelters & emergency services',
      items: [
        'Santa Clara County Emergency Operations Center: (408) 299-2500',
        'American Red Cross Silicon Valley: (408) 577-1000',
        'Second Harvest Food Bank: (408) 266-8866',
        'Sacred Heart Community Service: (408) 278-2160',
        'Loaves & Fishes Family Kitchen: (408) 293-2550',
        'Martha\'s Kitchen: (408) 293-6111',
        'Santa Clara County Animal Services: (408) 686-3900',
        'CalFire Santa Clara Unit: (408) 779-0930',
        'Santa Clara County Fire Department: (408) 378-4010',
        'Emergency Shelter Hotline: 211',
        'Santa Clara County Office of Emergency Services',
        'Local evacuation centers (check county website)'
      ]
    }
  ];   
  const handleCategoryPress = (category) => {  // ADD THIS FUNCTION
    setSelectedCategory(category);
    setShowModal(true);
  };

  const renderChecklistItem = ({ item, index }) => (  // ADD THIS FUNCTION
    <View style={styles.checklistItem}>
      <Text style={styles.checklistNumber}>{index + 1}.</Text>
      <Text style={styles.checklistText}>{item}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.screen}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.title}>Prepare for Wildfires</Text>
        <Text style={styles.subtitle}>Stay ready. Stay safe.</Text>

        <View style={styles.grid}>
          {firePrepCategories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.card} 
              onPress={() => handleCategoryPress(category)}
            >
              <Image source={category.icon} style={styles.boximg} />
              <Text style={styles.cardText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
            {/* Modal for checklist */}
            <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={selectedCategory?.items || []}
            renderItem={renderChecklistItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.checklist}
          />
        </SafeAreaView>
      </Modal>
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
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { fontSize: 24, color: '#666' },
  checklist: { padding: 20 },
  checklistItem: { flexDirection: 'row', paddingVertical: 8 },
  checklistNumber: { fontWeight: 'bold', marginRight: 10 },
  checklistText: { flex: 1 }
});