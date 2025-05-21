import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "../../../../../../lib/axios";
import { HOST, SEARCH_CONTACTS } from "../../../../../../utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store/index";

const NewDm = () => {
    const {setSelectedChatType , setSelectedChatData} = useAppStore();
  const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await axiosInstance.post(SEARCH_CONTACTS, { searchTerm });
        if (res.status == 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactMenu(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact")
    setSearchedContacts([])
  }
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenNewContactMenu(true)}>
            <Plus className="text-neutral-400 font-light text-start hover:text-neutral-600 dark:hover:text-neutral-100 transition-all cursor-pointer duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Select new contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactMenu} onOpenChange={setOpenNewContactMenu}>
        <DialogContent className="dark:bg-[#181920] border-none dark:text-white h-[400px] w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <input
              placeholder="Search Contact"
              className="rounded-lg p-4 w-full dark:bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[240px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => selectNewContact(contact)}
                >
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {contact.profilePic ? (
                      <AvatarImage
                        src={`${HOST}/${contact.profilePic}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`uppercase text-lg flex items-center justify-center h-12 w-12 ${getColor(
                          contact.color
                        )}`}
                      >
                        {contact.fullName
                          ? contact.fullName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <div>
                    {contact.fullName ? `${contact.fullName}` : ""}
                    </div>
                    <div className="text-xs">{contact.email}</div>
                </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 dark:text-white md:flex flex-col justify-center items-center  duration-100 transition-all">
              <img
                src="/message.png"
                alt="meesage icon"
                height={100}
                width={100}
              />
              <div className="flex flex-col gap-5 items-center mt-10 lg:text-2xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-blue-500">! </span>
                  Search New
                  <span className="text-blue-500"> Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
