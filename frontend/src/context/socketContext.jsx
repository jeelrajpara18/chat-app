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

      const handleReceiveGroupMessage = (message) => {
        console.log("Received group message:", message);
        
        const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
        
        // Normalize message structure
        const normalizedMessage = {
          ...message,
          // Ensure consistent field names with direct messages
          _id: message._id,
          createdAt: message.createdAt || message.timestamp,
          senderId: message.senderId, // already populated
          groupId: message.groupId || message._id // fallback to _id if groupId missing
        };
      
        if (selectedChatType === "group" && selectedChatData?._id === normalizedMessage.groupId) {
          console.log("Adding group message to store:", normalizedMessage);
          addMessage(normalizedMessage);
        }
      };

      socket.current.on("sendMessage", handleMessage);
      socket.current.on("receive-group-message" , handleReceiveGroupMessage)
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
