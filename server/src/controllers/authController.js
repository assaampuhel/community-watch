import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { handle, email, password } = req.body;

    // 1. Check if user already exists in OUR DB (handle or email)
    const existingUser = await User.findOne({ $or: [{ handle }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Handle or Email already registered' });
    }

    // 2. Verify handle exists on Codeforces
    const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const cfData = await cfResponse.json();

    if (cfData.status !== 'OK') {
      return res.status(400).json({ error: `Codeforces handle "${handle}" does not exist.` });
    }

    const cfUser = cfData.result[0];
    const rating = cfUser.rating || 0;
    const avatar = cfUser.titlePhoto;

    // 3. Assign role based on rating (Moderator if rating >= 1500)
    const role = rating >= 1500 ? 'moderator' : 'user';

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user
    const user = await User.create({
      handle,
      email,
      password: hashedPassword,
      role,
      rating,
      avatar
    });

    // 6. Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        handle: user.handle,
        email: user.email,
        role: user.role,
        rating: user.rating,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { handle, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ handle });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        handle: user.handle,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side by removing the token
  // This endpoint can be used for any server-side cleanup if needed
  res.json({ message: 'Logged out successfully' });
};