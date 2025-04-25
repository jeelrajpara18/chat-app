import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store/index";
import moment from "moment";
import { axiosInstance } from "../../../../../../lib/axios";
import { GET_ALL_MESSAGE, HOST } from "../../../../../../utils/constants";
import { Download, File, Folder, X } from "lucide-react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadedProgress,
    setIsDownloading
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
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {}
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
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
    setFileDownloadedProgress(0)
    const response = await axiosInstance.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress : (progressEvent) => {
        const {loaded , total} = progressEvent;
        const percentCompleted = Math.round((loaded * 100));
        setFileDownloadedProgress(percentCompleted)
      }
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
    setFileDownloadedProgress(0)
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
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
        </div>
      );
    });
  };
  const renderDMMessage = (message) => (
    <div
      className={`${
        message.senderId === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.senderId !== selectedChatData._id
              ? "bg-[#0957a5]/5 text-[#0957a5]/90 border-[#0957a5]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.senderId !== selectedChatData._id
              ? "bg-[#0957a5]/5 text-[#0957a5]/90 border-[#0957a5]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
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
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8  text-3xl bg-black/20 rounded-full p-3">
                <Folder />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <Download />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="">{moment(message.createdAt).format("LT")}</div>
    </div>
  );
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
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all" onClick={() => {
                  setshowImage(false);
                  setimageUrl(null);
                }}>
              <X/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
