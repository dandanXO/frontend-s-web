import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAeL1Zuc7zwwgy4lAmdjzBOb5lvjAd0tv8",
    authDomain: "pakwin2-7a035.firebaseapp.com",
    projectId: "pakwin2-7a035",
    storageBucket: "pakwin2-7a035.firebasestorage.app",
    messagingSenderId: "841104591629",
    appId: "1:841104591629:web:d63723082632b8d8827e44"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);