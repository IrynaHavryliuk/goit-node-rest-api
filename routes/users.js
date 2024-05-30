import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'; // імпорт за замовчуванням
import { uploadAvatar, updateAvatar } from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const tmpDir = path.join(process.cwd(), 'tmp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.patch('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

export default router;
