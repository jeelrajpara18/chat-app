import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/groups.routes.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import contactRoutes from "./routes/contacts.routes.js";
import { initializeSocket } from "./lib/socket.js";
import path from "path";

dotenv.config();
const app = express();
const Port = process.env.PORT || 5000; // Add fallback port
const _dirname = path.resolve();

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
// app.use(express.json())
app.use(cookieParser());

// CORS - consider if you really need this if Socket.IO handles it
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Serve uploaded images statically (correct path)
app.use("/uploads/profilePic", express.static("uploads/profilePic"));
app.use("/uploads/files", express.static("uploads/files"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups" , groupRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname , "..frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
const server = app.listen(Port, () => {
  console.log(`Server is running on port: ${Port}`);
  connectDB();
});

// Initialize Socket.IO
initializeSocket(server);