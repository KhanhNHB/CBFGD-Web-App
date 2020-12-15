import firebase from "firebase";
import "firebase/firestore";
import "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyC7f5iIDmi-rnEXAFBQSnBmeBbyJpWAqK4",
    authDomain: "gds-project-d57f0.firebaseapp.com",
    databaseURL: "https://gds-project-d57f0.firebaseio.com",
    projectId: "gds-project-d57f0",
    storageBucket: "gds-project-d57f0.appspot.com",
    messagingSenderId: "169597844269",
    appId: "1:169597844269:web:a9a129548c84bf988871a4",
    measurementId: "G-HP920T6GFE",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const messaging = firebaseApp.messaging();

export { messaging };
export default db;