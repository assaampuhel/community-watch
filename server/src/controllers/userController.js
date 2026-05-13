import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ handle: req.params.handle });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.avatar) updates.avatar = req.body.avatar;
    if (req.body.rating !== undefined) updates.rating = req.body.rating;
    if (req.body.role) updates.role = req.body.role;

    const user = await User.findOneAndUpdate(
      { handle: req.params.handle },
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
