import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, updateMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users" , protectRoute , getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.put("/update/:id", protectRoute, updateMessage);
export default router