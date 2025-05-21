import { axiosInstance } from "../../../../../../lib/axios";
import { useSocket } from "../../../../../../context/socketContext";
import { useAppStore } from "../../../../../../store/index";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Send, SendHorizonal, Smile, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UPLOAD_FILES } from "../../../../../../utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadedProgress,
  } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const [emojiPickerOpen, setEmojiPicOpen] = useState(false);
  const handleSendMessage = () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        senderId: userInfo._id,
        receiverId: selectedChatData._id,
        content: message,
        messageType: "text",
        timestamp: new Date().toISOString(),
      });
      // } else if (selectedChatType === "group") {
      //   socket.emit("send-group-message", {
      //     groupId: selectedChatData._id,
      //     senderId: userInfo._id,
      //     content: message,
      //     messageType: "text",
      //     timestamp: new Date().toISOString(),
      //   });
    }
    setMessage(""); // clear input after sending
  };

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      console.log({ file });
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await axiosInstance.post(UPLOAD_FILES, formData, {
          withCredentials: true,
          onDownloadProgress: (data) => {
            setFileUploadedProgress(
              Math.round((100 * data.loaded) / data.total)
            );
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType == "contact") {
            socket.emit("sendMessage", {
              senderId: userInfo._id,
              content: "",
              receiverId: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
          // else if(selectedChatType === "group"){
          //   socket.emit("send-group-message" , {
          //     senderId : userInfo._id,
          //     content : "",
          //     messageType : "file",
          //     fileUrl : response.data.filePath,
          //     groupId : selectedChatData._id
          //   })
          // }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };
  return (
    <div className="p-4 border-t dark:border-slate-800 border-slate-400/50">
      <div className="flex items-center gap-2 dark:bg-slate-800/50 bg-gray-200/50 rounded-xl p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAttachmentClick}
          className="h-9 w-9 cursor-pointer dark:text-slate-400 hover:bg-gray-300/50 dark:hover:text-white dark:hover:bg-slate-700 rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <Input
          type="text"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="dark:bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
        />
        <div className="relative">
          <button
            className="text-neutral-500 dark:hover:text-white hover:text-neutral-600 focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer"
            onClick={() => setEmojiPicOpen(true)}
          >
            <Smile className="h-5 w-5" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
        <Button
          size="icon"
          className="h-9 w-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageBar;
