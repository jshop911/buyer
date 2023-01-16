import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
require("firebase/firestore");
import Constants from "expo-constants";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB9Vk_U1uhE-38uEXCmadzOmAYKckJiAL0",
  authDomain: "buyer-seller-jshop.firebaseapp.com",
  projectId: "buyer-seller-jshop",
  storageBucket: "buyer-seller-jshop.appspot.com",
  messagingSenderId: "1069682512977",
  appId: "1:1069682512977:web:fcf9d436ac05f4047f9470",
  measurementId: "G-NNFMDM63NY"
});

export const db = app.firestore();
export const auth = app.auth();
export const storage = app.storage();
export default app;

// heto po
