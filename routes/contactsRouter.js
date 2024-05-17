// routes/contactsRouter.js

import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
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
contactsRouter.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    // Call updateStatusContact function with contactId and favorite
    const updatedContact = await updateStatusContact(contactId, { favorite });
    
    // If update is successful, return the updated contact
    res.status(200).json(updatedContact);
  } catch (error) {
    // If contact is not found, return 404 status with message
    res.status(404).json({ message: "Not found" });
  }
});

export default contactsRouter;
