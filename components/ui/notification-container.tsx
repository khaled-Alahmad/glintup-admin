"use client";

import React, { useState, useEffect } from 'react';
import { Notification } from './notification';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  duration?: number;
}

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration (default: 5000ms)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Listen for FCM messages
  useEffect(() => {
    const handleFCMMessage = (payload: any) => {
      if (payload.notification) {
        addNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          // icon: payload.notification.icon || '/logo.png',
          duration: 5000
        });
      }
    };

    // Subscribe to FCM messages
    const unsubscribe = window.addEventListener('message', (event) => {
      if (event.data?.type === 'FCM_MESSAGE') {
        handleFCMMessage(event.data.payload);
      }
    });

    return () => {
      window.removeEventListener('message', unsubscribe as any);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          title={notification.title}
          body={notification.body}
          onClose={() => removeNotification(notification.id)}
          className="animate-in slide-in-from-right"
        />
      ))}    
    </div>
  );
};

export { NotificationContainer };