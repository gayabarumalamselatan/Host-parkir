import axios from "axios";
import { MEMBER_SERVICE_BASE } from "../Config/URLConstant";

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

  fetchMemberService: async () => {
    try {
      const response = await axios.get(`${MEMBER_SERVICE_BASE}`);
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  }
}

export default MemberService