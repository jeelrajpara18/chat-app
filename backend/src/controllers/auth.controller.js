import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { existsSync, mkdirSync , renameSync, unlinkSync} from 'fs';
export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6 || password.length > 10) {
      return res
        .status(400)
        .json({ message: "Password must be 6 to 10 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        phoneNumber: newUser.phoneNumber,
        profileSetup : newUser.profileSetup
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signUp controller", error.message);
    res.status(500).json({ message: "Interval Server Error  " });
  }
};

export const login = async(req , res)=> {
    const {email , password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
           return res.status(400).json({message : "Invalid Credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password , user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"})
        }
        generateToken(user._id , res);

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            profilePic : user.profilePic,
            phoneNumber : user.phoneNumber,
            email : user.email,
            bio : user.bio,
            color : user.color,
            profileSetup : user.profileSetup
        })
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ message: "Interval Server Error  " });
    }
}

export const logout = async(req , res) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0})
        res.status(200).json({message : "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller" , error.message);
        res.status(500).json({message : "Internal server error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
      const { phoneNumber, bio, fullName, color } = req.body;
      const userId = req.user._id;
  
      // Basic validation
      if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
      }
  
      const updateData = {
        $set: {
          phoneNumber: phoneNumber || undefined, // Set to undefined to remove if empty
          bio: bio || undefined,
          fullName,
          color: color || 0, // Default color if not provided
          profileSetup: true
        }
      };
  
      // Handle profilePic upload if provided
      // if (profilePic) {
      //   const uploadResponse = await cloudinary.uploader.upload(profilePic);
      //   updateData.$set.profilePic = uploadResponse.secure_url;
      // }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true } // Return updated doc and run schema validators
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const addProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    // Add forward slash between directory and filename
    let fileName = `uploads/profilePic/${date}${req.file.originalname}`;
    
    // Ensure the directory exists
    const dir = 'uploads/profilePic';
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    renameSync(req.file.path, fileName);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: fileName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeProfileImage =async (req , res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
      return res.status(401).send("User not found");
    }
    if(user.profilePic){
      unlinkSync(user.profilePic)
    }
    user.profilePic = null;
    await user.save();
    return res.status(200).json({message : "Profile image removed successfully"})
  } catch (error) {
    console.error("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const checkAuth = (req , res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error"});
    }
}