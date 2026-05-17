import User from '../models/User.js';
import VerificationChallenge from '../models/VerificationChallenge.js';
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

export const signupChallenge = async (req, res) => {
  try {
    const { handle, email, password } = req.body;

    if (!handle || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

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

    // 3. Generate secure randomized alphanumeric token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tokenSuffix = '';
    for (let i = 0; i < 6; i++) {
      tokenSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const token = `CW-VRFY-${tokenSuffix}`;

    // 4. Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save/Update Verification Challenge (Upsert based on handle or email)
    await VerificationChallenge.deleteMany({ $or: [{ handle }, { email }] });

    const challenge = await VerificationChallenge.create({
      handle,
      email,
      password: hashedPassword,
      token
    });

    res.status(200).json({
      message: 'Challenge generated successfully.',
      token: challenge.token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signupVerify = async (req, res) => {
  try {
    const { handle } = req.body;

    if (!handle) {
      return res.status(400).json({ error: 'Please provide the Codeforces handle to verify.' });
    }

    // 1. Locate the challenge
    const challenge = await VerificationChallenge.findOne({ handle });
    if (!challenge) {
      return res.status(400).json({ error: 'Verification session expired or not found. Please start over.' });
    }

    // 2. Fetch Codeforces API to inspect public profile Organization field
    const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const cfData = await cfResponse.json();

    if (cfData.status !== 'OK') {
      return res.status(400).json({ error: `Could not verify handle: Codeforces API returned error.` });
    }

    const cfUser = cfData.result[0];
    const organization = cfUser.organization ? cfUser.organization.trim() : '';

    // 3. Match checking
    if (organization !== challenge.token) {
      return res.status(400).json({ 
        error: `Verification mismatch. We expected "${challenge.token}" inside the Organization field on your Codeforces profile, but found "${organization || 'nothing'}". Please double-check and save your Codeforces settings.` 
      });
    }

    // 4. Verification Successful! Write to final User collection
    const rating = cfUser.rating || 0;
    const avatar = cfUser.titlePhoto;
    
    // Assign role based on rating (Moderator if rating >= 1500)
    const role = rating >= 1500 ? 'moderator' : 'user';

    // Verify handle/email doesn't sneakily exist in between steps
    const duplicateUser = await User.findOne({ $or: [{ handle: challenge.handle }, { email: challenge.email }] });
    if (duplicateUser) {
      return res.status(400).json({ error: 'Handle or Email already registered' });
    }

    const user = await User.create({
      handle: challenge.handle,
      email: challenge.email,
      password: challenge.password, // Password is already hashed from Step 1!
      role,
      rating,
      avatar
    });

    // 5. Clean up the challenge
    await VerificationChallenge.deleteOne({ _id: challenge._id });

    // 6. Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Handle verified and user registered successfully!',
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