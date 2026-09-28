const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory fallback if MongoDB is disconnected
const memoryUsers = new Map();

const DEMO_USER_ID = 'demo_user_sheback_2026';
const DEMO_EMAIL = 'demo@sheback.com';
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

// Pre-seed demo account
memoryUsers.set(DEMO_EMAIL, {
  _id: DEMO_USER_ID,
  name: 'Priya Sharma',
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD_HASH,
  onboarded: true,
});

const setMemoryUserOnboarded = (userId, onboarded = true) => {
  for (const [email, u] of memoryUsers.entries()) {
    if (String(u._id) === String(userId)) {
      u.onboarded = onboarded;
      memoryUsers.set(email, u);
      break;
    }
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

    // Try MongoDB
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        onboarded: false,
      });

      const token = generateToken(user._id, user.email, user.name);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboarded: user.onboarded,
        },
      });
    } catch (dbErr) {
      // In-memory fallback
      if (memoryUsers.has(email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = 'mem_' + Date.now();

      const memoryUser = {
        _id: userId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        onboarded: false,
      };

      memoryUsers.set(email.toLowerCase(), memoryUser);
      const token = generateToken(userId, memoryUser.email, memoryUser.name);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (In-Memory)',
        token,
        user: {
          id: userId,
          name: memoryUser.name,
          email: memoryUser.email,
          onboarded: memoryUser.onboarded,
        },
      });
    }
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

    let user = null;
    let isMatch = false;

    try {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    } catch (dbErr) {
      const memUser = memoryUsers.get(email.toLowerCase());
      if (memUser) {
        user = memUser;
        isMatch = await bcrypt.compare(password, memUser.password);
      }
    }

    if (!user && memoryUsers.has(email.toLowerCase())) {
      user = memoryUsers.get(email.toLowerCase());
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id || user.id, user.email, user.name);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
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

module.exports = { register, login, memoryUsers, DEMO_USER_ID, setMemoryUserOnboarded };
