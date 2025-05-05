import axios from "axios"
import { STRUK_SERVICE_BASE } from "../Config/URLConstant"

const accessToken = sessionStorage.getItem("token");
const header = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}

const StrukService = {
  createNewStruk: async (data) => {
    try {
      const response = await axios.post(`${STRUK_SERVICE_BASE}`, data, header);
      return response;
    } catch (error) {
      console.error('Error post data: ', error);
      return error
    }
  }
}

export default StrukService;