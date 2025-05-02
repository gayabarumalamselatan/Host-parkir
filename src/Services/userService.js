import axios from "axios"
import { AUTH_REGISTER_SERVICE, GET_USER_VIEW, ROLE_SERVICE_BASE, USER_SERVICE_BASE } from "../Config/URLConstant"

const UserService = {
  fetchAllUser: async () => {
    try {
      const response = await axios.get(`${USER_SERVICE_BASE}`)
      return response;
    } catch (error) {
      console.error(error);
      console.error(error);
      return error;
    }
  },

  fecthUserView: async () => {
    try {
      const response = await axios.get(`${GET_USER_VIEW}`);
      return response;
    } catch (error) {
      console.error(error);
      return error
    }
  },

  fetchRoles: async () => {
    try {
      const response = await axios.get(`${ROLE_SERVICE_BASE}`);
      return response;
    } catch (error) {
      console.error(error);
      return error
    }
  },
  
  registerUser: async (data) => {
    try {
      const response = await axios.post(`${AUTH_REGISTER_SERVICE}`, data);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

export default UserService