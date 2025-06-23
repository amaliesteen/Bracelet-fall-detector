// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore database reference
const db = admin.firestore();

/**
 * Cloud Function der lytter efter nye data på stien '/ble_sequential_events/nano_signal' i Realtime Database
 * og kopierer beskeden til en 'detections' collection i Firestore.
 */
exports.rtdbToFirestoreSync = functions
    // Vælg en region tæt på dine databaser, f.eks. 'europe-west1' (hvis dine databaser er der)
    .region('europe-west1') // Sørg for at dette matcher dine Firebase ressourcers region
    .database.ref('/ble_sequential_events/nano_signal') // Stien den skal lytte til i RTDB
    .onWrite(async (change, context) => {
        // 'onWrite' trigger ved oprettelse, opdatering eller sletning.
        // 'change' objektet har 'before' (data før ændring) og 'after' (data efter ændring) snapshots.

        if (!change.after.exists()) {
            // Data blev slettet fra RTDB. For dette use-case ignorerer vi sletninger.
            console.log('Data slettet fra RTDB på stien:', context.params, context.resource.name, '- ingen handling i Firestore.');
            return null;
        }

        // Hent data der blev skrevet/opdateret
        const rtdbDataValue = change.after.val();
        const eventId = context.eventId; // Unikt ID for denne trigger-hændelse

        console.log("RTDB skrivning detekteret. Event ID:", {eventId});
        console.log('Data modtaget fra RTDB:', rtdbDataValue);

        // Din ESP32 sender en simpel streng, sandsynligvis 'y'
        if (typeof rtdbDataValue !== 'string') {
            console.error('Forventede streng-data fra RTDB, men modtog:', typeof rtdbDataValue, rtdbDataValue);
            return null; // Eller håndter fejlen passende
        }

        // Forbered data til Firestore
        const firestoreData = {
            message: rtdbDataValue, // Beskeden fra RTDB (f.eks. 'y')
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // Firestore server-tidsstempel
            rtdbEventId: eventId, // Valgfrit: Gem RTDB event ID for sporing
            rtdbPath: context.resource.name, // Den fulde sti i RTDB der triggede funktionen
        };

        try {
            // Tilføj et nyt dokument til 'detections' collectionen i Firestore.
            // Firestore vil auto-generere et dokument-ID.
            const writeResult = await db.collection('detections').add(firestoreData);
            console.log('Data succesfuldt skrevet til Firestore med nyt dokument ID:', writeResult.id);
            return null; // Indikerer succes
        } catch (error) {
            console.error('Fejl ved skrivning til Firestore:', error);
            // Du kan overveje at kaste fejlen igen for at lade Cloud Functions prøve igen,
            // eller logge til et specifikt fejlsporingssystem.
            return null; // Indikerer at fejlen er håndteret (eller ignoreret for nu)
        }
    });

