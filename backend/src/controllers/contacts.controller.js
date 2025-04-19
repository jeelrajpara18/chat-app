import User from "../models/user.model.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("Search term is required");
    }

    const searchTermRegEx = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(searchTermRegEx , "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ fullName: regex }, { email: regex }],
        },
      ],
    });
    return res.status(200).json({contacts})
  } catch (error) {}
};
