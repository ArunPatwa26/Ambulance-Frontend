// NotificationContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('');

  // Function to add a new notification
  const addNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000); // Clear notification after 5 seconds
  };

  return (
    <NotificationContext.Provider value={{ notification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
