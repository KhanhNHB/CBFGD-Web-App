importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-analytics.js')

firebase.initializeApp({
    messagingSenderId: "169597844269",
})

const initMessaging = firebase.messaging()