// services/apiAuth.js
import axios from "axios";

const apiAuth = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Nếu API cần gửi cookie/session
});

// Thêm interceptor để tự động thêm token
apiAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc lấy từ Pinia store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiAuth;
