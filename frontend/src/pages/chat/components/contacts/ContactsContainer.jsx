import React, { useEffect, useState } from "react";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import NewDm from "./components/new-dm/NewDm";
import { axiosInstance } from "../../../../lib/axios";
import { GET_DM_LIST } from "../../../../utils/constants";
import { useAppStore } from "../../../../store/index";
import ContactList from "../../../../components/ui/contactList";
import CreateChannel from "./components/create-channel/CreateChannel";
import { Bell, Menu, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeContext from "../../../../ThemeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ContactsContainer = () => {
  const { directMessageContacts, setDirectMessageContacts } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getContacts = async () => {
      const response = await axiosInstance.get(GET_DM_LIST, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessageContacts(response.data.contacts);
      }
    };
    getContacts();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="p-2 rounded-md">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 border-r bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 dark:border-slate-800 border-slate-400/50 left-0 h-full z-40 transition-transform duration-300 ease-in-out w-[80vw] sm:w-[60vw] lg:static lg:w-[30vw] xl:w-[20vw] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b dark:border-slate-800 border-slate-400/50 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Logo />
          </div>
          <div className="ml-auto flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 dark:hover:text-white hover:bg-gray-300/50  dark:hover:bg-slate-800 rounded-full cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeContext />
              </TooltipTrigger>
            </Tooltip>
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-5 pl-5">
            <Title text="Direct Messages" />
            <NewDm />
          </div>
          <div className="max-h-[39vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessageContacts} />
          </div>
        </div>
      <ProfileInfo/>
      </div>

      {/* Optional overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 02"
          className="ccustom"
          fill="#2b7fff"
        />
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 02"
          className="ccompli1"
          fill="#51a2ff"
        />
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 02"
          className="ccompli2"
          fill="#8ec5ff"
        />
      </svg>
      <span className="text-3xl font-semibold">ChatU</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-5 font-light text-sm">
      {text}
    </h6>
  );
};
