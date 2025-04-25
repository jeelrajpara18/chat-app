/* eslint-disable react-refresh/only-export-components */
import AppLayout from "@/components/layout/AppLayout";
import { useAppStore } from "../../store/index";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "lucide-react";
import ContactContainer from "./components/contacts/ContactsContainer";
import EmptyChatContainer from "./components/empty-chat-container/EmptyChat";
import ChatContainer from "./components/chat-container/ChatContainer";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadedProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex overflow-hidden h-screen">
      {isUploading && (
        <div className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadedProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
