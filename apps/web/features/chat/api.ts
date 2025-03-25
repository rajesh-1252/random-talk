import { ApiResponse, Pagination } from "@/types/apiResponse";
import { ChatAxiosInstance, } from "./userAxiosInstance";
import { IConversation } from '@repo/mongoose'



export const getConversation = async () => {
  const { data } = await ChatAxiosInstance.get(`/conversation`);
  return data as ApiResponse<{ conversations: IConversation[], pagination: Pagination }>;
};
