import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC7f5iIDmi-rnEXAFBQSnBmeBbyJpWAqK4",
    authDomain: "gds-project-d57f0.firebaseapp.com",
    databaseURL: "https://gds-project-d57f0.firebaseio.com",
    projectId: "gds-project-d57f0",
    storageBucket: "gds-project-d57f0.appspot.com",
    messagingSenderId: "169597844269",
    appId: "1:169597844269:web:a9a129548c84bf988871a4",
    measurementId: "G-HP920T6GFE",
});
const messaging = initializedFirebaseApp.messaging();
export { messaging };