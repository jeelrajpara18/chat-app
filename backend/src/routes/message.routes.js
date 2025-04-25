import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, updateMessage, uploadFile } from "../controllers/message.controller.js";
import multer from "multer"
const router = express.Router();
const uploads = multer({ dest: "uploads/files/" });

router.get("/users" , protectRoute , getUsersForSidebar);
router.post("/get-messages", protectRoute, getMessages);
router.post("/upload-file" , protectRoute , uploads.single("file") , uploadFile)

router.post("/send/:id", protectRoute, sendMessage);
router.put("/update/:id", protectRoute, updateMessage);
export default router