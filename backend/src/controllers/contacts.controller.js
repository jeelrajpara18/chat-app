import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("Search term is required");
    }

    const searchTermRegEx = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(searchTermRegEx, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ fullName: regex }, { email: regex }],
        },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {}
};

export const getContactsForDmList = async (req, res) => {
  try {
    let userId = req.user._id;

    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", userId] },
              then: "$receiverId",
              else: "$senderId",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          fullName: "$contactInfo.fullName",
          phoneNumber: "$contactInfo.phoneNumber",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
          profilePic : "$contactInfo.profilePic"
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {}
};
