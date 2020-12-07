import axios from "axios";

const api = axios.create({
  baseURL: "https://helppet-backend.herokuapp.com",
  timeout: 10000,
  headers:  {"Access-Control-Allow-Origin": "*"}
});

export default api;