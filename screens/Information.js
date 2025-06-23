import React , { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, StatusBar, Platform, Alert, Pressable, Dimensions } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig1';

export default function Information( {navigation}) {
  // Definerer konstanter
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [userTimestamp, setUserTimestamp] = useState('');

  // Opsætning til knap, når der trykkes bliver fall sat til "No"
  const handleReset = async () => {
    const alertRef = doc(db, 'users', 'user1');

    try {
      await updateDoc(alertRef, {
        fall: "No",
      });
      console.log('Alert status reset');
    } catch (error) {
      console.error('Error resetting alert:', error);
    }
  };

  // Funktion til at hente data fra Firestore
  const fetchUserData = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", "user1")); // Går ind i mappen "users" og filen "user1"
      if (docSnap.exists()) { // Tjekker om filen eksistrerer
        console.log("Firestore:", docSnap.data());
        setUserLocation(docSnap.data().location); // Henter lokation - data
        setUserTimestamp(docSnap.data().time_fall); // Henter tide for fald - data
      } else {
        console.log("No fall data available");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  // Kører funktionen fetchUserData, henter dataen en gang
  useEffect(() => {
    fetchUserData();
  }, []);

    // Opsætning af layout i appen - hvad bliver vist
    return (
      <View style={styles.container}>
        <View style={styles.box1}>
          <Text style={styles.text}>When did the fall happen: {'\n'}{'\n'}{userTimestamp}</Text>
        </View>
        <View style={styles.box2}>
          <Text style={styles.text}>Location: {userLocation}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.text_button}>Reset: alert seen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Her sættes udseende, fx. farver, skriftstørrelse, placering af tekst, bokse og knapper
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      alignItems: "center",
    },
    box1: {
      backgroundColor: "powderblue",
      width: "90%",
      height: "20%",
      marginTop: "35%",
      borderRadius: 10,
      justifyContent: "center",
    },
    box2: {
      backgroundColor: "powderblue",
      width: "90%",
      height: "20%",
      marginTop: "5%",
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      backgroundColor: "blue",
      width: "90%",
      height: "30%",
      marginTop: "5%",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    button_message: {
        backgroundColor: "#f5fffa",
        width: "100%",
        height: "25%",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    button_cancel: {
        backgroundColor: "#f5fffa",
        width: "100%",
        height: "10%",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
      padding: 20,
      fontSize: 16,
      fontWeight: 'bold',
      color: "white",
      fontFamily: "monospace",
    },
    text_popup: {
      padding: 20,
      fontWeight: 'bold',
      color: "black",
      fontFamily: "monospace",
    },
    text_button: {
        padding: 20,
        fontSize: 25,
        fontWeight: 'bold',
        color: "white",
        fontFamily: "monospace",
      },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
        alignItems: "center",
    },
    modalView: {
        width: "90%",
        height: "35%",
        backgroundColor: "#f5f5f5BF",
        borderRadius: 8,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: "5%",
    },
    
  });