const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getUsers, saveState } = require('../services/storeService');

const DEMO_USER_ID = 'demo_user_sheback_2026';
const DEMO_EMAIL = 'demo@sheback.com';
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

// Initialize persistent user list
const initStoreUsers = () => {
  const users = getUsers();
  const exists = users.find((u) => u.email === DEMO_EMAIL);
  if (!exists) {
    users.push({
      _id: DEMO_USER_ID,
      id: DEMO_USER_ID,
      name: 'Priya Sharma',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD_HASH,
      onboarded: true,
      createdAt: new Date().toISOString(),
    });
    saveState();
  }
};
initStoreUsers();

const setMemoryUserOnboarded = (userId, onboarded = true) => {
  const users = getUsers();
  const u = users.find((user) => String(user._id || user.id) === String(userId));
  if (u) {
    u.onboarded = onboarded;
    saveState();
  }
};

const generateToken = (userId, email, name) => {
  return jwt.sign(
    { id: userId, email, name },
    process.env.JWT_SECRET || 'sheback_super_secret_jwt_key_2026_career_gap_recovery',
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try Primary MongoDB first
    if (mongoose.connection.readyState === 1) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          onboarded: false,
        });

        // Also back up to local persistent store
        const users = getUsers();
        users.push({
          _id: String(user._id),
          id: String(user._id),
          name: user.name,
          email: user.email,
          password: user.password,
          onboarded: user.onboarded,
          createdAt: user.createdAt,
        });
        saveState();

        const token = generateToken(user._id, user.email, user.name);

        return res.status(201).json({
          success: true,
          message: 'Registration successful (MongoDB)',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            onboarded: user.onboarded,
          },
        });
      } catch (dbErr) {
        console.warn('[Register] MongoDB operation failed, falling back to persistent store:', dbErr.message);
      }
    }

    // 2. Persistent Local Store Fallback
    const users = getUsers();
    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = new mongoose.Types.ObjectId().toString();

    const newUser = {
      _id: newUserId,
      id: newUserId,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      onboarded: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveState();

    const token = generateToken(newUserId, newUser.email, newUser.name);

    return res.status(201).json({
      success: true,
      message: 'Registration successful (Persistent Storage)',
      token,
      user: {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        onboarded: newUser.onboarded,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;
    let isMatch = false;

    // 1. Try Primary MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
        if (user) {
          isMatch = await bcrypt.compare(password, user.password);
        }
      } catch (dbErr) {
        console.warn('[Login] MongoDB lookup error:', dbErr.message);
      }
    }

    // 2. Fallback to Persistent Local Store
    if (!user || !isMatch) {
      const users = getUsers();
      const storeUser = users.find((u) => u.email === normalizedEmail);
      if (storeUser) {
        const matchesStore = await bcrypt.compare(password, storeUser.password);
        if (matchesStore) {
          user = storeUser;
          isMatch = true;
        }
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId, user.email, user.name);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        onboarded: user.onboarded || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

module.exports = {
  register,
  login,
  DEMO_USER_ID,
  setMemoryUserOnboarded,
};
