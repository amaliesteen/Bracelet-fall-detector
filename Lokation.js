import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

// Spørger om tilladelse til lokation
export const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This App needs to access your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  
  // Funktion til at hente telefonens lokation
  export const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission(); // Spørger om tilladelse
    if (!hasPermission) return null;
  
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition( // Henter lokation
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true, // Gør så den bruger telefonens GPS først, hvis det er muligt
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  };