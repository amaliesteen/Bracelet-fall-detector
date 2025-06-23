import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, StatusBar, Platform } from 'react-native';

export default function Touchables({ navigation }) {
  // Opsætning af layout i appen - hvad bliver vist
  return (
    <View style={styles.container}>
      <View style={{
        marginTop: "17%",
        marginLeft: "-23%",
      }}>
        <Text style={styles.IntroText1}>FALL</Text>
      </View>
      <View style={{
      }}>
        <Text style={styles.IntroText2}>Detector</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Wearer')}>
        <View style={styles.button_bruger}>
          <Text style={styles.buttonText}>Wearer</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Caregiver/Relatives')}>
        <View style={styles.button_personale}>
          <Text style={styles.buttonText}>Caregiver/Relatives</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Her sættes udseende, fx. farver, skriftstørrelse, placering af tekst, bokse og knapper
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'steelblue',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
  },
  button_bruger: {
    width: 330,
    height: 130,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "skyblue",
    justifyContent: "center",
    borderRadius: 5,
  },
  button_personale: {
    width: 330,
    height: 130,
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "powderblue",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    padding: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: "white",
    fontFamily: "monospace",
  },
  IntroText1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "white",
    fontFamily: "monospace",
  },
  IntroText2: {
    fontSize: 63,
    fontWeight: "bold",
    color: "white",
    fontFamily: "monospace",
  }
});