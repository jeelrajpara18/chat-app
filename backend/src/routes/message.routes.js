import express from "express"
import { protectRoute } from "../middlewares/auth.middleware";
import { getMessages, getUsersForSidebar, sendMessage, updateMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/users" , protectRoute , getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.put("/update/:id", protectRoute, updateMessage);
