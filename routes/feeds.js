const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// In-memory storage for feeds
let feeds = [];
let feedIdCounter = 1;

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // In a real app, verify JWT here
  next();
};

// GET all feeds
router.get('/', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      feeds: feeds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single feed
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const feed = feeds.find(f => f.id === parseInt(req.params.id));
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }
    res.json({ success: true, feed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create feed
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, author, authorId } = req.body;

    if (!content || !author) {
      return res.status(400).json({ message: 'Content and author required' });
    }

    const newFeed = {
      id: feedIdCounter++,
      content,
      author,
      authorId: authorId || 0,
      created_at: new Date(),
      likes: 0,
      comments: [],
      liked_by: []
    };

    feeds.push(newFeed);

    res.status(201).json({
      success: true,
      message: 'Feed created successfully',
      feed: newFeed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST like feed
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const feed = feeds.find(f => f.id === parseInt(req.params.id));
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    const { userId } = req.body;
    if (!feed.liked_by.includes(userId)) {
      feed.likes++;
      feed.liked_by.push(userId);
    }

    res.json({ success: true, feed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST unlike feed
router.post('/:id/unlike', verifyToken, async (req, res) => {
  try {
    const feed = feeds.find(f => f.id === parseInt(req.params.id));
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    const { userId } = req.body;
    const idx = feed.liked_by.indexOf(userId);
    if (idx > -1) {
      feed.likes--;
      feed.liked_by.splice(idx, 1);
    }

    res.json({ success: true, feed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST comment on feed
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const feed = feeds.find(f => f.id === parseInt(req.params.id));
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    const { comment, author, authorId } = req.body;
    if (!comment || !author) {
      return res.status(400).json({ message: 'Comment and author required' });
    }

    const newComment = {
      id: Math.random(),
      comment,
      author,
      authorId: authorId || 0,
      created_at: new Date()
    };

    feed.comments.push(newComment);

    res.json({
      success: true,
      message: 'Comment added successfully',
      feed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE feed
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const idx = feeds.findIndex(f => f.id === parseInt(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    feeds.splice(idx, 1);

    res.json({ success: true, message: 'Feed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
