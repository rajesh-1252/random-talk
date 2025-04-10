import { io, Socket } from "socket.io-client";
import { Middleware, Dispatch } from "@reduxjs/toolkit";
import { RootState, store } from "@/store/store";
import {
  markMessageAsDelivered,
  markMessageAsSeen,
  sendMessage,
  updateMessageStatus,
} from "../chat/chatSlice";
import { chatWsMessageReceived } from "./chatWebsocket";
import {
  MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER,
  MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER,
  MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER,
  MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER,
  SEND_TO_RECEIVER,
  SEND_TO_SENDER,
  SEND_MESSAGE,
} from "@repo/websocketaction";

interface ConnectAction {
  type: "chatWebsocket/connect";
  payload: {
    url: string;
  };
}

interface DisconnectAction {
  type: "chatWebsocket/disconnect";
}

interface SendAction {
  type: "chatWebsocket/send";
  payload: any;
}

interface ReceiveAction {
  type: "chatWebsocket/receive";
  payload: any;
}

type WebsocketActionTypes =
  | ConnectAction
  | DisconnectAction
  | SendAction
  | ReceiveAction;

let socket: Socket | null = null;

export const chatWebSocketMiddleware: Middleware<object, RootState, Dispatch> =
  (api) => (next) => async (action: any) => {
    const { dispatch } = api;

    switch (action.type) {
      case "chatWebsocket/connect":
        if (socket) socket.disconnect();
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        socket = io(process.env.NEXT_PUBLIC_WS_URL, {
          transports: ["websocket"],
          auth: {
            token,
          },
        });

        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
        });

        socket.on(SEND_TO_RECEIVER, (message, ackCallBack) => {
          console.log("📩 Received message:", message);
          if (!store.getState().chat.currentUser) {
            console.warn("❗ currentUser not found, skipping message");
            return ackCallBack({ status: "skipped" }); // ✅ prevent timeout
          }
          const state = store.getState();
          const userId = state.user.user?._id;

          socket?.emit(MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER, {
            senderId: message.sender,
            messageId: message._id,
          });
          dispatch(sendMessage({ ...message, userId }));
          ackCallBack({ status: "ok" });
        });

        socket.on(MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER, (messageId) => {
          console.log("do double tick", messageId);
          // dispatch(markMessageAsDelivered(messageId));
          dispatch(updateMessageStatus({ messageId, status: "delivered" }));
        });
        socket.on(MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER, (messageId) => {
          console.log("MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER");
          dispatch(markMessageAsSeen());
        });
        socket.on(SEND_TO_SENDER, (message) => {
          console.log("SEND_TO_SENDER", message);
          dispatch(
            updateMessageStatus({ messageId: message._id, status: "sent" }),
          );
        });

        socket.on("match_found", (matchEvent) => {
          console.log("Received match event:");
          dispatch(chatWsMessageReceived(matchEvent));
          // Dispatch a custom event that the RandomChat component can listen to
          window.dispatchEvent(
            new MessageEvent("message", { data: matchEvent }),
          );
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from WebSocket server");
        });

        break;

      case "chatWebsocket/send":
        if (socket) {
          console.log("Sending message:", action.payload);
          // response  = {success : true}
          const response = await socket.emitWithAck(
            SEND_MESSAGE,
            action.payload,
          );
          if (response.success) {
            // single tick
          }
        }
        break;

      case "chatWebsocket/disconnect":
        if (socket) {
          socket.disconnect();
          socket = null;
          console.log("WebSocket disconnected");
        }
        break;

      case "chatWebsocket/markAsSeen":
        if (!socket) return;
        socket.emit(MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER, action.payload);
        break;

      default:
        break;
    }

    return next(action);
  };
