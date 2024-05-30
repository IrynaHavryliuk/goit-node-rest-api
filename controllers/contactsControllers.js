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

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;

    const query = { owner: req.user._id };
    if (favorite) {
      query.favorite = favorite === 'true';
    }

    const contacts = await Contact.find(query).skip(skip).limit(Number(limit));
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ _id: id, owner: req.user._id });
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
    const contact = await Contact.findOneAndDelete({ _id: id, owner: req.user._id });
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
    const validate = await createContactSchema.validateAsync(req.body);
    if (validate.error) {
      throw HttpError(400, { message: validate.error.message });
    }
    const contact = await addContact({ ...req.body, owner: req.user._id });
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validate = await updateContactSchema.validateAsync(req.body);
    if (validate.error) {
      throw HttpError(400, { message: validate.error.message });
    }
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) {
      throw HttpError(404, "Contact not found");
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

 