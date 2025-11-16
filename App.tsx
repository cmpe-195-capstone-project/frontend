import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import FirePrepScreen from './screens/FirePrepScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import {LocationProvider} from './context/LocationContext';

export type RootTabParamList = {
  'Fire Prep': undefined;
  Home: undefined;
  Alerts: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [finishedOnboarding, setFinishedOnboarding] = useState(false);

  return (
    <NavigationContainer>
      {!finishedOnboarding ? (
        <OnboardingScreen
          onDone={() => setFinishedOnboarding(true)}
        />
      ) : (
        <LocationProvider>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Fire Prep" component={FirePrepScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Alerts" component={AlertsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </LocationProvider>
      )}
    </NavigationContainer>
  );
}
