import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const configs = [
  {
    apiKey: "AIzaSyBm33xCsbGknh2coDmQdM9MkOdY4U3URpo",
    authDomain: "b9game.firebaseapp.com",
    projectId: "b9game",
    storageBucket: "b9game.firebasestorage.app",
    messagingSenderId: "649216089271",
    appId: "1:649216089271:web:a9904affd2bb68f4d58132",
    measurementId: "G-7KF3RYKJ88"
  },
  {
    apiKey: "AIzaSyByjY_sFt89Bi9kdE1XUWyd_jMHUvz1SKQ",
    authDomain: "b9game-450207.firebaseapp.com",
    projectId: "b9game-450207",
    storageBucket: "b9game-450207.firebasestorage.app",
    messagingSenderId: "224522131575",
    appId: "1:224522131575:web:417b215aebffabf148ce72",
    measurementId: "G-QKXK3EEG0E"
  },
  {
    apiKey: "AIzaSyAs_ZGCEefPzXfojWZ4tgX9S3dPJ3z0uJY",
    authDomain: "b9game-450208.firebaseapp.com",
    projectId: "b9game-450208",
    storageBucket: "b9game-450208.firebasestorage.app",
    messagingSenderId: "83563276345",
    appId: "1:83563276345:web:3089c389a38120941d85e8",
    measurementId: "G-985JQ82FQ3"
  }
]

const firebaseConfig = configs[Math.floor((Math.random() * configs.length))];

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);