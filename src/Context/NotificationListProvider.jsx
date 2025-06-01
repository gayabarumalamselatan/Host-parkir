import { createContext, useContext, useEffect, useState } from 'react';
import { NOTIFICATION_SERVICE } from '../Config/URLConstant';
import axios from 'axios';

const NotificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const NotificationListProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${NOTIFICATION_SERVICE}/notification-storage`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch notifications');
      }
      const data = response.data.data;
      setNotifications(data); 
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationList = () => {
  return useContext(NotificationContext);
};
