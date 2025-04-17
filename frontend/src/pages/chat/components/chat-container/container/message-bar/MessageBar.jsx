import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
            setEmojiPicOpen(false)
        }
    }
    document.addEventListener("mousedown" , handleClickOutside);
    return () => {
        document.removeEventListener("mousedown" , handleClickOutside)
    }
  },[emojiRef])
  const [emojiPickerOpen , setEmojiPicOpen] = useState(false)
  const handleSendMessage = async () => {};
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }
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
        <button className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer">
          <Paperclip className="text-2xl" />
        </button>
        <div className="relative">
          <button className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer" onClick={() => setEmojiPicOpen(true)}>
            <SmilePlus className="text-2xl"/>
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false}/>
          </div>
        </div>
      </div>
      <button
        className="bg-[#002472] rounded-md flex items-center justify-center 
      p-5 hover:bg-[#001e6c] focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer"
        onSubmit={handleSendMessage}
      >
        <SendHorizonal className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
