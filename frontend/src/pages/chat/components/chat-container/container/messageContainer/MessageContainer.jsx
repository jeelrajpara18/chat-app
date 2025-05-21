import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store/index";
import moment from "moment";
import { axiosInstance } from "../../../../../../lib/axios";
import { GET_ALL_MESSAGE, HOST } from "../../../../../../utils/constants";
import { Download, File, Folder, X } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadedProgress,
    setIsDownloading,
  } = useAppStore();
  const [showImage, setshowImage] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.post(
          GET_ALL_MESSAGE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          console.log("Got messages:", response.data.messages);
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (selectedChatData._id) {
      getMessages(); // Fetch messages for both contact and group
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    console.log("selectedChatMessages:", selectedChatMessages);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadedProgress(0);
    const response = await axiosInstance.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round(loaded * 100);
        setFileDownloadedProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadedProgress(0);
  };
  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>
          )}{" "}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {/* {selectedChatType === "group" && renderGroupMessage(message)} */}
        </div>
      );
    });
  };
  const renderDMMessage = (message) => {
    const isSender = message.senderId === userInfo._id;
    const otherUser = selectedChatData;

    // Determine avatar source and fallback
    const avatarData = isSender ? userInfo : otherUser;
    const avatarUrl = `${HOST}/${avatarData.profilePic}`;
    const avatarColor = getColor(avatarData.color);
    const avatarInitial = avatarData.fullName
      ? avatarData.fullName.charAt(0).toUpperCase()
      : avatarData.email.charAt(0).toUpperCase();

    return (
      <div
        className={`flex items-end my-2 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        {!isSender && (
          <Avatar className="h-6 w-6 rounded-full overflow-hidden mr-2">
            {avatarData.profilePic ? (
              <AvatarImage
                src={avatarUrl}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase text-sm text-neutral-300 flex items-center justify-center h-8 w-8 ${avatarColor}`}
              >
                {avatarInitial}
              </div>
            )}
          </Avatar>
        )}

        <div className="relative max-w-md">
          {/* TEXT MESSAGE */}
          {message.messageType === "text" && (
            <>
              <div
                className={`${
                  isSender
                    ? "bg-blue-500 dark:bg-blue-600 rounded-xl rounded-br-none text-white"
                    : "bg-gray-200/50 dark:bg-slate-800 rounded-xl rounded-bl-none dark:text-white"
                } p-2 break-words`}
              >
                {message.content}
              </div>
              <div
                className={`text-xs dark:text-gray-300 text-slate-500 mt-1 ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {moment(message.createdAt).format("LT")}
              </div>
            </>
          )}

          {/* FILE MESSAGE */}
          {message.messageType === "file" && (
            <>
              <div
                className={`${
                  isSender
                    ? "bg-blue-500 dark:bg-blue-600 rounded-xl rounded-br-none text-white"
                    : "bg-gray-200/50 dark:bg-slate-800 rounded-xl rounded-bl-none dark:text-white"
                } p-2 break-words`}
              >
                {checkIfImage(message.fileUrl) ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setshowImage(true);
                      setimageUrl(message.fileUrl);
                    }}
                  >
                    <img
                      src={`${HOST}/${message.fileUrl}`}
                      height={300}
                      width={300}
                      className="rounded"
                      alt="shared"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-2xl bg-black/20 rounded-full p-3">
                      <Folder className="h-5 w-5" />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>
                    <span
                      className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all"
                      onClick={() => downloadFile(message.fileUrl)}
                    >
                      <Download className="h-5 w-5" />
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`text-xs dark:text-gray-300 text-slate-500 mt-1 ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {moment(message.createdAt).format("LT")}
              </div>
            </>
          )}
        </div>

        {isSender && (
          <Avatar className="h-8 w-8 object-cover rounded-full overflow-hidden ml-2">
            {avatarData.profilePic ? (
              <AvatarImage
                src={avatarUrl}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase text-sm text-neutral-300 flex items-center justify-center h-8 w-8 ${avatarColor}`}
              >
                {avatarInitial}
              </div>
            )}
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg-w[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-screen w-screen flex items-center justify-center backdrop:blur-3xl flex-col ">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all">
              <Download onClick={() => downloadFile(imageUrl)} />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all"
              onClick={() => {
                setshowImage(false);
                setimageUrl(null);
              }}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
