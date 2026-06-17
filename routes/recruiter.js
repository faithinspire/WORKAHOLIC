const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get recruiter profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT * FROM recruiters WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upgrade to Premium
router.post('/upgrade-premium/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const recruiterResult = await pool.query(
      'SELECT id FROM recruiters WHERE user_id = $1',
      [userId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Set subscription expiry (30 days from now)
    const subscriptionExpiry = new Date();
    subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);

    await pool.query(
      `UPDATE recruiters 
       SET subscription_type = 'premium', scans_remaining = -1, subscription_expiry = $2
       WHERE user_id = $1`,
      [userId, subscriptionExpiry]
    );

    res.json({ message: 'Upgraded to Premium successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search job seekers with pagination
router.post('/search-jobseekers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { state, lga, educationLevel, subject, minStarRating } = req.body;

    // Get recruiter info
    const recruiterResult = await pool.query(
      'SELECT * FROM recruiters WHERE user_id = $1',
      [userId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const recruiter = recruiterResult.rows[0];

    // Check if subscription is expired
    if (new Date(recruiter.subscription_expiry) < new Date()) {
      return res.status(403).json({ message: 'Subscription expired. Please renew.' });
    }

    // Check scans remaining (if not premium)
    if (recruiter.subscription_type !== 'premium' && recruiter.scans_remaining <= 0) {
      return res.status(403).json({ message: 'No scans remaining for this month' });
    }

    // Build query dynamically
    let query = 'SELECT * FROM jobseekers WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (state) {
      query += ` AND state = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (lga) {
      query += ` AND lga = $${paramIndex}`;
      params.push(lga);
      paramIndex++;
    }

    if (educationLevel) {
      query += ` AND education_level = $${paramIndex}`;
      params.push(educationLevel);
      paramIndex++;
    }

    if (subject) {
      query += ` AND subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (minStarRating) {
      query += ` AND star_rating >= $${paramIndex}`;
      params.push(minStarRating);
      paramIndex++;
    }

    query += ' LIMIT 5';

    const jobSeekersResult = await pool.query(query, params);

    // Record the scan
    for (const jobSeeker of jobSeekersResult.rows) {
      await pool.query(
        `INSERT INTO scans (recruiter_id, jobseeker_id, scanned_at)
         VALUES ($1, $2, NOW())`,
        [recruiter.id, jobSeeker.id]
      );
    }

    // Deduct scan (if not premium)
    if (recruiter.subscription_type !== 'premium') {
      await pool.query(
        'UPDATE recruiters SET scans_remaining = scans_remaining - 1 WHERE user_id = $1',
        [userId]
      );
    }

    res.json({
      jobSeekers: jobSeekersResult.rows,
      scansRemaining: recruiter.subscription_type === 'premium' ? 'Unlimited' : recruiter.scans_remaining - 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
