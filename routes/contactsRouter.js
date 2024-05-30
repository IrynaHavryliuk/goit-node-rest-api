import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact, 
} from "../controllers/contactsControllers.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkOwnerMiddleware from '../middlewares/checkOwnerMiddleware.js';  // Додайте ваш middleware для перевірки власника

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware); // Додаємо authMiddleware для всіх маршрутів

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

contactsRouter.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

export default contactsRouter;