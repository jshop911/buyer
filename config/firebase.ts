// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import Constants from "expo-constants";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB9Vk_U1uhE-38uEXCmadzOmAYKckJiAL0",
	authDomain: "buyer-seller-jshop.firebaseapp.com",
	projectId: "buyer-seller-jshop",
	storageBucket: "buyer-seller-jshop.appspot.com",
	messagingSenderId: "1069682512977",
	appId: "1:1069682512977:web:fcf9d436ac05f4047f9470",
	measurementId: "G-NNFMDM63NY"
};

let app;

if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export default app;
