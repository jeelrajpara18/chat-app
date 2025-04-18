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
import { LOGOUT_ROUTES } from "../../../../../../utils/constants";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo , setUserInfo} = useAppStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axiosInstance.post(LOGOUT_ROUTES , {} , {withCredentials : true});
      if (res.status === 200) {
        toast("Logged Out Successfully");
        setUserInfo(null)
        navigate("/auth", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Logout failed");
    }
  };
  console.log(userInfo);
  return (
    <div className="absolute text-white bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 justify-center items-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.profilePic ? (
              <AvatarImage
                src={`${userInfo.profilePic}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase text-lg flex items-center justify-center h-12 w-12 ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.fullName
                  ? userInfo.fullName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>{userInfo.fullName ? `${userInfo.fullName}` : ""}</div>
      </div>
      <div className="flex justify-between gap-5">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={() => navigate("/profile")}>
                <Edit
                  className="text-blue-800"
                />
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
            <TooltipTrigger onClick={handleLogOut}>
              <LogOut className="text-red-700" />
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
