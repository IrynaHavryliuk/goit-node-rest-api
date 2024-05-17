import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact, // You will need to create this controller
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

// List all contacts
contactsRouter.get("/", getAllContacts);

// Get a specific contact by ID
contactsRouter.get("/:id", getOneContact);

// Delete a specific contact by ID
contactsRouter.delete("/:id", deleteContact);

// Create a new contact
contactsRouter.post("/", createContact);

// Update a specific contact by ID
contactsRouter.put("/:id", updateContact);

// Update the favorite status of a specific contact by ID
contactsRouter.patch("/:id/favorite", updateStatusContact);

export default contactsRouter;
