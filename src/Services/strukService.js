import axios from "axios"
import { STRUK_SERVICE_BASE } from "../Config/URLConstant"

const StrukService = {
  createNewStruk: async (data) => {
    try {
      const response = await axios.post(`${STRUK_SERVICE_BASE}`, data);
      return response;
    } catch (error) {
      console.error('Error post data: ', error);
      return error
    }
  }
}

export default StrukService;