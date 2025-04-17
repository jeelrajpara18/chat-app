import { getSalt } from "bcryptjs";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    fullName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: Number,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      default: "",
    },
    profileSetup : {
      type : Boolean,
      default : false
    },
    color : {
      type : Number,
      default : false
    }
  },
  { timestamps: true }
);


const User = mongoose.model("User" , userSchema);
export default User