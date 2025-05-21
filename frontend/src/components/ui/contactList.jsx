import { Avatar, AvatarImage } from "./avatar";
import { useAppStore } from "../../store/index";
import React from "react";
import { getColor } from "../../lib/utils";
import { HOST } from "../../utils/constants";
import { motion } from "framer-motion";

function ContactList({ contacts, isChannel = false }) {
  const {
    selectedChatType,
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("group");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  console.log(contacts);
  return (
    <div className="space-y-1 pr-2 overflow-x-hidden">
      {contacts
        ?.filter((contact) => contact && contact._id)
        .map((contact) => (
          <motion.div
            whileHover={{ x: 4 }}
            key={contact._id}
            className={`flex items-center gap-3 w-full cursor-pointer p-2 rounded-lg transition-colors ${
              selectedChatData && selectedChatData._id === contact._id
                ? "dark:bg-blue-600/20 dark:text-blue-500 bg-neutral-300/50"
                : "dark:hover:bg-slate-800/80 dark:text-slate-300 text-neutral-600 hover:bg-slate-300/50"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start dark:text-neutral-300">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.profilePic ? (
                    <AvatarImage
                      src={`${HOST}/${contact.profilePic}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`
                    ${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border border-white/50"
                        : getColor(contact.color)
                    }
                    uppercase text-lg flex items-center justify-center h-10 w-10`}
                    >
                      {contact.fullName
                        ? contact.fullName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center rounded-full justify-center">
                  #
                </div>
              )}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>{`${contact.fullName}`}</span>
              )}
            </div>
          </motion.div>
        ))}
    </div>
  );
}

export default ContactList;
