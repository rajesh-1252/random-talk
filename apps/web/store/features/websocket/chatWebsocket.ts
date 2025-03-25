import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum WebSocketStatus {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  ERROR = "ERROR",
}

export interface ChatWebsocketState {
  status: WebSocketStatus;
  error: string | null;
  messages: any[];
}

const initialState: ChatWebsocketState = {
  status: WebSocketStatus.DISCONNECTED,
  error: null,
  messages: [],
};

const chatWebsocketSlice = createSlice({
  name: "chatWebsocket",
  initialState,
  reducers: {
    chatWsConnecting: (state) => {
      state.status = WebSocketStatus.CONNECTING;
    },
    chatWsConnected: (state) => {
      state.status = WebSocketStatus.CONNECTED;
      state.error = null;
    },
    chatWsDisconnected: (state) => {
      state.status = WebSocketStatus.DISCONNECTED;
    },
    chatWsError: (state, action: PayloadAction<string>) => {
      state.status = WebSocketStatus.ERROR;
      state.error = action.payload;
    },
    chatWsMessageReceived: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
  },
});
export const {
  chatWsError,
  chatWsMessageReceived,
  chatWsConnected,
  chatWsConnecting,
  chatWsDisconnected,
} = chatWebsocketSlice.actions;

export default chatWebsocketSlice.reducer;
