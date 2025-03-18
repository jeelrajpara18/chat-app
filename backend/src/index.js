import express, { json } from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
const app = express();
dotenv.config();
app.use(express.json());

app.use("/api/auth" , authRoutes);
const Port = process.env.PORT

app.listen(Port , () => {
    console.log("Server is running on port : " + Port)
    connectDB();
})