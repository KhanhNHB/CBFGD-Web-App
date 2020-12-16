// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyC7f5iIDmi-rnEXAFBQSnBmeBbyJpWAqK4",
    authDomain: "gds-project-d57f0.firebaseapp.com",
    databaseURL: "https://gds-project-d57f0.firebaseio.com",
    projectId: "gds-project-d57f0",
    storageBucket: "gds-project-d57f0.appspot.com",
    messagingSenderId: "169597844269",
    appId: "1:169597844269:web:a9a129548c84bf988871a4",
    measurementId: "G-HP920T6GFE",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();