import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";

const API = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat` || "https://yourapi.com",
  // withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const ChatAPI = {
  getConversation: async () => {
    console.log("getConversation called");
    const response = await API.get("/");
    console.log(" response", response.data);
    return response.data;
  },

  updateUser: async (data: any) => {
    const response = await API.put(`/`, data);
    return response.data;
  },

  deleteUser: async () => {
    const response = await API.delete(`/`);
    return response.data;
  },
};

export default API;
