import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "../../../../../../store/index";
import { X } from "lucide-react";
import { getColor } from "../../../../../../lib/utils";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] text-white border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {selectedChatData.profilePic ? (
              <AvatarImage
                src={`${selectedChatData.profilePic}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase text-lg flex items-center justify-center h-12 w-12 ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.fullName
                  ? selectedChatData.fullName.split("").shift()
                  : selectedChatData.email.split("").shift()}
              </div>
            )}
          </Avatar>
          <div>
            {selectedChatType == "contact" && selectedChatData.fullName
              ? selectedChatData.fullName
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 hover:text-white focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer">
            <X className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
