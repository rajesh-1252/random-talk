import axios from "axios";


export const ChatAxiosInstance = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat` ||
    "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token from localStorage to the Authorization header
ChatAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default ChatAxiosInstance;
