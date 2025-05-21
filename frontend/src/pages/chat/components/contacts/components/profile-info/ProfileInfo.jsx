import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "../../../../../../store/index";
// import { HOST } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../../../lib/axios";
import { HOST, LOGOUT_ROUTES } from "../../../../../../utils/constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  // console.log(userInfo.profilePic)

  const handleLogOut = async () => {
    try {
      const res = await axiosInstance.post(
        LOGOUT_ROUTES,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast("Logged Out Successfully");
        setUserInfo(null);
        navigate("/auth", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Logout failed");
    }
  };
  // console.log(userInfo);
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-4 w-full mt-auto py-4 border-t dark:border-slate-800 border-slate-400/50">
      <div className="flex gap-3 justify-center items-center">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-slate-700">
            {userInfo.profilePic ? (
              <AvatarImage
                src={`${HOST}/${userInfo.profilePic}`}
                alt="profile"
                className="object-cover w-full h-full bg-slate-700"
              />
            ) : (
              <div
                className={`uppercase text-5xl flex items-center justify-center w-full h-full ${getColor(
                  userInfo.color
                )}`}
              >
                {(userInfo?.fullName || userInfo?.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-sm font-medium">
          {userInfo.fullName ? `${userInfo.fullName}` : ""}
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={() => navigate("/profile")} asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 dark:hover:text-white hover:bg-gray-300/50  dark:hover:bg-slate-800 rounded-full"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={handleLogOut} asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 dark:hover:text-white hover:bg-gray-300/50  dark:hover:bg-slate-800 rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
