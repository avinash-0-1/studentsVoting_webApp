import axios from "axios";

const API = axios.create({
  baseURL: "https://studentsvoting-webapp.onrender.com", //https://studentsvoting-webapp.onrender.com
                                                         //http://localhost:3000/
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;