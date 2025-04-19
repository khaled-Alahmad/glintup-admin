"use client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// التحقق من دعم المتصفح لـ Firebase Cloud Messaging
const isSupportedBrowser = () => {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
};

let messaging;
if (isSupportedBrowser()) {
  messaging = getMessaging(app);
} else {
  console.warn("Firebase Cloud Messaging is not supported in this browser.");
}

// تسجيل Service Worker
const initializeFirebaseMessaging = async () => {
  try {
    if (!isSupportedBrowser()) {
      console.log("Firebase Cloud Messaging is not supported in this browser.");
      return;
    }
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    ;
    console.log("Service Worker registered with scope:", registration.scope);
  } catch (error) {
    console.error("Service Worker registration failed", error);
  }
};

// طلب رمز Firebase Cloud Messaging
export const getFirebaseToken = async () => {
  try {
    if (!isSupportedBrowser()) {
      console.warn("Firebase Cloud Messaging is not supported in this browser.");
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error("VAPID key is not set");
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
    console.log(token);

    if (token) {
      return token;
    } else {
      console.warn("No FCM token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// استقبال رسائل الإشعارات عند عمل التطبيق في المقدمة
export const onFirebaseMessage = (callback) => {
  if (messaging) {
    onMessage(messaging, callback);
  } else {
    console.warn("Messaging is not initialized.");
  }
};

export { messaging, initializeFirebaseMessaging, isSupportedBrowser };
export default app;
