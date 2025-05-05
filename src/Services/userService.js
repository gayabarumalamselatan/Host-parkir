import axios from "axios"
import { AUTH_REGISTER_SERVICE, GET_USER_VIEW, ROLE_SERVICE_BASE, USER_SERVICE_BASE } from "../Config/URLConstant"

const accessToken = sessionStorage.getItem("token");
const header = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}


const UserService = {
  fetchAllUser: async () => {
    try {
      const response = await axios.get(`${USER_SERVICE_BASE}`, header)
      return response;
    } catch (error) {
      console.error(error);
      console.error(error);
      return error;
    }
  },

  fecthUserView: async () => {
    try {
      const response = await axios.get(`${GET_USER_VIEW}`, header);
      return response;
    } catch (error) {
      console.error(error);
      return error
    }
  },

  fetchRoles: async () => {
    try {
      const response = await axios.get(`${ROLE_SERVICE_BASE}`, header);
      return response;
    } catch (error) {
      console.error(error);
      return error
    }
  },
  
  registerUser: async (data) => {
    try {
      const response = await axios.post(`${AUTH_REGISTER_SERVICE}`, data, header);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateUser: async (data, id, params) => {
    try {
      const response = await axios.put(`${USER_SERVICE_BASE}/${id}?is_change_password=${params}`, data, header);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${USER_SERVICE_BASE}/${id}`, header);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

export default UserService