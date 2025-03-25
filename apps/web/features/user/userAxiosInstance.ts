import axios from "axios";

export const userAxiosInstance = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/user` ||
    "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});
