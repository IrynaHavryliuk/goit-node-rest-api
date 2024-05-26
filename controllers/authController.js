import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import multer from 'multer';
import jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';


const upload = multer({ dest: 'tmp/' });

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw HttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' });
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  if (!['starter', 'pro', 'business'].includes(subscription)) {
    throw HttpError(400, 'Invalid subscription type');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};
export const uploadAvatar = upload.single('avatar');

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'File not provided');
    }

    const { path: tempPath, originalname } = req.file;
    const { _id } = req.user;
    const extension = path.extname(originalname);
    const fileName = `${_id}${extension}`;
    const newPath = path.join('public', 'avatars', fileName);

    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(newPath);
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};