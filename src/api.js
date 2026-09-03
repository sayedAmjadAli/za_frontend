import axios from "axios";

const api = axios.create({
  baseURL: "http://148.230.97.14:3000/api",
  withCredentials:true
});

console.log("API Base URL:", api.defaults.baseURL); 

export default api;