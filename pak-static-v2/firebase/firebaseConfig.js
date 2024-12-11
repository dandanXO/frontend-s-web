import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const configs = [
  {
    apiKey: "AIzaSyAkXEAZKZkrhhjl5hnw-cgPLn95qQHjbYE",
    authDomain: "win7-d9e82.firebaseapp.com",
    projectId: "win7-d9e82",
    storageBucket: "win7-d9e82.firebasestorage.app",
    messagingSenderId: "926499960779",
    appId: "1:926499960779:web:777f908e0204288a2a684e"
  },
  {
    apiKey: "AIzaSyD42IZ7Q06lLHsey4JwpoBRkG3Ed2U8h2g",
    authDomain: "win7-ab689.firebaseapp.com",
    projectId: "win7-ab689",
    storageBucket: "win7-ab689.firebasestorage.app",
    messagingSenderId: "357270901266",
    appId: "1:357270901266:web:684e94443b5c1a41c8becb"
  },
  {
    apiKey: "AIzaSyBhAmr-jl8WFg_FuoHAlChFt9knsxVcNL8",
    authDomain: "win7-9ab6f.firebaseapp.com",
    projectId: "win7-9ab6f",
    storageBucket: "win7-9ab6f.firebasestorage.app",
    messagingSenderId: "457296616263",
    appId: "1:457296616263:web:94e15666ab5d5808830a62"
  }
]

const firebaseConfig = configs[Math.floor((Math.random() * configs.length))];

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);