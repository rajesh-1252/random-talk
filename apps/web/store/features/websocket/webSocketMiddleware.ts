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
  callEnded,
  incomingCallAccepted,
  incomingCallReceived,
  incomingCallRejected,
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
    const { dispatch, getState } = api;
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
          dispatch(incomingCallReceived(message));
        } else if (message.type === "call-accepted") {
          const peer = getState().webRtc.peerConnection;
          console.log("call-accepted called", message.answer, peer);
          if (peer) {
            peer.setRemoteDescription(
              new RTCSessionDescription(message.answer),
            );
            console.log("sucess", action.payload.answer);
            dispatch(
              incomingCallAccepted({
                currentCallId: message.from,
              }),
            );
          } else {
            console.warn("no peer", peer);
          }
        } else if (message.type === "ice-candidate") {
          dispatch(setupIceCandidate(message));
        } else if (message.type === "receiver-disconnected") {
          dispatch(callEnded());
        } else if (message.type === "call-ended") {
          dispatch(callEnded());
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
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendAction.payload));
      }
    }
    return next(action);
  };
