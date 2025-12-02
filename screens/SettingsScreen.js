import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Linking, Alert } from 'react-native';
import {
  UserCircle,
  BadgeInfo,
  BadgeHelp,
  ChevronRight,
  Mail,
  Bug,
  Info
} from 'lucide-react-native';

import TopBar from '../components/TopBar';
import InfoModal from '../components/InfoModal';
import AboutContent from '../components/content/AboutContent';

export default function SettingsScreen() {
  const [aboutVisible, setAboutVisible] = useState(false);
  const [accountVisisble, setAccountVisisble] = useState(false);


  const openEmail = () => {
    Linking.openURL("mailto:emberalert.team@outlook.com?subject=Support");
  };

  const reportBug = () => {
    Linking.openURL(
      "mailto:emberalert.bugs@outlook.com?subject=Bug Report&body=Describe the issue here:"
    );
  };

  const openFAQ = () => {
    Alert.alert("FAQ", "Frequently Asked Questions page coming soon!");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar />

      <View style={styles.container}>


        <Text style={styles.section}>ACCOUNT</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.row}>
              <UserCircle size={22} color="#222" />
              <Text style={styles.txt}>Account</Text>
            </View>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>
        </View>


        <Text style={styles.section}>SUPPORT</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.option} onPress={openFAQ}>
            <View style={styles.row}>
              <BadgeHelp size={22} color="#222" />
              <Text style={styles.txt}>FAQ / Help</Text>
            </View>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={openEmail}>
            <View style={styles.row}>
              <Mail size={22} color="#222" />
              <Text style={styles.txt}>Contact Support</Text>
            </View>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={reportBug}>
            <View style={styles.row}>
              <Bug size={22} color="#222" />
              <Text style={styles.txt}>Report a Bug</Text>
            </View>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>


        </View>


        <Text style={styles.section}>APP INFORMATION</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.option} onPress={() => setAboutVisible(true)}>
            <View style={styles.row}>
              <BadgeInfo size={22} color="#222" />
              <Text style={styles.txt}>About</Text>
            </View>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>


        </View>


        <View style={styles.footer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.name}>Ember Alert</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <InfoModal
          visible={aboutVisible}
          modalTitle={"About"}
          onClose={() => setAboutVisible(false)}
          children={<AboutContent />}
        />

      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  container: {
    flex: 1,
    padding: 20,
  },

  section: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  txt: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },

  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 25,
  },

  logo: {
    width: 40,
    height: 48,
    resizeMode: 'contain',
  },

  name: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
    color: '#333',
  },

  version: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

});
