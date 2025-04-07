"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/app/firebaseConfig";

const FCMInitializer = () => {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Retrieve the FCM token using the imported messaging object
          getToken(messaging, { serviceWorkerRegistration: registration })
            .then((currentToken) => {
              if (currentToken) {
                console.log("FCM Token:", currentToken);
                // Optionally send token to backend server
              } else {
                console.warn("No FCM token available. Request permission.");
              }
            })
            .catch((error) => {
              console.error("Error retrieving FCM token:", error);
            });

          // Listen for foreground messages
          onMessage(messaging, (payload) => {
            console.log("Message received:", payload);
            // Handle the received message
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
};

export default FCMInitializer;
