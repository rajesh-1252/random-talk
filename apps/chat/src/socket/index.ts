import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";

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
      console.log("User connected:", user);
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

    socket.on("send-message", (data) => {
      console.log("type send-message", data);
      const { senderId, receiverId, message } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      console.log({ receiverSocketId }, receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", {
          id: "",
          senderId,
          receiverId,
          createdAt: new Date(),
          message,
          messageType: "text",
        });
      }
    });

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
