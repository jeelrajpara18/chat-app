import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "../../../../../../store/index";
import { X } from "lucide-react";
import { getColor } from "../../../../../../lib/utils";
import { HOST } from "../../../../../../utils/constants";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  // console.log(selectedChatData , "dattaa")
  return (
  <div className="h-[10vh] dark:text-white border-b-1 dark:border-slate-800 border-slate-400/50 flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          {selectedChatType == "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.profilePic ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.profilePic}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase text-lg text-neutral-300 flex items-center justify-center h-12 w-12 ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.fullName
                    ? selectedChatData.fullName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center rounded-full justify-center text-white">
              #
            </div>
          )}
          <div className="dark:text-white">
            {selectedChatType == "group" && selectedChatData.name}
            {selectedChatType == "contact" && selectedChatData.fullName
              ? selectedChatData.fullName
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="dark:text-neutral-500 dark:hover:text-white text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-0 duration-300 transition-all cursor-pointer">
            <X className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
