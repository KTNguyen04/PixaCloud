// services/apiAuth.js
import axios from "axios";
import { useAuthStore } from "../store/auth";

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // withCredentials: true, // Nếu API cần gửi cookie/session
});

apiAuth.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.getToken;
    if (token) {
      console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiAuth;
