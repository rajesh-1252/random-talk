"use client";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Add token dynamically from localStorage or cookies
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // Store token securely
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
