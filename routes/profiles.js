const express = require('express');
const router = express.Router();
const dataPersistence = require('./data-persistence');

// In-memory profile pictures and profiles (kept for backward compatibility)
const userProfiles = {};
const profilePictures = {};

/**
 * GET /api/profiles/:user_id - Get user profile
 */
router.get('/:user_id', (req, res) => {
  try {
    const profile = userProfiles[req.params.user_id];

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

/**
 * GET /api/profiles/all/list - Get all profiles
 */
router.get('/all/list', (req, res) => {
  try {
    const profiles = dataPersistence.getAllProfiles() || Object.values(userProfiles);
    res.json({
      success: true,
      profiles,
      total: profiles.length,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ success: false, message: 'Error fetching profiles' });
  }
});

/**
 * GET /api/profiles/new - Get new users
 */
router.get('/new', (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const newUsers = dataPersistence.getNewUsers(parseInt(limit)) || Object.values(userProfiles).slice(0, limit);
    res.json({
      success: true,
      profiles: newUsers,
      total: newUsers.length,
    });
  } catch (error) {
    console.error('Error fetching new profiles:', error);
    res.status(500).json({ success: false, message: 'Error fetching new profiles' });
  }
});

/**
 * GET /api/profiles/search - Search profiles
 */
router.get('/search', (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query || query.length < 2) {
      return res.json({ success: true, profiles: [], message: 'Query too short' });
    }

    const results = dataPersistence.searchProfiles(query);
    res.json({
      success: true,
      profiles: results,
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ success: false, message: 'Error searching profiles' });
  }
});

/**
 * POST /api/profiles/create - Create or update profile
 * Body: { user_id, user_name, bio, job_category, location, phone }
 */
