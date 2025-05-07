importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

const firebaseConfig = {
  apiKey: "AIzaSyAi_LyS2IIVK0HA9Cmn1BcHc-Rmz6NrGG8",
  authDomain: "glint-up.firebaseapp.com",
  projectId: "glint-up",
  storageBucket: "glint-up.firebasestorage.app",
  messagingSenderId: "1068868117432",
  appId: "1:1068868117432:web:88fa03c1fc90d6b42f254d",
  measurementId: "G-QXSGY0FNCR"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  try {
    console.log('Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon || '/logo.png',
      image: payload.notification.image,
      badge: '/logo (2).png',
      tag: payload.notification.tag || 'default',
      data: payload.data,
      actions: payload.notification.actions || [],
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('Error handling background message:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickedNotification = event.notification;
  const action = event.action;

  if (clickedNotification.data && clickedNotification.data.url) {
    clients.openWindow(clickedNotification.data.url);
  }
});
