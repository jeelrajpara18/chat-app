import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createGroup, getGroup } from "../controllers/group.controller.js";
const router = express.Router();

router.post("/create-group" , protectRoute , createGroup);
router.get("/get-group-users" , protectRoute , getGroup);
// router.get("/get-group-messages" , protectRoute , getGroupMessages);
export default router