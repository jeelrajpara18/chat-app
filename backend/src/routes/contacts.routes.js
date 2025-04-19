import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { searchContacts } from "../controllers/contacts.controller.js";
const contactRoutes = express.Router();

contactRoutes.post("/search-contact" , protectRoute , searchContacts)
export default contactRoutes;