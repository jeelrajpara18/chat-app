import ChatHeader from "./container/chat-header/ChatHeader"
import MessageBar from "./container/message-bar/MessageBar"
import MessageContainer from "./container/messageContainer/MessageContainer"

const ChatContainer = () => {
  return (
    <div className="fixed h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 text-white">
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </div>
  )
}

export default ChatContainer