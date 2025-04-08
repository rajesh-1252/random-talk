import { io, Socket } from "socket.io-client";
import { Middleware, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { sendMessage } from "../chat/chatSlice";
import { chatWsMessageReceived } from "./chatWebsocket";

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

type WebsocketActionTypes = ConnectAction | DisconnectAction | SendAction | ReceiveAction;

let socket: Socket | null = null;

export const chatWebSocketMiddleware: Middleware<object, RootState, Dispatch> =
  (api) => (next) => (action: any) => {
    const { dispatch } = api;

    switch (action.type) {
      case "chatWebsocket/connect":
        if (socket) socket.disconnect();
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found')
          return
        }
        socket = io(process.env.NEXT_PUBLIC_WS_URL, {
          transports: ["websocket"],
          auth: {
            token
          }
        });

        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
        });

        socket.on("receive-message", (message) => {
          console.log("Received message:", message);
          dispatch(sendMessage(message));
        });

        socket.on("match_found", (matchEvent) => {
          console.log("Received match event:", matchEvent);
          dispatch(chatWsMessageReceived(matchEvent));
          // Dispatch a custom event that the RandomChat component can listen to
          window.dispatchEvent(new MessageEvent("message", { data: matchEvent }));
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from WebSocket server");
        });

        break;

      case "chatWebsocket/send":
        console.log({ socket })
        if (socket) {
          console.log("Sending message:", action.payload);
          socket.emit("send-message", action.payload);
        }
        break;

      case "chatWebsocket/disconnect":
        if (socket) {
          socket.disconnect();
          socket = null;
          console.log("WebSocket disconnected");
        }
        break;

      default:
        break;
    }

    return next(action);
  };
