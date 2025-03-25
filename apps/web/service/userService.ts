import { ApiResponse } from "@/types/apiResponse";
import { ISettings, IUser } from "@/types/user";
import axios from "axios";

const API = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/user` || "https://yourapi.com",
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

export default API;

// User APIs
export const UserAPI = {
  getUser: async () => {
    console.log("getuser called");
    const response = await API.get("/");
    console.log("get user response", response.data);
    return response.data as ApiResponse<IUser>;
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

export const SettingsAPI = {
  getSettings: async () => {
    const response = await API.get(`/settings`);
    return response.data as ISettings;
  },

  updateSettings: async (data: any) => {
    const response = await API.put(`/settings/`, data);
    return response.data;
  },

  updatePrivacy: async (userId: string, privacySettings: any) => {
    const response = await API.patch(
      `/settings/${userId}/privacy`,
      privacySettings,
    );
    return response.data;
  },

  updateNotifications: async (userId: string, notificationSettings: any) => {
    const response = await API.patch(
      `/settings/${userId}/notifications`,
      notificationSettings,
    );
    return response.data;
  },

  updateVideoCallSettings: async (userId: string, videoSettings: any) => {
    const response = await API.patch(
      `/settings/${userId}/video-call`,
      videoSettings,
    );
    return response.data;
  },

  updateRandomChatPreferences: async (userId: string, preferences: any) => {
    const response = await API.patch(
      `/settings/${userId}/random-chat`,
      preferences,
    );
    return response.data;
  },
};
