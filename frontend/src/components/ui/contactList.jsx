import { Avatar, AvatarImage } from "./avatar";
import { useAppStore } from "../../store/index";
import React from "react";
import { getColor } from "../../lib/utils";
import { HOST } from "../../utils/constants";

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
  console.log(contacts)
  return (
    <div className="mt-5 text-black">
      {contacts?.filter((contact) => contact && contact._id).map((contact) =>(
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#0957a5] hover:bg-[#0957a5]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
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
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center rounded-full justify-center">#
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.fullName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
