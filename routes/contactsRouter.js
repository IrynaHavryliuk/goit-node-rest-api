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
contactsRouter.get("/:id", checkOwnerMiddleware, getOneContact);
contactsRouter.delete("/:id", checkOwnerMiddleware, deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", checkOwnerMiddleware, updateContact);
contactsRouter.patch("/:contactId/favorite", checkOwnerMiddleware, updateStatusContact);

export default contactsRouter;
