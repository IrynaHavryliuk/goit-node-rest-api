import express from 'express';
import { register, login, logout, getCurrentUser, updateSubscription } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, getCurrentUser);
router.patch('/', authMiddleware, updateSubscription); // Assuming updateSubscription is exported from authController.js

export default router;
