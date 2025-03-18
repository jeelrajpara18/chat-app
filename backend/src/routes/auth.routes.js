import express from "express"
import {signup} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);

router.post('/login' , (req , res) => {
    res.send("Login route")
})

router.post('/logout' , (req , res) => {
    res.send("Logout route")
})

export default router;