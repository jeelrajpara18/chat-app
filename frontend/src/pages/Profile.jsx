/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ArrowLeft, Delete, Plus } from "lucide-react";
import { useAppStore } from "../store/index";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors, getColor } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "../lib/axios";
import { UPDATE_USER_PROFILE } from "../utils/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userInfo, setUserInfo } = useAppStore();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFullName(userInfo.fullName || "");
      setBio(userInfo.bio || "");
      setPhoneNumber(userInfo.phoneNumber || "");
      setSelectedColor(userInfo.color !== undefined ? userInfo.color : 0);
      setImage(userInfo.profilePic);
    }
  }, [userInfo]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setImage(base64Image);
    };
  };

  const saveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        UPDATE_USER_PROFILE,
        {
          fullName: fullName,
          bio: bio,
          phoneNumber: phoneNumber,
          profilePic: image,
          color: selectedColor,
        },
        {
          withCredentials: true, // 👈 VERY IMPORTANT for cookies
        }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data.user });
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };
  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl p-6 md:p-10">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="p-2 text-white/90 hover:bg-[#2c2e3b]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-2xl font-medium ml-2">Edit Profile</h1>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          <div className="flex flex-col items-center gap-6">
            <div
              className="w-40 h-40 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-full w-full rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase text-5xl flex items-center justify-center w-full h-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {fullName
                      ? fullName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>

              {hovered &&
                (image ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                    onClick={handleDeleteImage}
                  >
                    <Delete className="text-white text-3xl" />
                  </div>
                ) : (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                  >
                    <Plus className="text-white text-3xl" />
                  </label>
                ))}

              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1b1c24]"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 text-white">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-white/70">
                Email
              </label>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email || ""}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm text-white/70">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm text-white/70">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                placeholder="Phone Number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm text-white/70">
                Bio
              </label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full min-h-[120px] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            className="h-14 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 text-white font-medium"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
