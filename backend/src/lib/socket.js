import { Server as SockeIOServer } from "socket.io";
import Message from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new SockeIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected : ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.senderId);
    const receiverSocketId = userSocketMap.get(message.receiverId);

    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("senderId", "id email fullName image color")
      .populate("receiverId", "id email fullName image color");

      if(receiverSocketId){
        io.to(receiverSocketId).emit("receiveMessage" , messageData)
      }
      if(senderSocketId){
        io.to(senderSocketId).emit("sendMessage" , messageData)
      }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID : ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
