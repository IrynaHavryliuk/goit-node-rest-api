import fs from 'fs/promises';
import path from 'path';
import Jimp from 'jimp';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

export const uploadAvatar = async (req, res, next) => {
  res.send("Upload avatar");
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id: userId } = req.user;

    const ext = originalname.split('.').pop();
    const fileName = `${userId}.${ext}`;
    const resultUpload = path.join(avatarsDir, fileName);

    await Jimp.read(tempUpload)
      .then(image => image.resize(250, 250).write(resultUpload))
      .catch(err => {
        throw HttpError(500, `Error processing image: ${err.message}`);
      });

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(userId, { avatarURL });

    res.json({ avatarURL });
  } catch (err) {
    next(err);
  }
};
