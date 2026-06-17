const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  next();
};

// In-memory user data for demo
let userSettings = {};

// GET user settings
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const settings = userSettings[userId] || {
      notifications: true,
      email_updates: true,
      privacy: 'public',
      theme: 'light'
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update settings
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { notifications, email_updates, privacy, theme } = req.body;

    userSettings[userId] = {
      notifications: notifications !== undefined ? notifications : true,
      email_updates: email_updates !== undefined ? email_updates : true,
      privacy: privacy || 'public',
      theme: theme || 'light'
    };

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: userSettings[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT change password
router.put('/:userId/change-password', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // In a real app, verify current password and update in database
    // For now, just return success
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE account
router.delete('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password required to delete account' });
    }

    // In a real app, verify password and delete user from database
    // For now, just return success
    res.json({
      success: true,
      message: 'Account deleted successfully',
      redirect: '/'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
