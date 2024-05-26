import HttpError from "../helpers/HttpError.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contact = await listContacts();
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const validate = await createContactSchema.validateAsync(req.body);
    if (validate.error) {
      throw HttpError(400, { message: validate.error.message });
    }
    const contact = await addContact({ id, name, email, phone });
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const validate = await updateContactSchema.validateAsync(req.body);
    if (validate.error) {
      throw HttpError(400, { message: validate.error.message });
    }
    const contact = await changeContact(id, { name, email, phone });
    if (!contact) {
      throw HttpError(404, "id not found");
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
};
export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: req.user._id },
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

 