import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NOTIFICATION_SERVICE } from '../Config/URLConstant';
import NotificationService from '../Services/notificationService';
// import axios from 'axios';

const NotificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // const sendNotificationToStorage = async (message) => {
  //   console.log("mess",message)
  //   try {

  //     // Mesage parsing
  //     const jsonStartIndex = message.indexOf('&') + 1;
  //     const jsonString = message.slice(jsonStartIndex).trim();

  //     let dataObj;
  //     try {
  //       dataObj = JSON.parse(jsonString);
  //     } catch (err) {
  //       console.error('Failed to parse JSON from message:', err);
  //       dataObj = null;
  //     }

  //     const scannedAtDate = new Date(dataObj.scannedAt);
  //     const jam_masuk = scannedAtDate.toTimeString().split(' ')[0]; // HH:mm:ss
  //     const tanggal_masuk = scannedAtDate.toISOString().split('T')[0]; // YYYY-MM-DD

  //     const user_id = parseInt(sessionStorage.getItem('userID'), 10);
  //     const notificationToStore = {
  //       nomor_polisi: dataObj.licensePlate,
  //       jam_masuk: jam_masuk,
  //       tanggal_masuk: tanggal_masuk,
  //       user_id: user_id
  //     };

  //     // api send
  //     const response = await axios.post(`${NOTIFICATION_SERVICE}/notification-storage`, notificationToStore)
  //     if (!response.ok) {
  //       throw new Error('Failed to store notification');
  //     }
  //     const data = await response.json();
  //     console.log('Notification stored successfully:', data, message);
  //   } catch (error) {
  //     console.error('Error storing notification:', error);
  //   }
  // };

  const fetchNotifications = async () => {
    try {
      const response = await NotificationService.fetchNotification();
      if (response.status !== 200) {
        throw new Error('Failed to fetch notifications');
      }
      const data = response.data.data;
      const unreadData = data.filter(notification => notification.is_read === false)
      setNotifications(unreadData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(`${NOTIFICATION_SERVICE}/ws`);

    socket.onmessage = (event) => {
      const message = event.data;
      console.log(message);

      // Parse the message to extract the relevant data
      const jsonStartIndex = message.indexOf('&') + 1;
      const jsonString = message.slice(jsonStartIndex).trim();

      let dataObj;
      try {
        dataObj = JSON.parse(jsonString);
      } catch (err) {
        console.error('Failed to parse JSON from message:', err);
        return; // Exit if parsing fails
      }

      // Extract the required fields
      const licensePlate = dataObj.licensePlate;
      const scannedAtDate = new Date(dataObj.scannedAt);
      const jamMasuk = scannedAtDate.toTimeString().split(' ')[0]; // HH:mm:ss
      const tanggalMasuk = scannedAtDate.toISOString().split('T')[0]; // YYYY-MM-DD

      toast.info(
        <div>
          <div><strong>Plat nomor baru terdeteksi!</strong></div>
          <div>Plat nomor: {licensePlate}</div>
          <div>Jam masuk: {jamMasuk}</div>
          <div>Tanggal masuk: {tanggalMasuk}</div>
        </div>
      );

      // Optionally, you can call fetchNotifications() here if needed
      fetchNotifications();
    };


    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
      fetchNotifications()
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