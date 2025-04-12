import { configureStore, Middleware } from "@reduxjs/toolkit";
import websocketReducer, {
  WebsocketState,
} from "./features/websocket/webSocketSlice";
import { webSocketMiddleware } from "./features/websocket/webSocketMiddleware";
import { ChatWebsocketState } from "./features/websocket/chatWebsocket";
import webRtcReducer, { CallState } from "./features/call/callSlice";
import chatReducer, { ChatState } from "./features/chat/chatSlice";
import matchingReducer, {
  MatchingState,
} from "./features/matching/matchingSlice";
import userReducer from "./features/user/userSlice";
import chatPreviewReducer from "./features/chatPreview/chatPreviewSlice";
import { UserState } from "@/types/user";
import { chatWebSocketMiddleware } from "./features/websocket/chatWebsocketMiddleware";
import { ChatPreviewState } from "./features/chatPreview/chatPreviewSlice";
export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    webRtc: webRtcReducer,
    chat: chatReducer,
    user: userReducer,
    matching: matchingReducer,
    chatPreview: chatPreviewReducer
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
    }).concat(
      webSocketMiddleware as Middleware,
      chatWebSocketMiddleware as Middleware,
    ),
});

export type RootState = {
  websocket: WebsocketState;
  webRtc: CallState;
  chatWebsocket: ChatWebsocketState;
  chat: ChatState;
  user: UserState;
  matching: MatchingState;
  chatPreview: ChatPreviewState
};
export type AppDispatch = typeof store.dispatch;
export type RootStateWithTypes = {
  websocket: WebsocketState;
};
