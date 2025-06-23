// Importerer relevante biblioteker og de sider der skal vises i appen
import {useEffect} from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PushNotification from 'react-native-push-notification';
import Touchables from './screens/Touchables';
import BrugerScreen from './screens/BrugerScreen';
import PersonaleScreen from './screens/PersonaleScreen';
import Information from './screens/Information';
import './firebaseConfig1';
import './database';
import './NotificationService';

// Til at kunne komme til de forskellige sider
const Stack = createNativeStackNavigator();

// Opret kanal ved app-start (kun én gang)
PushNotification.createChannel(
  {
    channelId: "alarm-channel", // skal matche showLocalNotification
    channelName: "Alarm Kanal",
    channelDescription: "Viser fald-relaterede advarsler",
    importance: 4, // Max importance
    vibrate: true,
  },
  (created) => console.log(`Kanal oprettet: ${created}`) // true hvis ny, false hvis eksisterer
);

export default function App() {
  
  // Spørger om tilladelse til at vise push notifikationer
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        .then((result) => {
          console.log('Notification permission:', result);
        });
    }
  }, []);

  // De skærme appen kan navigere imellem
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Touchables} />
        <Stack.Screen name="Wearer" component={BrugerScreen} />
        <Stack.Screen name="Caregiver/Relatives" component={PersonaleScreen} />
        <Stack.Screen name="Information" component={Information} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}