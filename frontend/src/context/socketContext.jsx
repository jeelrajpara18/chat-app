import { HOST } from "../utils/constants";
import { useAppStore } from "../store/index";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
      
      const handleMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        
        // Check if the current chat is related to this message
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.senderId._id ||
           selectedChatData._id === message.receiverId._id)
        ) {
          console.log("Message handled:", message);
          addMessage(message);
        }
      };
      
      // Listen for both message events with the same handler
      socket.current.on("receiveMessage", handleMessage);
      socket.current.on("sendMessage", handleMessage);
      
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};