importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

fetch('/api/firebase-config')
  .then(response => response.json())
  .then(config => {
    console.log('Firebase Config:', config);

    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message:', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  })
  .catch(error => console.error("Error loading Firebase Config:", error));
