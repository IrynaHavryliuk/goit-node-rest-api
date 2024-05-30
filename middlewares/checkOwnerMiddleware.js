import Contact from '../models/contacts.js';
import HttpError from '../helpers/HttpError.js';

const checkOwnerMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const contact = await Contact.findOne({ _id: id, owner: userId });
    if (!contact) {
      return next(HttpError(404, 'Contact not found or you do not have permission'));
    }

    req.contact = contact; // Зберігаємо контакт для подальшого використання
    next();
  } catch (error) {
    next(HttpError(404, 'Contact not found or you do not have permission'));
  }
};

export default checkOwnerMiddleware;