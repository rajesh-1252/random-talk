import axiosInstance from "@/api/axiosInstance";
import { ApiResponse } from "@/types/apiResponse";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMessage } from "@repo/mongoose";
import { IConversationWithId } from "../chatPreview/chatPreviewSlice";
const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export interface UserConversation extends IConversationWithId { }

export interface Message extends IMessage {
  _id: string;
  createdAt: Date;
}

export interface ChatState {
  currentUser: UserConversation | null;
  users: UserConversation[];
  messages: Message[];
  isOnline: boolean
}

const initialState: ChatState = {
  currentUser: null,
  users: [],
  messages: [],
  isOnline: false
};

export const startChat = createAsyncThunk<
  ApiResponse<UserConversation>,
  string
>("matching/startChat", async (matchId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserConversation>>(
      `${API_URL}/matching/api/conversation/?matchId=${matchId}`,
    );
    console.log("runnning", response.data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to cancel match",
    );
  }
});


type ChatResponse = {
  messages: Message[]
  isOnline: boolean
}
interface GetMessageArgs {
  conversationId: string;
  senderId: string;
}
export const getMessage = createAsyncThunk<ApiResponse<ChatResponse>, GetMessageArgs>(
  "matching/getMessage",
  async ({ conversationId, senderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<ChatResponse>>(
        `${API_URL}/chat/message/${conversationId}/${senderId}`,
      );
      console.log("chat respnse", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel match",
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserConversation | null>) => {
      console.log("set current user called", action.payload);
      state.currentUser = action.payload;
    },
    setAllUser: (state, action: PayloadAction<UserConversation[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<UserConversation>) => {
      // const exists = state.users.some((user) => user.id === action.payload.id);
      // if (!exists) state.users.push(action.payload);
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        isOnline: boolean;
        lastSeen: Date | null;
      }>,
    ) => {
      // const user = state.users.find(
      //   (user) => user.id === action.payload.userId,
      // );
      // if (user) {
      //   user.isOnline = action.payload.isOnline;
      //   user.lastSeen = action.payload.lastSeen;
      // }
    },
    sendMessage: (state, action: PayloadAction<Message>) => {
      const participants = JSON.parse(
        JSON.stringify(state.currentUser?.participants),
      ) as [{ _id: string; name: string }];
      const canSendMessage = participants.some(
        (p) => p._id === action.payload.sender,
      );
      if (canSendMessage) {
        state.messages.push(action.payload);
      } else {
        // sendNotifcation
      }
      // update lastmessage in chat preview
    },

    updateMessageStatus: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const lastIndex = state.messages.length - 1;
      const lastMessage = state.messages[lastIndex];

      if (lastMessage) {
        lastMessage._id = messageId;
        lastMessage.status = "sent";
      }
    },

    markMessageAsSeen: (state) => {
      console.log("mark as seen called");
      state.messages = state.messages.map((item) => {
        return { ...item, status: "seen" };
      });
    },

    markMessageAsDelivered: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((msg) => msg._id === action.payload);
      console.log({
        message: JSON.stringify(message),
        messageId: action.payload,
        fullMessage: JSON.stringify(state.messages),
      });
      if (message) message.status = "delivered";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        startChat.fulfilled,
        (state, action: PayloadAction<ApiResponse<UserConversation>>) => {
          state.currentUser = action.payload.result;
        },
      )
      .addCase(
        getMessage.fulfilled,
        (state, action: PayloadAction<ApiResponse<ChatResponse>>) => {
          state.messages = action.payload.result.messages;
          state.isOnline = action.payload.result.isOnline;
        },
      );
  },
});

export const {
  setCurrentUser,
  addUser,
  updateUserStatus,
  sendMessage,
  markMessageAsSeen,
  markMessageAsDelivered,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
