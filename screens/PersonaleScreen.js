import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db, realtimeDb } from '../firebaseConfig1';
import { ref, onValue, update } from 'firebase/database';
import { showLocalNotification } from '../NotificationService';
import BackgroundService from 'react-native-background-actions';

const PersonaleScreen = ({ navigation }) => {
  // Definerer konstanter
  const [userFall, setUserFall] = useState('');
  const [userConnected, setUserConnected] = useState(false);
  const [userBeacon, setUserBeacon] = useState('');
  const [hasFetchUser, setHasFetchUser] = useState(false);
  const lastFallRef = useRef('');
  
  // Henter data fra Firestore
  const fetchUserFall = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", "user1")); // Henter filen
      if (docSnap.exists()) { // Tjekker om filen eksisterer
        const data = docSnap.data();
        console.log("Firestore:", data);
        setUserFall(data.fall);
        setUserConnected(data.connected_phone);
        setHasFetchUser(true);

        if (data.connected_phone === false || data.connected_phone === "false" || data.connected_phone === "") { // Hvis telefonen ikke er forbundet til enheden skal den istedet hente data fra realtime database
          console.log("BLE not connected - starter Realtime listener");
          startRealtimeListener(); // Kun hvis ikke forbundet
        }

        if (data.fall === "Yes" && lastFallRef.current !== "Yes") {
          showLocalNotification('Alert', 'A fall has occurred!'); // Viser push notifikation
          lastFallRef.current = "Yes";
        }

        if (data.fall !== "Yes") {
          lastFallRef.current = data.fall;
        }
      } else {
        console.log("No fall data available");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); //Opretter delay

  // Opretter baggrundsopgave
  const backgroundTask = async (taskData) => {
    const { delay } = taskData;
    console.log('[BackgroundActions] Baggrundsopgave startet');
    while (BackgroundService.isRunning()) { // Mens BackgroundService er igang kører den: fetchUserFall
      await fetchUserFall();
      await sleep(delay);
    }
  };

  // Opsætning af baggrundsopgave - viser i notifikationscenteret på telefonen at appen kører i baggrunden
  const backgroundOptions = {
    taskName: 'FallMonitor',
    taskTitle: 'Fall detection active',
    taskDesc: 'Appen overvåger fald i baggrunden',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff0000',
    parameters: {
      delay: 60000, // 60 sekunder
    },
  };

  const listenToRealtimeData = useRef(null);

  // Opsætning til at hente data fra realtime database
  const startRealtimeListener = () => {
    // Undgå at starte flere lyttere
    if (listenToRealtimeData.current) return;

    const dataRef = ref(realtimeDb, 'users/user1'); // Henter fra mappen "users" og filen "user1"

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Realtime DB:", data);

      setUserBeacon(data.status);

      if (data.signal === "y") {
        setUserFall("Yes");

        if (data.signal === "y" && lastFallRef.current !== "Yes") {
          showLocalNotification('Alert', 'A fall has occurred at home!'); // Viser push notifikation
          lastFallRef.current = "Yes";
        }

        if (data.signal !== "y") {
          lastFallRef.current = data.fall;
        }
      }
    });

    listenToRealtimeData.current = unsubscribe;
  };

  // Til når hverken beacon eller telefon er forbundet til uret
  useEffect(() => {
    const delay = 60000;
    let timeoutId;

    if (userBeacon === "Connection_Lost") {
      timeoutId = setTimeout(() => { // Venter 60 sekunder
        if (userBeacon === "Connection_Lost" && (userConnected === false || userConnected === '')) {
          showLocalNotification('Alert','Bracelet lost connection to home, wearer might have left home'); // Viser push notifikation
          
          setTimeout(() => {
            const userRef = ref(realtimeDb, 'users/user1');
            update(userRef, { status: "" }); // Updaterer status
          }, 30000); // Delay 30 sekunder
        }
      }, delay);
    }
    return () => {
        clearTimeout(timeoutId);
    };
  }, [userBeacon, userConnected, hasFetchUser]);

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
      if (listenToRealtimeData.current) {
      listenToRealtimeData.current(); // Stopper lytning
      listenToRealtimeData.current = null;
      }
    };
  }, []);

  // Opsætning af layout i appen - hvad bliver vist
  return (
    <View style={styles.container}>
    <View style={styles.box1}>
      <Text style={styles.text}>Bracelet connected to: {(userConnected === false || userConnected === '') && userBeacon === "Connection_Lost"
      ? "Disconnected"
      : `\n${userConnected ? "Phone" : "Home"}`}</Text>
    </View>
    <View style={styles.box2}>
      <Text style={styles.text}>Fall detected: {userFall}</Text>
      {userFall === "Yes" ? (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Information')}> 
          <Text style={styles.text_button}>More information</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
  );
};

// Her sættes udseende, fx. farver, skriftstørrelse, placering af tekst, bokse og knapper
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box1: {
    backgroundColor: "powderblue",
    width: "90%",
    height: "15%",
    marginTop: "80%",
    borderRadius: 10,
    justifyContent: "center",
  },
  box2: {
    backgroundColor: "powderblue",
    width: "90%",
    height: "25%",
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  box3: {
    backgroundColor: "powderblue",
    width: "90%",
    height: "15%",
    marginTop: "5%",
    borderRadius: 10,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "blue",
    width: "95%",
    height: "35%",
    borderRadius: 10,
    alignSelf: "center",
  },
  text: {
    padding: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
    fontFamily: "monospace",
  },
  text_button: {
    padding: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: "white",
    fontFamily: "monospace",
    alignSelf: "center",
  }
});
export default PersonaleScreen;