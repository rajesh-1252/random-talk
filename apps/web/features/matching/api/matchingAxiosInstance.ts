import axios from "axios";

export const matchingAxiosInstance = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/matching` ||
    "http://localhost:8080",
});

// Add token from localStorage to the Authorization header
matchingAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});
