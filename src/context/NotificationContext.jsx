import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastNotification from '../components/common/ToastNotification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success', duration = 2000) => {
    const id = Date.now(); // Simple unique ID
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Helper methods for common notifications
  const showFavoriteAdded = useCallback((recipeName = 'Recipe') => {
    return showNotification(`${recipeName} added to favorites`, 'favorite-added', 2000);
  }, [showNotification]);

  const showFavoriteRemoved = useCallback((recipeName = 'Recipe') => {
    return showNotification(`${recipeName} removed from favorites`, 'favorite-removed', 2000);
  }, [showNotification]);

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        hideNotification, 
        showFavoriteAdded, 
        showFavoriteRemoved 
      }}
    >
      {children}
      {/* Render all active notifications */}
      {notifications.map(notification => (
        <ToastNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};