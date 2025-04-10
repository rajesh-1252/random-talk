import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createMessage, updateMessageStatus } from "../controller/chat";
import {
  SEND_TO_RECEIVER,
  SEND_MESSAGE,
  MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER,
  MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER,
  SEND_TO_SENDER,
  MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER,
  MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER,
} from "@repo/websocketaction";
import { batchUpdateStatus } from "../controller/conversation";

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupSocketServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const token = socket.handshake.auth.token;
    if (!token) {
      return socket.disconnect();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === "string") {
        console.log("Invalid token format");
        return socket.disconnect();
      }
      const user = decoded as JwtPayload & { userId: string };
      console.log("User connected:");
      onlineUsers.set(user.userId, socket.id);
    } catch (error) {
      console.log("Invalid token:", error);
      return socket.disconnect();
    }

    socket.on("user-online", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online`);
      io.emit("update-online-users", Array.from(onlineUsers.keys()));
    });

    socket.on(SEND_MESSAGE, async (data, ackCallBack) => {
      const { sender, receiver, text, conversationId } = data;
      const message = await createMessage({
        sender,
        receiver,
        text,
        conversationId,
      });
      if (!message) {
        console.log("failed to create message");
        ackCallBack({ status: "failed" }); // single tick
        return;
      }
      const receiverSocketId = onlineUsers.get(receiver);
      const senderSocketId = onlineUsers.get(sender);
      console.log({ receiverSocketId, senderSocketId }, receiver);
      // if (senderSocketId) {
      //   io.to(senderSocketId).emit(SEND_TO_SENDER, {
      //     _id: message._id,
      //     sender,
      //     receiver,
      //     createdAt: new Date(),
      //     text,
      //     messageType: "text",
      //   });
      // }
      if (receiverSocketId) {
        try {
          const response = await io
            .to(receiverSocketId)
            .timeout(2000)
            .emitWithAck(SEND_TO_RECEIVER, {
              _id: message._id,
              sender,
              receiver,
              createdAt: new Date(),
              text,
              messageType: "text",
            });
          console.log("ACK from receiver:", response);
        } catch (err) {
          console.error("Receiver ACK failed or timed out:", err);
        }
      }
      ackCallBack({ status: "ok" }); // single tick
    });

    socket.on(
      MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER,
      async ({ conversationId, seenById }) => {
        socket.emit(MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER);
        console.log("MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER");
        batchUpdateStatus({ conversationId, seenById, status: "seen", socket });
      },
    );

    socket.on(
      MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER,
      ({ senderId, messageId }) => {
        const receiverSocketId = onlineUsers.get(senderId);
        updateMessageStatus({ messageId, status: "delivered" });
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER,
            messageId,
          );
          // for double tick
        }
      },
    );

    socket.on("disconnect", () => {
      console.log("user disconnected");
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline`);
        }
      });
      io.emit("update-online-users", Array.from(onlineUsers.keys()));
    });
    console.log("websocket runing");
  });

  return io;
};
