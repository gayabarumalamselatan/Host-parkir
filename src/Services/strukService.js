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
      const response = await axios.post(`${STRUK_SERVICE_BASE}/struk`, data, header);
      return response;
    } catch (error) {
      console.error('Error post data: ', error);
      return error
    }
  },
  editStruk: async (id, data) => {
    try {
      const response = await axios.put(`${STRUK_SERVICE_BASE}/struk/${id}`, data);
      return response
    } catch (error) {
      return error
    }
  },
  cekKupon: async (data) => {
    try {
      const response = await axios.get(`${STRUK_SERVICE_BASE}/kupon?kode_kupon=${data.kode_kupon}&nomor_polisi=${data.nomor_polisi}`);
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  },
}

export default StrukService;