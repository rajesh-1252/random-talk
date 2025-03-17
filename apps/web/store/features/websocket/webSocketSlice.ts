import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum WebSocketStatus {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  ERROR = "ERROR",
}

export interface WebsocketState {
  status: WebSocketStatus;
  error: string | null;
  messages: any[];
}

const initialState: WebsocketState = {
  status: WebSocketStatus.DISCONNECTED,
  error: null,
  messages: [],
};

const webSocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.status = WebSocketStatus.CONNECTING;
    },
    wsConnected: (state) => {
      state.status = WebSocketStatus.CONNECTED;
      state.error = null;
    },
    wsDisconnected: (state) => {
      state.status = WebSocketStatus.DISCONNECTED;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.status = WebSocketStatus.ERROR;
      state.error = action.payload;
    },
    wsMessageReceived: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  wsConnecting,
  wsError,
  wsConnected,
  wsMessageReceived,
  wsDisconnected,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;
