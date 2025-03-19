import express from "express";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();

const port = process.env.PORT;

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`),
);

const wss = new WebSocketServer({ server });

const onlineUser = new Map<string, WebSocket>();

wss.on("connection", (ws, req) => {
  console.log("connected to the web socket server");
  const token = req.url?.split("token=")[1];
  const userId = verifyToken(token);
  console.log(`user connected ${userId}`);
  if (!userId) {
    ws.close();
    return;
  }

  onlineUser.set(userId, ws);
  ws.on("message", (message: string) => {
    const data = JSON.parse(message);
    console.log("inside websocket message type", data.type);
    switch (data.type) {
      case "call-user": {
        const { to, offer } = data || {};
        // console.log("call to user", to);
        const toUserSocket = onlineUser.get(to);
        toUserSocket?.send(
          JSON.stringify({ type: "incoming-call", from: userId, offer, to }),
        );
        break;
      }

      case "answer-call": {
        const { answer, to } = data || {};
        const toUserSocket = onlineUser.get(to);
        toUserSocket?.send(
          JSON.stringify({ type: "call-accepted", from: userId, answer }),
        );
        // console.log("answer-user  called", data);
        break;
      }
      case "ice-candidate": {
        console.log("received ice candidate");
        const { to, candidate } = data;
        const toUserSocket = onlineUser.get(to);
        toUserSocket?.send(
          JSON.stringify({ type: "ice-candidate", candidate }),
        );
        break;
      }
      case "reject-call": {
        const { to } = data;
        const toUserSocket = onlineUser.get(to);
        toUserSocket?.send(
          JSON.stringify({ type: "receiver-disconnected" }),
        );
        break
      }
      case "end-call": {
        const { to } = data;
        const toUserSocket = onlineUser.get(to);
        toUserSocket?.send(
          JSON.stringify({ type: "call-ended" }),
        );
      }

      default:
        console.log("Unknown message type", data.type);
    }
  });
  ws.on("close", () => {
    if (userId) {
      onlineUser.delete(userId);
      console.log(`${userId} deleted successfully`);
    } else {
      console.log("no userid  to delete");
    }
    console.log("connection closed");
  });
});

wss.on("error", () => {
  console.log("error connecting to websocket");
});

function verifyToken(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    ) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}
