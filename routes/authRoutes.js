
import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'missing required field email' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'Verification has already been passed' });
    }

    const verificationLink = `http://localhost:3000/users/verify/${user.verificationToken}`;
    
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
