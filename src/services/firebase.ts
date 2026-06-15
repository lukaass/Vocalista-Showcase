import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL */
export const auth = getAuth();

export async function initializeFirebaseConnection() {
  try {
    // Validate connection directly with the Firestore DB
    try {
      await getDocFromServer(doc(db, 'singers', '_connection_test'));
    } catch (err) {
      console.warn("Connection test completed (this is normal if document doesn't exist).");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration and internet connection.");
    } else {
      console.error("Firebase initialization error:", error);
    }
  }
}
