import { getConversation } from "@/features/chat/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation } from "@repo/mongoose";

export interface IConversationWithId
  extends Omit<IConversation, "lastMessage"> {
  _id: string;
  lastMessage: {
    _id: string;
    text: string;
  };
}
export type ChatPreviewState = {
  chatMap: { [chatId: string]: IConversationWithId };
  chatOrder: string[];
  loading: boolean;
  error: string | null;
};

const initialState: ChatPreviewState = {
  chatMap: {},
  chatOrder: [],
  loading: false,
  error: null,
};

export const getChatPreview = createAsyncThunk(
  "chatPreview/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversation();
      console.log({ response });
      return response.result.conversations; // assume this is an array of ChatPreview
    } catch (error) {
      return rejectWithValue("Failed to load chat preview");
    }
  },
);

const chatPreviewSlice = createSlice({
  name: "chatPreview",
  initialState,
  reducers: {
    addNewConversation: (state, action) => {},
    updateConverstaion: (
      state,
      action: PayloadAction<Pick<IConversationWithId, "lastMessage" | "_id">>,
    ) => {
      const { lastMessage, _id } = action.payload;
      const index = state.chatOrder.findIndex((idx) => idx === _id);
      if (index != -1) {
        const [item] = state.chatOrder.splice(index, 1);
        state.chatOrder.unshift(item!);
        state.chatMap[item!] = {
          ...state.chatMap[item!],
          lastMessage: lastMessage,
          _id: item!,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatPreview.fulfilled, (state, action) => {
        state.loading = false;
        const chats = action.payload as IConversationWithId[];
        state.chatMap = {};
        state.chatOrder = [];
        chats.forEach((chat) => {
          state.chatMap[chat._id] = chat;
          state.chatOrder.push(chat._id);
        });
      })
      .addCase(getChatPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateConverstaion } = chatPreviewSlice.actions;

export default chatPreviewSlice.reducer;
