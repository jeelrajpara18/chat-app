import { X } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center justify-center gap-5">
            <button className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer">
              <X className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
