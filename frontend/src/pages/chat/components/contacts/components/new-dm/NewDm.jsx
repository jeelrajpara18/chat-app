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
  } from "@/components/ui/dialog"
  import Lottie from "react-lottie"
  
import { Plus } from "lucide-react";
import { useState } from "react";

const NewDm = () => {
  const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
  const [searchContacts , setSearchContacts] = useState(false);
  const [searchedContacts , setSearchedContacts] = useState([]);
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenNewContactMenu(true)}>
            <Plus className="text-neutral-400 font-light text-start hover:text-neutral-100 transition-all cursor-pointer duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Select new contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactMenu} onOpenChange={setOpenNewContactMenu}>
        <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <input placeholder="Search Contact" className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none" onChange={(e) => searchContacts(e.target.value)}/>
          </div>
          {
            searchedContacts.length<=0 &&(
                <div className="flex-1 text-white md:flex flex-col justify-center items-center  duration-100 transition-all">
                <img src="/message.png" alt="meesage icon" height={100} width={100} />
                <div className="flex flex-col gap-5 items-center mt-10 lg:text-2xl text-3xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    Hi<span className="text-blue-500">! </span>
                   Search New
                    <span className="text-blue-500"> Contact </span>
                  </h3>
                </div>
              </div>
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
