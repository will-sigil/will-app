// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDltt5bqIU-xtFFwrOsEy7XnoxS1T5F0JA",
  authDomain: "will-training-app.firebaseapp.com",
  databaseURL: "https://will-training-app-default-rtdb.firebaseio.com",
  projectId: "will-training-app",
  storageBucket: "will-training-app.appspot.com",
  messagingSenderId: "277982002270",
  appId: "1:277982002270:web:d4eba9e6e5722a65cc88cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };