import mongoose from "mongoose";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user._id;

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json({ message: "User not found" });
    }

    const validMember = await User.find({ _id: { $in: members } });
    if (validMember.length !== members.length) {
      return res
        .status(400)
        .json({ message: "Some members are not valid users" });
    }

    const newGroup = new Group({
      name,
      members,
      admin: userId,
    });
    await newGroup.save();
    return res.status(200).json({
      message: "Group created",
      group: newGroup,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const groups = await Group.find({
      $or : [{admin : userId } , {members : userId}]
    }).sort({updatedAt : -1})
    return res.status(200).json({groups})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
