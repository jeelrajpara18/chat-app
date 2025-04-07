let io;
import { Server } from "socket.io";
const userSocketMap = {};

export const initializeSocket = (server) => {
  io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Track online users
    socket.on("setup", (userId) => {
      userSocketMap[userId] = socket.id;
      socket.join(userId); // Join personal room
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Group room management
    socket.on("joinGroup", (groupId) => socket.join(groupId));
    socket.on("leaveGroup", (groupId) => socket.leave(groupId));

    socket.on("disconnect", () => {
      const userId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
};

export const getIO = () => io;
export const getReceiverSocketId = (userId) => userSocketMap[userId];
