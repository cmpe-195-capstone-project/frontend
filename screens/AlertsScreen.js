import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import TopBar from '../components/TopBar';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      title: `Alert Option ${i + 1}`,
      address: '1234 Default St.',
      enabled: true,
    }))
  );

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedAlert) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === selectedAlert.id ? selectedAlert : a))
      );
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.title}>Manage Alerts</Text>
        <Text style={styles.subtitle}>Take control of your alerts.</Text>

        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.item}>
              <View>
                <Text style={styles.label}>{item.title}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={(value) =>
                  setAlerts((prev) =>
                    prev.map((a) =>
                      a.id === item.id ? { ...a, enabled: value } : a
                    )
                  )
                }
              />
            </TouchableOpacity>
          )}
        />

        {/* pop up for editing alerts */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Edit Alert</Text>
              <TextInput
                style={styles.input}
                value={selectedAlert?.title}
                onChangeText={(text) =>
                  setSelectedAlert((prev) => ({ ...prev, title: text }))
                }
                placeholder="Alert Name"
              />
              <TextInput
                style={styles.input}
                value={selectedAlert?.address}
                onChangeText={(text) =>
                  setSelectedAlert((prev) => ({ ...prev, address: text }))
                }
                placeholder="Alert Address"
              />
              <Button title="Save" onPress={handleSave} />
              <Button
                title="Cancel"
                color="gray"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f3fb' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'black' },
  subtitle: { fontSize: 20, marginBottom: 20, textAlign: 'center', color: 'black' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FDF7FF',
  },
  label: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 14, color: '#555' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
});