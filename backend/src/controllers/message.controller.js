import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { existsSync, mkdirSync , renameSync, unlinkSync} from 'fs';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both user Id's are required");
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { text, image } = req.body;
    const userId = req.user._id; // The user making the update request

    // Find the message to update
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is the sender of the message
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own messages" });
    }

    let updateData = {};

    // Update text if provided
    if (text !== undefined) {
      updateData.text = text;
    }

    // Handle image update if provided
    if (image) {
      // If there was a previous image, you might want to delete it from Cloudinary
      if (message.image) {
        const publicId = message.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(image);
      updateData.image = uploadResponse.secure_url;
    }

    // Update the message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log("Error in updateMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if(!req.file){
      return res.status(400).json({message : "File is required"})
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`

    mkdirSync(fileDir , {recursive : true})
    renameSync(req.file.path , fileName)
    res.status(200).json({filePath : fileName});
  } catch (error) {
    console.log("Error in updateMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
