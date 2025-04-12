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
  SEND_MESSAGE,
  RECEIVED_MESSAGE,
  BULK_UPDATE_STATUS,
} from "@repo/websocketaction";


let socket: Socket | null = null;
let pingInterval: NodeJS.Timeout | null = null;

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
          if (!pingInterval) {
            pingInterval = setInterval(() => {
              socket?.emit('ping');
            }, 270_000); // 4.5 mins
          }
        });

        // this is receiver side
        socket.on(SEND_MESSAGE, (message, ackCallBack) => {
          console.log("SEND_MESSAGE", message);
          console.log("📩 Received message:", message);
          if (!store.getState().chat.currentUser) {
            return ackCallBack({
              success: true,
              status: "delivered",
              messageId: message._id,
            });
          }
          const state = store.getState();
          const userId = state.user.user?._id;
          dispatch(sendMessage({ ...message, userId }));
          ackCallBack({ success: true, status: "seen" });
        });

        // this is  sender side
        socket.on(RECEIVED_MESSAGE, (data) => {
          console.log("RECEIVED_MESSAGE", data);
          if (data.success) {
            if (data.status === "seen") {
              setTimeout(() => {
                dispatch(markMessageAsSeen());
              }, 100)
            }
            if (data.status === "delivered") {
              setTimeout(() => {
                dispatch(markMessageAsDelivered(data.messageId));
              }, 100)
            }
          }
        });

        socket.on(BULK_UPDATE_STATUS, (data) => {
          console.log("BULK_UPDATE_STATUS")
          setTimeout(() => {
            dispatch(markMessageAsSeen());
          }, 100)
        })

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
          const response: { success: boolean; messageId: string } =
            await socket.emitWithAck(SEND_MESSAGE, action.payload);
          if (response.success) {
            console.log("response", "single tick", response.messageId);
            dispatch(updateMessageStatus(response.messageId));
            // single tick
            // and update the message id
          }
        }
        break;

      case "chatWebsocket/markAsSeen":
        if (!socket) return;
        const response = await socket.emitWithAck(BULK_UPDATE_STATUS, action.payload)
        console.log({ response, }, 'BULK_UPDATE_STATUS')
        if (response.true) {
        }
        break;

      case "chatWebsocket/disconnect":
        if (socket) {
          socket.disconnect();
          socket = null;
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }
          console.log("WebSocket disconnected");
        }
        break;


      default:
        break;
    }

    return next(action);
  };
