import { axiosInstance } from "../../../../../../lib/axios";
import { useSocket } from "../../../../../../context/socketContext";
import { useAppStore } from "../../../../../../store/index";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UPLOAD_FILES } from "../../../../../../utils/constants";

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
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer"
          onClick={handleAttachmentClick}
        >
          <Paperclip className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer"
            onClick={() => setEmojiPicOpen(true)}
          >
            <SmilePlus className="text-2xl" />
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
      </div>
      <button
        className="bg-[#002472] rounded-md flex items-center justify-center 
      p-5 hover:bg-[#001e6c] focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer"
        onClick={handleSendMessage}
      >
        <SendHorizonal className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
