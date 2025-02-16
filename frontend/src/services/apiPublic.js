// services/apiPublic.js
import axios from "axios";

const apiPublic = axios.create({
  baseURL: "https://picsum.photos",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPublic;
