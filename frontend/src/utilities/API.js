import axios from "axios"
import CONSTS from '../constants/Constants'

export default axios.create({
  baseURL: CONSTS.API_BASE,
  responseType: "json"
});