import axiosInstance from "@/api/axiosInstance";
import { ApiResponse } from "@/types/apiResponse";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMessage, MessageStatus } from "@repo/mongoose";
const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
export interface UserConversation {
  _id: string;
  participants: { _id: string; name: string }[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: string;
  updatedAt: string;
  contactName: string;
  unread: number;
}

export interface Message extends IMessage {
  _id: string;
  isSeen: boolean;
  createdAt: Date;
  // messageType: "text" | "image" | "video" | "audio" | "file";
}

export interface ChatState {
  currentUser: UserConversation | null;
  users: UserConversation[];
  messages: Message[];
}

const initialState: ChatState = {
  currentUser: null,
  users: [],
  messages: [],
};

export const startChat = createAsyncThunk<
  ApiResponse<UserConversation>,
  string
>("matching/startChat", async (matchId, { rejectWithValue }) => {
  console.log("matching/startCha clicked t", matchId);
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

export const getMessage = createAsyncThunk<ApiResponse<Message[]>, string>(
  "matching/getMessage",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<Message[]>>(
        `${API_URL}/chat/message/${conversationId}`,
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
    },

    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: string; status: MessageStatus }>,
    ) => {
      const { messageId, status } = action.payload;
      state.messages = state.messages.map((m) => {
        if (m._id === "" && status === "sent") {
          return {
            ...m,
            _id: messageId,
            status: status,
          };
        } else if (m._id === messageId) {
          return {
            ...m,
            status: status,
          };
        }
        return m;
      });
    },
    markMessageAsSeen: (state) => {
      console.log("markMessageAsSeen")
      state.messages = state.messages.map((item) => {
        return { ...item, status: 'seen' }
      })
    },

    markMessageAsDelivered: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((msg) => msg._id === action.payload);
      console.log({ message: JSON.stringify(message), fds: action.payload });
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
        (state, action: PayloadAction<ApiResponse<Message[]>>) => {
          state.messages = action.payload.result;
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
