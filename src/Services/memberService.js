import axios from "axios";
import { DISABLE_MEMBER_SERVICE, JENIS_KENDARAAN_SERVICE, MEMBER_SERVICE_BASE, PAGINATED_MEMBER_SERVICE } from "../Config/URLConstant";

const accessToken = sessionStorage.getItem("token");
const header = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}

const MemberService = {
  insertMemberService: async (data) => {
    try {
      const response = await axios.post(`${MEMBER_SERVICE_BASE}`, data, header);
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
        response = await axios.get(`${PAGINATED_MEMBER_SERVICE}?${params}`, header)
      } else {
        response = await axios.get(`${MEMBER_SERVICE_BASE}`, header);
      }

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  },

  updateMemberService: async (data) => {
    // eslint-disable-next-line no-unused-vars
    const {id, ...newData} = data;
    try {
      const response = await axios.put(`${MEMBER_SERVICE_BASE}/${data.id}`, newData, header);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  disableMember: async (id) => {
    try {
      const response = await axios.put(`${DISABLE_MEMBER_SERVICE}/${id}`, {},  header);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  fetchJenisKendaraaanService: async () => {
    try {
      const response = await axios.get(`${JENIS_KENDARAAN_SERVICE}`);
      return response
    } catch (error) {
      return error
    }
  }
}

export default MemberService;