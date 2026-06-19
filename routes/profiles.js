const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// In-memory storage for development
const inMemoryProfiles = {};
const inMemoryJobseekers = {};

// Middleware to verify token (basic check)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  req.userId = req.headers.userid || req.body.user_id; // Accept from header or body
  next();
};

// GET profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Try in-memory first
    if (inMemoryProfiles[userId]) {
      return res.json(inMemoryProfiles[userId]);
    }

    // Try jobseekers table
    if (inMemoryJobseekers[userId]) {
      const profile = inMemoryJobseekers[userId];
      // Convert to response format
      const response = {
        id: profile.user_id,
        user_name: profile.fullname || profile.user_name,
        email: profile.email,
        phone: profile.phone,
        state: profile.state,
        lga: profile.lga,
        bio: profile.bio,
        skills: profile.skills,
        experience: profile.experience,
        qualification: profile.qualification,
        job_category: profile.job_category || 'Teaching',
        years_experience: profile.years_experience || 0,
        education_level: profile.education_level,
        professional_title: profile.professional_title,
        employment_type: profile.employment_type,
        profile_image_url: profile.profile_image_url,
        star_rating: profile.star_rating || 1,
        total_followers: profile.total_followers || 0,
        created_at: profile.created_at,
      };
      return res.json(response);
    }

    res.status(404).json({ message: 'Profile not found' });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE initial profile from signup
router.post('/create', async (req, res) => {
  try {
    const {
      user_id,
      user_name,
      fullname,
      email,
      phone,
      state,
      lga,
      job_category,
      bio,
      education_level,
      years_experience,
      professional_title,
      employment_type,
      profile_image_url,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const profile = {
      user_id,
      fullname: fullname || user_name,
      email,
      phone,
      state,
      lga,
      bio,
      skills: '',
      experience: '',
      qualification: '',
      job_category: job_category || 'Teaching',
      years_experience: years_experience || 0,
      education_level: education_level || '',
      professional_title: professional_title || '',
      employment_type: employment_type || '',
      profile_image_url: profile_image_url || null,
      star_rating: 1,
      total_followers: 0,
      created_at: new Date().toISOString(),
    };

    inMemoryJobseekers[user_id] = profile;
    inMemoryProfiles[user_id] = profile;

    // Try to save to localStorage
    try {
      localStorage.setItem(`profile_${user_id}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    res.status(201).json({
      message: 'Profile created successfully',
      profile,
    });
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE profile
router.post('/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, skills, experience, qualification } = req.body;

    // Get existing profile
    let profile = inMemoryJobseekers[userId] || inMemoryProfiles[userId];
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update fields
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (qualification !== undefined) profile.qualification = qualification;

    profile.updated_at = new Date().toISOString();

    // Update in-memory storage
    inMemoryJobseekers[userId] = profile;
    inMemoryProfiles[userId] = profile;

    // Try to save to localStorage
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE profile image
router.post('/:userId/update-image', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile_image_url } = req.body;

    if (!profile_image_url) {
      return res.status(400).json({ message: 'profile_image_url is required' });
    }

    let profile = inMemoryJobseekers[userId] || inMemoryProfiles[userId];
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.profile_image_url = profile_image_url;
    profile.updated_at = new Date().toISOString();

    inMemoryJobseekers[userId] = profile;
    inMemoryProfiles[userId] = profile;

    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    res.json({
      message: 'Profile image updated successfully',
      profile,
    });
  } catch (err) {
    console.error('Update image error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all job seekers (for feed/discovery)
router.get('/', async (req, res) => {
  try {
    const profiles = Object.values(inMemoryJobseekers).map(p => ({
      id: p.user_id,
      user_name: p.fullname || p.user_name,
      email: p.email,
      job_category: p.job_category,
      profile_image_url: p.profile_image_url,
      bio: p.bio,
      star_rating: p.star_rating || 1,
      created_at: p.created_at,
    }));

    res.json(profiles);
  } catch (err) {
    console.error('Get all profiles error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
