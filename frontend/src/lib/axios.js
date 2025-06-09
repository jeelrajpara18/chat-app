import axios from "axios";

const productionBaseURL = import.meta.env.VITE_SERVER_URL; // Set this in your .env file

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : `${productionBaseURL}/api`, // Correct backend URL in production
  withCredentials: true,
});