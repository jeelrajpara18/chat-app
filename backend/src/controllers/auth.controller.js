import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
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
      fullName,
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
            phoneNumber : user.phoneNumber
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
        const { profilePic, phoneNumber, status, lastSeen, bio } = req.body;
        const userId = req.user?._id;
        
        // Create update object with only provided fields
        const updateFields = Object.entries({ phoneNumber, status, lastSeen, bio })
            .reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = value;
                return acc;
            }, {});
        
        // Handle profile picture upload if provided
        if (profilePic) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                    folder: "profile_pictures",
                    resource_type: "image"
                });
                updateFields.profilePic = uploadResponse.secure_url;
            } catch (uploadError) {
                return res.status(400).json({ 
                    message: "Failed to upload profile picture", 
                    error: uploadError.message 
                });
            }
        }
        
        // Return error if no fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one valid field is required for update" });
        }
        
        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

export const checkAuth = (req , res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error"});
    }
}