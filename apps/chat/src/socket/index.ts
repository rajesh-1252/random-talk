import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createMessage } from "../controller/chat";
import { SEND_MESSAGE, RECEIVED_MESSAGE, BULK_UPDATE_STATUS } from "@repo/websocketaction";
import { batchUpdateStatus } from "../controller/conversation";
import redisClient from "../redis";

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
      redisClient.set(`online:${user.userId}`, 'true', { EX: 300 });
    } catch (error) {
      console.log("Invalid token:", error);
      return socket.disconnect();
    }

    socket.on("user-online", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online`);
      io.emit("update-online-users", Array.from(onlineUsers.keys()));
    });

    type MessageData = {
      sender: string
      receiver: string
      text: string
      conversationId: string
    }
    socket.on('ping', (userId) => {
      console.log('ping called')
      redisClient.set(`online:${userId}`, 'true', { EX: 300 });
    });
    socket.on(SEND_MESSAGE, async (data: MessageData, ackCallBack) => {
      const { sender, receiver, text, conversationId } = data;
      const message = await createMessage({
        sender,
        receiver,
        text,
        conversationId,
      });
      if (!message) {
        console.log("failed to create message");
        ackCallBack({ success: false }); // message is not deliverd no tick we can do retry logic here in frontend
        return;
      }
      const receiverSocketId = onlineUsers.get(receiver);
      const senderSocketId = onlineUsers.get(sender) as string;

      if (receiverSocketId) {
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        if (!receiverSocket) {
          console.log("receiverSocket not found");
          return;
        }
        try {
          // send to recevier
          const response = await receiverSocket
            .timeout(2000)
            .emitWithAck(SEND_MESSAGE, {
              _id: message._id,
              sender,
              receiver,
              createdAt: new Date(),
              text,
              messageType: "text",
            });
          if (response.status === "delivered") {
            await batchUpdateStatus(
              {
                conversationId,
                seenById: receiver,
                status: 'delivered',
              }
            )
          }
          if (response.status === "seen") {
            await batchUpdateStatus(
              {
                conversationId,
                seenById: receiver,
                status: 'seen',
              }
            )
          }
          io.to(senderSocketId).emit(RECEIVED_MESSAGE, response);
          console.log("ACK from receiver", response);
        } catch (err) {
          ackCallBack({ success: false }); // user is not online (can't able to send to user error in websocket connection)
          console.error("Receiver ACK failed or timed out:", err);
        }
      }
      ackCallBack({ success: true, messageId: message._id }); // single tick
    });


    type UpdateData = {
      conversationId: string,
      seenById: string,
      status: 'seen' | 'delivered',
      receiverId: string
    }

    socket.on(BULK_UPDATE_STATUS, async (data: UpdateData, ackCallBack) => {
      const { conversationId, status, seenById, receiverId } = data
      console.log('bulk update status called', data)
      const senderSocketId = onlineUsers.get(receiverId) as string;
      console.log({ senderSocketId })
      await batchUpdateStatus(
        {
          conversationId,
          seenById,
          status,
        }
      )
      io.to(senderSocketId).emit(BULK_UPDATE_STATUS);
      ackCallBack({ success: true })
    })


    socket.on("disconnect", () => {
      console.log("user disconnected");
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline`);
          redisClient.del(`online:${userId}`)
        }
      });
      io.emit("update-online-users", Array.from(onlineUsers.keys()));
    });
    console.log("websocket runing");
  });

  return io;
};
