import axios from "axios";
import { NOTIFICATION_SERVICE } from "../Config/URLConstant";

const NotificationService = {
  fetchNotification: async () => {
    try {
      const response = await axios.get(`${NOTIFICATION_SERVICE}/notification-storage`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch notifications');
      }
      return response
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
  updateNotification: async (id, data) => {
    try {
      const response = await axios.put(`${NOTIFICATION_SERVICE}/update-notification/${id}`, data);
      if (response.status !== 200){
        throw response;
      }
      return response;
    } catch (error) {
      console.error(error)
    }
  },
  updateLog: async (id, data) => {
    try {
      const response = await axios.put(`${NOTIFICATION_SERVICE}/update-log/${id}`, data);
      if (response.status !== 200){
        throw response;
      }
      return response;
    } catch (error) {
      console.error(error)
    }
  }
}

export default NotificationService