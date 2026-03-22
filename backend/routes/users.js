import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required. Add it to .env');

// Helper: sign JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: 'local'
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/users/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    // Fetch a few meaningful latest users to generate initials
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(4).select('name email');
    
    const initials = recentUsers.map(u => {
      const targetString = u.name || u.email || '?';
      const parts = targetString.split(/[ \.\-_]/).filter(Boolean);
      let init = parts[0]?.charAt(0).toUpperCase() || '?';
      if (parts.length > 1) {
        init += parts[parts.length - 1].charAt(0).toUpperCase();
      } else if (targetString.length > 1) {
        init = targetString.slice(0, 2).toUpperCase();
      }
      return init;
    });

    res.json({ success: true, count: totalUsers, initials });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ error: 'Server error fetching user stats' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Protected Routes
// ─────────────────────────────────────────────────────────────────────────────
import { auth } from '../middleware/auth.js';

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, jobTitle, bio, location, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (req.body.displayName !== undefined) user.displayName = req.body.displayName;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;

    // Preferences
    if (req.body.defaultTone !== undefined) user.defaultTone = req.body.defaultTone;
    if (req.body.defaultSignature !== undefined) user.defaultSignature = req.body.defaultSignature;
    if (req.body.autoSaveDrafts !== undefined) user.autoSaveDrafts = req.body.autoSaveDrafts;

    await user.save();

    res.json({
      success: true, user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        jobTitle: user.jobTitle,
        bio: user.bio,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

export default router;