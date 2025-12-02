import React, { Children } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function InfoModal({ visible, modalTitle, onClose, children }) {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{modalTitle}</Text>
          <View style={{ width: 22 }} /> 
        </View>

        <View style={styles.body}>
          {children} 
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },

  body: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },

});
