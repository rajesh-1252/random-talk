import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
export interface UserConversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    avatar: string;
  }[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: string;
  updatedAt: string;
  contactName: string;
  unread: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  isSeen: boolean;
  isDelivered: boolean;
  createdAt: Date;
  message: string;
  messageType: "text" | "image" | "video" | "audio" | "file";
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
  currentUse: null,
};

export const startChat = createAsyncThunk<UserConversation, void>(
  "matching/startChat",
  async (matchId, { rejectWithValue }) => {
    console.log("matching/startCha clicked t", matchId)
    try {
      const response = await axiosInstance.get<UserConversation>(`${API_URL}/matching/api/conversation/?matchId=${matchId}`);
      console.log('runnning', response.data)
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || "Failed to cancel match");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserConversation | null>) => {
      console.log('set current user called')
      state.currentUser = action.payload;
    },
    setAllUser: (state, action: PayloadAction<UserConversation[]>) => {
      state.users = action.payload
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
      state.messages.push(action.payload);
    },
    markMessageAsSeen: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((msg) => msg.id === action.payload);
      if (message) message.isSeen = true;
    },
    markMessageAsDelivered: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((msg) => msg.id === action.payload);
      if (message) message.isDelivered = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startChat.fulfilled, (state, action: PayloadAction<UserConversation>) => {
        state.currentUser = action.payload.result;
      })
  }

});

export const {
  setCurrentUser,
  addUser,
  updateUserStatus,
  sendMessage,
  markMessageAsSeen,
  markMessageAsDelivered,
} = chatSlice.actions;

export default chatSlice.reducer;
