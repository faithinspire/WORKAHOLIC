const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// In-memory storage for messages
let messages = [];
let messageIdCounter = 1;

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  next();
};

// GET inbox (messages for current user)
router.get('/inbox', verifyToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const userMessages = messages.filter(m => m.recipientId === parseInt(userId));
    
    res.json({
      success: true,
      count: userMessages.length,
      messages: userMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET sent messages
router.get('/sent', verifyToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const userMessages = messages.filter(m => m.senderId === parseInt(userId));
    
    res.json({
      success: true,
      count: userMessages.length,
      messages: userMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET conversation between two users
router.get('/conversation/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.query.currentUserId;
    
    const conversation = messages.filter(m => 
      (m.senderId === parseInt(currentUserId) && m.recipientId === parseInt(userId)) ||
      (m.senderId === parseInt(userId) && m.recipientId === parseInt(currentUserId))
    );
    
    res.json({
      success: true,
      conversation: conversation.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST send message
router.post('/', verifyToken, async (req, res) => {
  try {
    const { senderId, senderName, recipientId, content } = req.body;

    if (!senderId || !recipientId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newMessage = {
      id: messageIdCounter++,
      senderId: parseInt(senderId),
      senderName,
      recipientId: parseInt(recipientId),
      content,
      read: false,
      created_at: new Date()
    };

    messages.push(newMessage);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mark message as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const message = messages.find(m => m.id === parseInt(req.params.id));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.read = true;

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE message
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const idx = messages.findIndex(m => m.id === parseInt(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    messages.splice(idx, 1);

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
