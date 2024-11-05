importScripts(
  'https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js'
)
firebase.initializeApp({
  apiKey: 'AIzaSyCGf52_QmZChD9waDjMVjIYxhfFUWuvYX0',
  authDomain: 'b-care-servicedesk.firebaseapp.com',
  databaseURL: 'https://b-care-servicedesk-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'b-care-servicedesk',
  storageBucket: 'b-care-servicedesk.appspot.com',
  messagingSenderId: '488618544356',
  appId: '1:488618544356:web:f0b3d8ecb53bb3647930f1'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessage ')
})
