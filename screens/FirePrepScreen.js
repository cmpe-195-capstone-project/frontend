import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Modal, FlatList, Alert } from 'react-native';
import TopBar from '../components/TopBar'; 

export default function FirePrepScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);    
  const firePrepCategories = [
    {
      id: 'when-wildfire-begins',
      title: 'When Wildfire Begins',
      icon: require('../assets/checklist.png'),
      description: 'Actions to take when a wildfire starts',
      sections: [
        {
          sectionTitle: 'Monitor Official Alerts',
          items: [
            'Check your wildfire tracking app or map for real-time updates',
            'Keep your phone charged',
            'Obtain Power Bank if available'
          ]
        },
        {
          sectionTitle: 'Before Leaving',
          items: [
            'Wear Protective Clothing',
            'Long sleeves shirt',
            'Long Pants',
            'Sturdy Shoes',
            'Protective Masks',
            'Grab Essentials',
            'Documents (ID, Passports)',
            'Medication if applicable',
            'Wallet',
            'Flashlights',
            'Lock/Close all doors to minimize fire damage',
            'Obtain closest route to safety (Wildfire App, Google Map)'
          ]
        },
        {
          sectionTitle: 'If Driving Vehicle',
          items: [
            'Keep headlights on',
            'Close all ventilation vents',
            'Follow official escape routes, do not attempt to take shortcuts',
            'Maintain contact with official alerts for potential changes in situation'
          ]
        },
        {
          sectionTitle: 'If Trapped or Can\'t Evacuate',
          items: [
            'Move to room with minimal windows OR area without vegetation (dirt fields)',
            'If outdoors, find the nearest body of water or lie flat and cover with wet fabric',
            'Shut all windows and doors',
            'Block small gaps with wet towels or any applicable objects',
            'Fill buckets and sinks with water',
            'Keep flashlight and phone ready',
            'Stay low to avoid smoke inhalation'
          ]
        }
      ]
    },
    {
      id: 'wildfire-preparation',
      title: 'Wildfire Preparation',
      icon: require('../assets/checklist.png'),
      description: 'Plan ahead and prepare for wildfire season',
      sections: [
        {
          sectionTitle: 'Plan Ahead',
          items: [
            'Identify main escape routes and location of safe zones',
            'Identify optional exits in case main route is blocked',
            'Create family communication plans (in case of multiple afflicted areas)',
            'Identify local emergency alerts methods',
            'Download offline maps of your area',
            'Install emergency alert and wildfire tracking apps before fire season',
            'Learn basic fire suppression techniques for small spots of fire'
          ]
        },
        {
          sectionTitle: 'Prepare a GO-Bag',
          items: [
            'Copies or location of important documents (ID, Insurance, Passports, etc.)',
            'Medication & First-aid kits',
            'Flashlights',
            'Protective Masks (N95)',
            'Powerbank and Charging cables',
            'Water and Ready-to-eat food',
            'Cash',
            'Pet food and leashes if applicable'
          ]
        },
        {
          sectionTitle: 'Minimize Damage to Property',
          items: [
            'Regularly remove flammable vegetation within 30 feet of your home',
            'Clear debris off your roof and gutters',
            'Prepare garden hoses that can reach all areas of the property',
            'Before leaving, apply moisture around the property if time permits',
            'Know how to shut off gas, electricity, and water in emergency',
            'Keep fire extinguishers in accessible locations'
          ]
        }
      ]
    },
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

  const renderChecklistItem = ({ item, index }) => (
    <View style={styles.checklistItem}>
      <Text style={styles.checklistNumber}>{index + 1}.</Text>
      <Text style={styles.checklistText}>{item}</Text>
    </View>
  );

  const renderSectionItem = ({ item, sectionIndex }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{item.sectionTitle}</Text>
      {item.items.map((checklistItem, itemIndex) => (
        <View key={itemIndex} style={styles.checklistItem}>
          <Text style={styles.checklistNumber}>{itemIndex + 1}.</Text>
          <Text style={styles.checklistText}>{checklistItem}</Text>
        </View>
      ))}
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
          
          {selectedCategory?.sections ? (
            <FlatList
              data={selectedCategory.sections}
              renderItem={renderSectionItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.checklist}
              contentContainerStyle={styles.checklistContent}
            />
          ) : (
            <FlatList
              data={selectedCategory?.items || []}
              renderItem={renderChecklistItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.checklist}
            />
          )}
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
  checklistContent: { paddingBottom: 20 },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  checklistItem: { flexDirection: 'row', paddingVertical: 8 },
  checklistNumber: { fontWeight: 'bold', marginRight: 10 },
  checklistText: { flex: 1 }
});