import { Server as SockeIOServer } from "socket.io";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";

export const initializeSocket = (server) => {
 const io = new SockeIOServer(server, {
  cors: {
    origin: [
      "https://chat-app-tk44.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
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

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("sendMessage", messageData);
    }
  };

  // const sendGroupMessage = async (message) => {
  //   try {
  //     const { groupId, senderId, content, messageType, fileUrl } = message;
      
  //     // Create message with proper group reference
  //     const newMessage = await Message.create({
  //       senderId,
  //       receiverId: null,
  //       groupId,
  //       content,
  //       messageType,
  //       fileUrl,
  //       timestamp: new Date()
  //     });
  
  //     // Populate sender info
  //     const populatedMessage = await Message.findById(newMessage._id)
  //       .populate("senderId", "id email fullName image color")
  //       .lean();
  
  //     // Update group's messages array
  //     await Group.findByIdAndUpdate(groupId, {
  //       $push: { messages: newMessage._id }
  //     });
  
  //     // Get group members
  //     const group = await Group.findById(groupId)
  //       .populate("members", "_id")
  //       .populate("admin", "_id");
  
  //     // Prepare consistent message data
  //     const messageData = {
  //       ...populatedMessage,
  //       groupId: group._id,
  //       // Ensure consistent structure with direct messages
  //       _id: populatedMessage._id,
  //       createdAt: populatedMessage.timestamp || new Date()
  //     };
  
  //     // Emit to all members including admin
  //     const allRecipients = [...group.members, group.admin];
  //     allRecipients.forEach(member => {
  //       const socketId = userSocketMap.get(member._id.toString());
  //       if (socketId) {
  //         io.to(socketId).emit("receive-group-message", messageData);
  //       }
  //     });
  
  //   } catch (error) {
  //     console.error("Error in sendGroupMessage:", error);
  //   }
  // };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID : ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    // socket.on("send-group-message", sendGroupMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
