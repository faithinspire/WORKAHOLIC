const express = require('express');
const router = express.Router();
const dataPersistence = require('./data-persistence');

// In-memory feed storage (kept for backward compatibility)
const feedPosts = {};
let postCounter = 1;

/**
 * GET /api/feed/all - Get all feed posts (user status updates)
 */
router.get('/all', (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    let posts = Object.values(feedPosts).sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    const total = posts.length;
    const paginatedPosts = posts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      posts: paginatedPosts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ success: false, message: 'Error fetching feed' });
  }
});

/**
 * GET /api/feed/user/:user_id - Get user's posts
 */
router.get('/user/:user_id', (req, res) => {
  try {
    const userPosts = Object.values(feedPosts).filter(
      post => post.user_id === req.params.user_id
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      posts: userPosts,
      total: userPosts.length,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Error fetching user posts' });
  }
});

/**
 * POST /api/feed/create - Create new feed post (user status)
 * Body: { user_id, user_name, user_picture, text, image, emoji }
 */
router.post('/create', (req, res) => {
  try {
    const { user_id, user_name, user_picture, text, image, emoji } = req.body;

    if (!user_id || !text) {
      return res.status(400).json({ success: false, message: 'User ID and text required' });
    }

    const postId = `post_${postCounter++}`;
    const newPost = {
      id: postId,
      user_id,
      user_name: user_name || 'User',
      user_picture: user_picture || null,
      text,
      image: image || null,
      emoji: emoji || '😊',
      created_at: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      comments: [],
      reactions: {
        '❤️': 0,
        '😂': 0,
        '😮': 0,
        '😢': 0,
        '👍': 0,
        '🔥': 0,
      },
      shares: 0,
    };

    // Save to both in-memory and data persistence
    feedPosts[postId] = newPost;
    dataPersistence.saveFeedPost(postId, newPost);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating feed post:', error);
    res.status(500).json({ success: false, message: 'Error creating feed post' });
  }
});

/**
 * POST /api/feed/:id/like - Toggle like on post
 */
router.post('/:id/like', (req, res) => {
  try {
    const post = feedPosts[req.params.id];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { user_id, user_name } = req.body;
    const likeIndex = post.liked_by.findIndex(like => like.user_id === user_id);

    if (likeIndex > -1) {
      // Unlike
      post.liked_by.splice(likeIndex, 1);
      post.likes--;
    } else {
      // Like
      post.liked_by.push({ 
        user_id, 
        user_name: user_name || 'User',
        timestamp: new Date().toISOString() 
      });
      post.likes++;
    }

    res.json({
      success: true,
      post,
      liked: likeIndex === -1,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ success: false, message: 'Error liking post' });
  }
});

/**
 * POST /api/feed/:id/reaction - Add emoji reaction to post
 * Body: { user_id, emoji }
 */
router.post('/:id/reaction', (req, res) => {
  try {
    const post = feedPosts[req.params.id];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { user_id, emoji } = req.body;
    if (!emoji) {
      return res.status(400).json({ success: false, message: 'Emoji required' });
    }

    // Initialize reactions if not exists
    if (!post.reactions) {
      post.reactions = {};
    }

    // Initialize emoji count if not exists
    if (!post.reactions[emoji]) {
      post.reactions[emoji] = 0;
    }

    // Toggle reaction
    post.reactions[emoji]++;

    res.json({
      success: true,
      message: 'Reaction added',
      reactions: post.reactions,
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ success: false, message: 'Error adding reaction' });
  }
});

/**
 * POST /api/feed/:id/comment - Add comment to post
 * Body: { user_id, user_name, text, user_picture, emoji }
 */
router.post('/:id/comment', (req, res) => {
  try {
    const post = feedPosts[req.params.id];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { user_id, user_name, text, user_picture, emoji } = req.body;
    if (!text || !user_id) {
      return res.status(400).json({ success: false, message: 'Comment text and user ID required' });
    }

    const comment = {
      id: `comment_${Date.now()}`,
      user_id,
      user_name: user_name || 'User',
      user_picture: user_picture || null,
      text,
      emoji: emoji || '😊',
      timestamp: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      replies: [],
    };

    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push(comment);

    // Also save in data persistence
    dataPersistence.feedPosts[req.params.id] = post;

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
      totalComments: post.comments.length,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

/**
 * GET /api/feed/:id/comments - Get all comments on a post
 */
router.get('/:id/comments', (req, res) => {
  try {
    const post = feedPosts[req.params.id];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({
      success: true,
      comments: post.comments || [],
      total: (post.comments || []).length,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Error fetching comments' });
  }
});

/**
 * POST /api/feed/:postId/comment/:commentId/like - Like a comment
 */
router.post('/:postId/comment/:commentId/like', (req, res) => {
  try {
    const post = feedPosts[req.params.postId];
    if (!post || !post.comments) {
      return res.status(404).json({ success: false, message: 'Post or comments not found' });
    }

    const comment = post.comments.find(c => c.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const { user_id, user_name } = req.body;
    const likeIndex = comment.liked_by.findIndex(l => l.user_id === user_id);

    if (likeIndex > -1) {
      comment.liked_by.splice(likeIndex, 1);
      comment.likes--;
    } else {
      comment.liked_by.push({ user_id, user_name });
      comment.likes++;
    }

    res.json({
      success: true,
      message: 'Like toggled',
      comment,
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ success: false, message: 'Error liking comment' });
  }
});

/**
 * DELETE /api/feed/:id - Delete post (only by owner)
 */
router.delete('/:id', (req, res) => {
  try {
    const post = feedPosts[req.params.id];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { user_id } = req.body;
    if (post.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    delete feedPosts[req.params.id];

    res.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
});

/**
 * DELETE /api/feed/:postId/comment/:commentId - Delete comment
 */
router.delete('/:postId/comment/:commentId', (req, res) => {
  try {
    const post = feedPosts[req.params.postId];
    if (!post || !post.comments) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(c => c.id === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const { user_id } = req.body;
    const comment = post.comments[commentIndex];

    if (comment.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    post.comments.splice(commentIndex, 1);

    res.json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Error deleting comment' });
  }
});

module.exports = router;
