import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import FirePrepScreen from './screens/FirePrepScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import {LocationProvider} from './context/LocationContext';
import {getData} from './utils/Storage';
import {Settings, FireExtinguisher, Home} from 'lucide-react-native';

export type RootTabParamList = {
  'Fire Prep': undefined;
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [finishedOnboarding, setFinishedOnboarding] = useState(false);

  useEffect(() => {
    const checkId = async () => {
      const id = await getData('id');
      if (id) {
        setFinishedOnboarding(true);
      }
    };

    checkId();
  }, []);

  return (
    <NavigationContainer>
      {!finishedOnboarding ? (
        <OnboardingScreen onDone={() => setFinishedOnboarding(true)} />
      ) : (
        <LocationProvider>
          <Tab.Navigator
            screenOptions={({route}) => ({
              headerShown: false,
              tabBarActiveTintColor: '#C89000',
              tabBarInactiveTintColor: '#5C4E3D',
              tabBarStyle: {
                height: 60,
                paddingBottom: 10,
                paddingTop: 14,
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#e0a600'
              },
              tabBarLabel: ({focused, color}) => {
                return (
                  <Text
                    style={{
                      color: focused ? '#C89000' : '#666',
                      fontWeight: focused ? '700' : '400',
                      fontSize: focused ? 14 : 12,
                      paddingTop: 4
                    }}>
                    {route.name}
                  </Text>
                );
              },
              tabBarIcon: ({focused, color}) => {
                if (route.name === 'Home') return <Home color={color} size={28}/>;
                if (route.name === 'Fire Prep') return <FireExtinguisher color={color} size={28}/>;
                if (route.name === 'Settings') return <Settings color={color} strokeWidth={2} size={28}/>;
              },
            })}>
            <Tab.Screen name="Fire Prep" component={FirePrepScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </LocationProvider>
      )}
    </NavigationContainer>
  );
}
