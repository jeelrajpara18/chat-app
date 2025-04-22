import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getContactsForDmList, searchContacts } from "../controllers/contacts.controller.js";
const contactRoutes = express.Router();

contactRoutes.post("/search-contact" , protectRoute , searchContacts);
contactRoutes.get("/get-contacts" , protectRoute , getContactsForDmList);

export default contactRoutes;