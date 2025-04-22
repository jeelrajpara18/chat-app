import express from "express";
import {
  addProfileImage,
  checkAuth,
  login,
  logout,
  removeProfileImage,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const uploads = multer({ dest: "uploads/profilePic/" });

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.post(
  "/add-profile-image",
  protectRoute,
  uploads.single("profilePic"),
  addProfileImage
);
router.delete("/remove-profile-image" , protectRoute , removeProfileImage)
router.get("/user-info", protectRoute, checkAuth);
export default router;
