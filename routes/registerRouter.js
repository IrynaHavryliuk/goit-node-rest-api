import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const router = express.Router();

// Функція для відправки верифікаційного листа
const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();

    const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({ message: 'User registered, verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Маршрут для верифікації користувача
router.get('/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
