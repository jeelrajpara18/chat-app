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
  CREATE_GROUP,
  GET_ALL_CONTACT,
  HOST,
  SEARCH_CONTACTS,
} from "../../../../../../utils/constants";
import { useAppStore } from "../../../../../../store/index";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multi-select";

const createGroup = () => {
  const { setSelectedChatType, setSelectedChatData, addGroups } = useAppStore();
  const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [allContact, setallContact] = useState([]);
  const [selectedContact, setselectedContact] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await axiosInstance.get(GET_ALL_CONTACT, {
        withCredentials: true,
      });
      setallContact(response.data.contacts);
    };
    getData();
  }, []);
  const createGroup = async () => {
    // debugger
    try {
      if (groupName.length > 0 && selectedContact.length > 0) {
        const response = await axiosInstance.post(CREATE_GROUP, {
          name: groupName,
          members: selectedContact.map((contact) => contact.value),
        });
        if (response.status == 200) {
          setGroupName("");
          setSearchedContacts([]);
          setOpenNewContactMenu(false);
          addGroups(response.data.group);
          return response.data.group; 
        }
        console.log(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenNewContactMenu(true)} asChild>
            <Plus className="text-neutral-400 font-light text-start hover:text-neutral-100 transition-all cursor-pointer duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Group</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactMenu} onOpenChange={setOpenNewContactMenu}>
        <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill up the details for new Group</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <input
              placeholder="Group Name"
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none"
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
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
                <p className="text-center text-gray-600">No results found</p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-blue-700 hover:bg-blue-900 transition-all duration-300"
              onClick={createGroup}
            >
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default createGroup;
