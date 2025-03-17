import { configureStore, Middleware } from "@reduxjs/toolkit";
import websocketReducer, {
  WebsocketState,
} from "./features/websocket/webSocketSlice";
import { webSocketMiddleware } from "./features/websocket/webSocketMiddleware";
import webRtcReducer, { CallState } from "./features/call/callSlice";

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    webRtc: webRtcReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: ["call/setLocalStream", "call/setRemoteStream"],
      //   ignoredPaths: [
      //     "call.localStream",
      //     "call.remoteStream",
      //     "call.peerConnection",
      //   ],
      // },
    }).concat(webSocketMiddleware as Middleware),
});

export type RootState = {
  websocket: WebsocketState;
  webRtc: CallState;
};
export type AppDispatch = typeof store.dispatch;
export type RootStateWithTypes = {
  websocket: WebsocketState;
};
