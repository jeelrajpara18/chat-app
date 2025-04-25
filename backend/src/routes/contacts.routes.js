import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllContacts, getContactsForDmList, searchContacts } from "../controllers/contacts.controller.js";
const contactRoutes = express.Router();

contactRoutes.post("/search-contact" , protectRoute , searchContacts);
contactRoutes.get("/get-contacts" , protectRoute , getContactsForDmList);
contactRoutes.get("/get-all-contacts" , protectRoute , getAllContacts);

export default contactRoutes;