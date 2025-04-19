import { Server as SockeIOServer } from "socket.io";

export const initializeSocket = (server) => {
  const io = new SockeIOServer(server, {
    cors: { origin: process.env.FRONTEND_URL , methods : ["GET" , "POST"] , credentials : true}
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected : ${socket.id}`);
    for(const [userId , socketId] of userSocketMap.entries()){
      if(socketId === socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }
  }

  io.on("connection" , (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
      userSocketMap.set(userId , socket.id);
      console.log(`User connected: ${userId} with socket ID : ${socket.id}`)
    }
    else{
      console.log("User ID not provided during connection")
    }
    socket.on("disconnect" , ()=>disconnect(socket))
  })
};
