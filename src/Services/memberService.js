import axios from "axios";
import { DISABLE_MEMBER_SERVICE, MEMBER_SERVICE_BASE, PAGINATED_MEMBER_SERVICE } from "../Config/URLConstant";

const MemberService = {
  insertMemberService: async (data) => {
    try {
      const response = await axios.post(`${MEMBER_SERVICE_BASE}`, data);
      return response;
    } catch (error) {
      console.error('Error post data: ', error);
      return error
    }
  },

  fetchMemberService: async (params) => {
    try {
      let response;
      if(params){
        response = await axios.get(`${PAGINATED_MEMBER_SERVICE}?${params}`)
      } else {
        response = await axios.get(`${MEMBER_SERVICE_BASE}`);
      }
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  },

  updateMemberService: async (data) => {
    // eslint-disable-next-line no-unused-vars
    const {id, ...newData} = data;
    try {
      const response = await axios.put(`${MEMBER_SERVICE_BASE}/${data.id}`, newData);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  disableMember: async (id) => {
    try {
      const response = await axios.put(`${DISABLE_MEMBER_SERVICE}/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default MemberService;