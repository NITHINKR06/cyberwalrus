import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ScamReport from '../models/ScamReport.js';
import AnalyzerHistory from '../models/AnalyzerHistory.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    // Link anonymous session if exists
    if (req.session.sessionId) {
      user.linkedSessions.push(req.session.sessionId);
    }

    await user.save();

    // Link anonymous activities to user
    if (req.session.sessionId) {
      await linkAnonymousActivities(user._id, req.session.sessionId);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update streak
    user.updateStreak();

    // Link anonymous session if exists
    if (req.session.sessionId && !user.linkedSessions.includes(req.session.sessionId)) {
      user.linkedSessions.push(req.session.sessionId);
      await linkAnonymousActivities(user._id, req.session.sessionId);
    }

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Link anonymous activities to user
async function linkAnonymousActivities(userId, sessionId) {
  try {
    // Update scam reports
    await ScamReport.updateMany(
      { sessionId, userId: null },
      { userId }
    );

    // Update analyzer history
    await AnalyzerHistory.updateMany(
      { sessionId, userId: null },
      { userId }
    );

    console.log(`Linked anonymous activities for session ${sessionId} to user ${userId}`);
  } catch (error) {
    console.error('Error linking anonymous activities:', error);
  }
}

// Verify token middleware
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if username or email is being changed and if they already exist
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
}

export default router;
export { authenticateToken };
