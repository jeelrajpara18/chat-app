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
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../../../lib/axios";
import {
  GET_ALL_CONTACT,
  HOST,
  SEARCH_CONTACTS,
} from "../../../../../../utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store/index";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multi-select";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [allContact, setallContact] = useState([]);
  const [selectedContact, setselectedContact] = useState([]);
  const [channelName, setchannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await axiosInstance.get(GET_ALL_CONTACT, {
        withCredentials: true,
      });
      setallContact(response.data.contacts);
    };
    getData();
  }, []);
  const createChannel = async () => {};
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenNewContactMenu(true)}>
            <Plus className="text-neutral-400 font-light text-start hover:text-neutral-100 transition-all cursor-pointer duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactMenu} onOpenChange={setOpenNewContactMenu}>
        <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <input
              placeholder="Channel Name"
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none"
              onChange={(e) => setchannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContact}
              placeholder="Search Contact"
              value={selectedContact}
              onChange={setselectedContact}
              emptyIndicator={
                <p className="text-center text-gray-600">
                  No results found
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-blue-700 hover:bg-blue-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateChannel;
