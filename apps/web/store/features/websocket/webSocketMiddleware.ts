/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  wsConnected,
  wsConnecting,
  wsDisconnected,
  wsError,
  wsMessageReceived,
} from "./webSocketSlice";
import {
  incomingCallAccepted,
  incomingCallReceived,
  setupIceCandidate,
} from "../call/callSlice";

interface ConnectAction {
  type: "websocket/connect";
  payload: {
    url: string;
  };
}

interface DisconnectAction {
  type: "websocket/disconnect";
}

interface SendAction {
  type: "websocket/send";
  payload: any; // Or specify the type of your messages
}

type WebsocketActionTypes = ConnectAction | DisconnectAction | SendAction;

let socket: WebSocket | null = null;

export const webSocketMiddleware: Middleware<object, RootState, Dispatch> =
  (api) => (next: any) => (action: any) => {
    const { dispatch } = api;
    console.log("action.type", action.type);
    if (action.type === "websocket/connect") {
      console.log(action.type, "inside middleware");
      const connectAction = action as ConnectAction;
      if (socket !== null) {
        socket.close();
      }
      dispatch(wsConnecting());
      socket = new WebSocket(connectAction.payload.url);
      console.log({ socket });

      socket.onopen = () => {
        dispatch(wsConnected());
        console.log("websocket connected");
      };

      socket.onclose = () => {
        console.log("web socket connection closed");
        dispatch(wsDisconnected());
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("web socket message received", message);
        dispatch(wsMessageReceived(message));
        if (message.type === "incoming-call") {
          console.log("incomingCallReceived called");
          dispatch(incomingCallReceived(message));
        } else if (message.type === "call-accepted") {
          dispatch(incomingCallAccepted(message.answer));
        } else if (message.type === "ice-candidate") {
          dispatch(setupIceCandidate(message));
        }
      };

      socket.onerror = (error: any) => {
        dispatch(wsError(error.message));
      };
    }

    if (action.type === "websocket/disconnect") {
      console.log("websocket/disconnect called");
      if (socket !== null) {
        socket.close();
      }
      socket = null;
    }

    if (action.type === "websocket/send") {
      const sendAction = action as SendAction;
      console.log(sendAction.payload);
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendAction.payload));
      }
    }
    return next(action);
  };
