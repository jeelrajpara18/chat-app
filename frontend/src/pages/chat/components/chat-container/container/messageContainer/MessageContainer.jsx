import { useEffect, useRef } from "react";
import { useAppStore } from "../../../../../../store/index";
import moment from "moment";
import { axiosInstance } from "../../../../../../lib/axios";
import { GET_ALL_MESSAGE } from "../../../../../../utils/constants";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.post(
          GET_ALL_MESSAGE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
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
  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
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
      <div className="">{moment(message.timeStamp).format("LT")}</div>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg-w[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
