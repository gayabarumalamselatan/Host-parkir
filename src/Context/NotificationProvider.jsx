import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NOTIFICATION_SERVICE } from '../Config/URLConstant';
import NotificationService from '../Services/notificationService';
// import axios from 'axios';

const NotificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const sendNotificationToStorage = async (message) => {
    try {

      
      const notificationToStore = {
        message: message,
        user_id: parseInt(sessionStorage.getItem("userID"), 10)
      }

      // const response = await axios.post(`${NOTIFICATION_SERVICE}/notification-storage`, )
      // if (!response.ok) {
      //   throw new Error('Failed to store notification');
      // }
      // const data = await response.json();
      console.log('Notification stored successfully:', notificationToStore);
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await NotificationService.fetchNotification();
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
    const socket = new WebSocket(`${NOTIFICATION_SERVICE}/ws`);

    socket.onmessage = (event) => {
      const message = event.data;
      console.log(message)
      toast.info(message); 
      sendNotificationToStorage(message);
      fetchNotifications()
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchNotifications()
  },[])

  return (
    <NotificationContext.Provider value={{notifications, fetchNotifications}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};