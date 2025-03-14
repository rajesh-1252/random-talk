import { ApiResponse } from "../types/apiResponse";
import { User } from "../types/user";
import axiosInstance from "./axiosInstance";

// 🔹 Fetch user contacts
export const getUserContacts = async (): Promise<User[]> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<User[]>>("user/contacts");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch contacts.");
    }

    return response.data.result;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// 🔹 Add a friend
export const addFriend = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      `/users/${userId}/add-friend`,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};
