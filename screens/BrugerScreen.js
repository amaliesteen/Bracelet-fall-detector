import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useBLE from './useBLE';
import { updateConnection, reverseGeocode, updateLocation, updateFall, updateFallTime } from '../database';
import { getCurrentLocation } from '../Lokation';
import BackgroundService from 'react-native-background-actions';

export default function HomeScreen() {
  const {
    isConnected,
    manuallyDisconnected,
    scanDevices,
    reconnectDevice,
    disconnectDevice,
    message,
    recievedTime,
    connectedDevice,
  } = useBLE(); // Henter de definerede konstanter fra filen: useBLE

  // Definerer kostanter for lokationen
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);

  useEffect(() => {
    scanDevices(); // Scanner efter BLE enheder 

  }, []);

  // Der sættes et interval så hvert 60 sekund, hvis telefonen ikke er forbundet til en anden enhed 
  // og ikke er blevet afbrudt manuelt, så skal den scanne efter BLE enheder igen
  useEffect(() => {
  const interval = setInterval(() => {
    if (!isConnected && !manuallyDisconnected) {
      console.log("🔍 Ikke forbundet - prøver at scanne igen...");
      scanDevices();
    }
  }, 60000); // hvert 60. sekund

  return () => clearInterval(interval);

}, [isConnected, manuallyDisconnected]);

  // Funktionen updateFall køres
  useEffect(() => {
    updateFall(message);
  }, [message]);

  // Funktionen updateFallTime køres
  useEffect(() => {
    updateFallTime(recievedTime);
  }, [recievedTime])

  // Opretter funktion til at hente adressen
  async function fetchLocationAndAddress() {
    try {
      const loc = await getCurrentLocation(); //Henter lokation
      if (loc) {
        const coords = loc.coords;
        setLocation(coords); // Sætter koordinaterne
    
        const addr = await reverseGeocode(coords.latitude, coords.longitude); // Ændrer fra koordinater til adresse     
        setAddress(addr); // Sætter adressen

        if (addr) {
          await updateLocation(addr); //Updaterer lokationen i Firestore
        }
      }
    } catch (err) {
      console.log("Error getting location or address: ", err);
    }
  };

  // Kører funktionen fetchLocationAndAddress når der bliver modtaget en besked som er et "y" og hasFethedLocation er falsk
  // Dette sørger for at lokationen kun bliver hentet en gang
  useEffect(() => {
    if (message === 'y' && !hasFetchedLocation) {
      fetchLocationAndAddress();
      setHasFetchedLocation(true);
    }
  }, [message, hasFetchedLocation]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Definerer et delay

  // Opretter baggrundsopgave
  const backgroundTask = async (taskData) => {
    const { delay } = taskData;
    console.log('[BackgroundActions] Baggrundsopgave startet');
    while (BackgroundService.isRunning()) { // Mens BackgroundService er igang kører den: updateConnection, updateFall, updateFallTime, updateLocation 
      await updateConnection(isConnected);
      if (isConnected) {
        await updateFall(message);
        await updateFallTime(recievedTime);

        if (message === 'y' && !hasFetchedLocationInBackground) {
          console.log("📍 Henter lokation fra baggrunden...");
          await fetchLocationAndAddress();
          hasFetchedLocationInBackground = true;
        }

        if (message !== 'y') {
          hasFetchedLocationInBackground = false;
        }
      } 
      await sleep(delay); // delayet er sat i backgroundOptions, funktionerne kører hvert 60. sekund
    }
  };

  // Opsætning af baggrundsopgave - viser i notifikationscenteret på telefonen at appen kører i baggrunden
  const backgroundOptions = {
    taskName: 'FallMonitor',
    taskTitle: 'Fall detection active',
    taskDesc: 'The app runs in the background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff0000',
    parameters: {
      delay: 60000, // 60 sekunder
    },
  };

  // Kører baggrundsopave
  useEffect(() => {
    const startService = async () => {
      const isRunning = await BackgroundService.isRunning();
      if (!isRunning) {
        await BackgroundService.start(backgroundTask, backgroundOptions);
      }
    };

    startService();

    return () => {
      BackgroundService.stop();
    };
  }, []);

  // Opsætning af layout i appen - hvad bliver vist
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Connected to phone: {isConnected ? `Yes` : 'No'}{'\n'}{'\n'}Device: {isConnected && connectedDevice ? connectedDevice.name : ''}</Text>
      </View>
      <View style={styles.box2}>
        <Text style={styles.title}>Connected to home: {!isConnected ? `Yes` : 'No'}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
        onPress={disconnectDevice}
        disabled={!isConnected}
        style={[
          styles.button,
          !isConnected && styles.buttonDisabled]}>
        <Text style={[styles.button_text, !isConnected && styles.buttonTextDisabled]}>
          Disconnect</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={manuallyDisconnected ? reconnectDevice : null}
          style={[styles.button, !manuallyDisconnected && styles. buttonDisabled]}
          disabled={!manuallyDisconnected}>
          <Text style={[styles.button_text, !manuallyDisconnected && styles.buttonTextDisabled]}>
            Reconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Her sættes udseende, fx. farver, skriftstørrelse, placering af tekst, bokse og knapper
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: "skyblue",
    width: "90%",
    height: "25%",
    marginTop: "60%",
    borderRadius: 10,
    justifyContent: "center",
  },
  box2: {
    backgroundColor: "skyblue",
    width: "90%",
    height: "15%",
    marginTop: "5%",
    borderRadius: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
    fontFamily: "monospace",
    padding: 20,
  },
  button_text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "white",
    fontFamily: "monospace",
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: "90%",
    alignItems: "center",
  },
  button: {
    flex: 1,
    height: "70%",
    backgroundColor: 'steelblue',
    borderRadius: 10,
    marginVertical: "5%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonTextDisabled: {
    color: '#666',
  },
});