router.post('/create', (req, res) => {
  try {
    const { user_id, user_name, bio, job_category, location, phone } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    const existingProfile = userProfiles[user_id] || dataPersistence.getProfile(user_id);

    const profile = {
      user_id,
      user_name: user_name || 'User',
      bio: bio || '',
      job_category: job_category || 'teaching',
      location: location || 'Nigeria',
      phone: phone || '',
      profile_picture: profilePictures[user_id] ? `http://localhost:5001/api/profiles/${user_id}/picture/view` : null,
      created_at: existingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      followers: existingProfile?.followers || [],
      following: existingProfile?.following || [],
      total_followers: existingProfile?.total_followers || 0,
      total_following: existingProfile?.total_following || 0,
      total_posts: existingProfile?.total_posts || 0,
      total_jobs_posted: existingProfile?.total_jobs_posted || 0,
    };

    // Save to both in-memory and data persistence
    userProfiles[user_id] = profile;
    dataPersistence.saveProfile(user_id, profile);

    res.json({
      success: true,
      message: 'Profile created/updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ success: false, message: 'Error creating profile' });
  }
});

/**
 * POST /api/profiles/:user_id/update - Update user profile
 */
router.post('/:user_id/update', (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { user_name, bio, job_category, location, phone } = req.body;

    if (!userProfiles[user_id]) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    userProfiles[user_id] = {
      ...userProfiles[user_id],
      user_name: user_name || userProfiles[user_id].user_name,
      bio: bio || userProfiles[user_id].bio,
      job_category: job_category || userProfiles[user_id].job_category,
      location: location || userProfiles[user_id].location,
      phone: phone || userProfiles[user_id].phone,
      updated_at: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: userProfiles[user_id],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

/**
 * POST /api/profiles/:user_id/picture - Upload profile picture
 * Body: { image_data (base64), mimetype }
 */
router.post('/:user_id/picture', (req, res) => {
  try {
    const { image_data, mimetype } = req.body;
    const user_id = req.params.user_id;

    if (!image_data) {
      return res.status(400).json({ success: false, message: 'Image data required' });
    }

    // Validate image data (simple check)
    if (image_data.length > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ success: false, message: 'Image too large. Max 5MB' });
    }

    // Store picture reference in both places
    profilePictures[user_id] = {
      data: image_data,
      mimetype: mimetype || 'image/jpeg',
      uploaded_at: new Date().toISOString(),
    };

    // Also store in data persistence
    dataPersistence.savePicture(user_id, image_data);

    // Update profile picture URL
    if (userProfiles[user_id]) {
      userProfiles[user_id].profile_picture = `http://localhost:5001/api/profiles/${user_id}/picture/view`;
      userProfiles[user_id].updated_at = new Date().toISOString();
      
      // Also update in data persistence
      dataPersistence.saveProfile(user_id, userProfiles[user_id]);
    }

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      picture_url: `http://localhost:5001/api/profiles/${user_id}/picture/view`,
    });
  } catch (error) {
    console.error('Error uploading picture:', error);
    res.status(500).json({ success: false, message: 'Error uploading picture' });
  }
});

/**
 * GET /api/profiles/:user_id/picture/view - View profile picture
 */
router.get('/:user_id/picture/view', (req, res) => {
  try {
    const user_id = req.params.user_id;
    const picture = profilePictures[user_id];

    if (!picture || !picture.data) {
      // Return default avatar placeholder
      return res.status(404).json({
        success: true,
        default: true,
        message: 'No picture uploaded',
      });
    }

    res.set('Content-Type', picture.mimetype || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600');
    
    try {
      res.send(Buffer.from(picture.data, 'base64'));
    } catch (e) {
      // If data is invalid base64, return default
      return res.status(400).json({ success: false, message: 'Invalid image data' });
    }
  } catch (error) {
    console.error('Error fetching picture:', error);
    res.status(500).json({ success: false, message: 'Error fetching picture' });
  }
});

/**
 * POST /api/profiles/:user_id/follow - Follow user
 * Body: { follower_id, follower_name }
 */
router.post('/:user_id/follow', (req, res) => {
  try {
    const { follower_id, follower_name } = req.body;
    const user_id = req.params.user_id;

    if (user_id === follower_id) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    // Initialize profiles if needed
    if (!userProfiles[user_id]) {
      userProfiles[user_id] = { user_id, followers: [], following: [] };
    }
    if (!userProfiles[follower_id]) {
      userProfiles[follower_id] = { follower_id, followers: [], following: [] };
    }

    const profile = userProfiles[user_id];
    const followerProfile = userProfiles[follower_id];

    // Check if already following
    const isFollowing = profile.followers.some(f => f.user_id === follower_id);

    if (isFollowing) {
      // Unfollow
      profile.followers = profile.followers.filter(f => f.user_id !== follower_id);
      followerProfile.following = followerProfile.following.filter(f => f.user_id !== user_id);
      profile.total_followers = Math.max(0, profile.total_followers - 1);
      followerProfile.total_following = Math.max(0, followerProfile.total_following - 1);

      return res.json({
        success: true,
        message: 'Unfollowed',
        following: false,
      });
    } else {
      // Follow
      profile.followers.push({
        user_id: follower_id,
        user_name: follower_name || 'User',
        timestamp: new Date().toISOString(),
      });
      followerProfile.following.push({
        user_id,
        user_name: profile.user_name || 'User',
        timestamp: new Date().toISOString(),
      });
      profile.total_followers = (profile.total_followers || 0) + 1;
      followerProfile.total_following = (followerProfile.total_following || 0) + 1;

      res.json({
        success: true,
        message: 'Followed successfully',
        following: true,
        profile,
      });
    }
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'Error following user' });
  }
});

/**
 * GET /api/profiles/:user_id/followers - Get user followers
 */
router.get('/:user_id/followers', (req, res) => {
  try {
    const profile = userProfiles[req.params.user_id];

    if (!profile) {
      return res.json({
        success: true,
        followers: [],
        total: 0,
      });
    }

    res.json({
      success: true,
      followers: profile.followers || [],
      total: profile.total_followers || 0,
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ success: false, message: 'Error fetching followers' });
  }
});

module.exports = router;
