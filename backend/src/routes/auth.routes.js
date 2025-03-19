import express from "express"
import {checkAuth, login, logout, signup, updateProfile} from "../controllers/auth.controller.js"
import { privateRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post('/login' , login);

router.post('/logout' ,logout);

router.put("/update-profile" ,privateRoute , updateProfile);
router.get("/check" , privateRoute , checkAuth)
export default router;