import { setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebaseConfig1';
import { getCurrentLocation } from '../Lokation';

// Opretter dokument i Firestore med det data den skal kunne opdatere
async function saveData() {
  try {
    await setDoc(doc(db, "users", "user1"), { fall: "", connected_phone: "", time_fall: "", location: "" }); //Gemmer i mappen "users" i filen "user1"
    console.log("Data gemt!");
  }
  catch (error) {
    console.log("Fejl opstod:", error);
  }
}
saveData(); // Kalder funktionen , så dokumentet bliver gemt

export async function updateConnection(isConnected) { // Updaterer værdien "connected_phone"
  try {
    await updateDoc(doc(db, "users", "user1"), {
      connected_phone: isConnected,
    });
    console.log("BLE-status opdateret:", isConnected);
  } catch (error) {
    console.log("Fejl ved opdatering:", error);
  }
}

export async function updateFall(message) { // Updaterer værdien "fall"
  try {
    const fallValue = message === 'y' ? "Yes" : "No"; // Hvis beskeden den modtager er et "y" skal værdien sættes til "Yes" ellers "No"

    await updateDoc(doc(db, "users", "user1"), {
      fall: fallValue,
    });

    console.log("Fall:", message);
  } catch (error) {
    console.log("Fejl ved opdatering:", error);
  }
}

export async function updateFallTime(recievedTime) { //Updaterer den tid som beskeden er blevet modtaget
  try {
    await updateDoc(doc(db, "users", "user1"), {
      time_fall: recievedTime,
    });

    console.log("Fall happend:", recievedTime);
  } catch (error) {
    console.log("Fejl ved opdatering:", error);
  }
}

export const reverseGeocode = async (latitude, longitude) => { // Tager koordinaterne fra lokationen og laver dem om til en adresse
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&email=s224482@dtu.dk`; // Koordinaterne bliver sat ind i denne hjemmeside

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MyReactNativeApp/1.0 (s224482@dtu.dk)', 
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Nominatim fejlsvar:", errorText);
      throw new Error(`HTTP-fejl: ${response.status}`);
    }

    const data = await response.json(); // Her har den hele adressen

    const addr = data.address;
    const road = addr.road || '';
    const houseNumber = addr.house_number || '';
    const postcode = addr.postcode || '';
    const city = addr.city || addr.town || addr.village || addr.county || '';

    return `${road} ${houseNumber}, ${postcode} ${city}`; // Den retunerer vej, nummer, postnumemr og by
  } catch (error) {
    console.error("Reverse geocoding fejl: ", error);
    return null;
  }
};

export const updateLocation = async (resolvedAddress) => { // Updaterer værdien "location"
  try {
    await updateDoc(doc(db, "users", "user1"), {
      location: resolvedAddress,
    });
    console.log("Lokation blev opdateret:", resolvedAddress);
  } catch (error) {
    console.log("Fejl ved opdatering:", error);
  }
};

