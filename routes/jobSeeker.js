const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get job seeker profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT * FROM jobseekers WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    const jobSeeker = result.rows[0];

    // Get documents
    const docsResult = await pool.query(
      'SELECT * FROM documents WHERE jobseeker_id = $1',
      [result.rows[0].id]
    );

    // Get work experience
    const expResult = await pool.query(
      'SELECT * FROM work_experience WHERE jobseeker_id = $1 ORDER BY start_date DESC',
      [result.rows[0].id]
    );

    res.json({
      ...jobSeeker,
      documents: docsResult.rows,
      workExperience: expResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job seeker profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, phone, state, lga, yearsExperience } = req.body;

    await pool.query(
      `UPDATE jobseekers 
       SET fullname = COALESCE($2, fullname), 
           phone = COALESCE($3, phone),
           state = COALESCE($4, state),
           lga = COALESCE($5, lga),
           years_experience = COALESCE($6, years_experience),
           updated_at = NOW()
       WHERE user_id = $1`,
      [userId, fullname, phone, state, lga, yearsExperience]
    );

    // Recalculate star rating
    await updateStarRating(userId);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add work experience
router.post('/work-experience/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { institution, role, startDate, endDate } = req.body;

    const jobSeekerResult = await pool.query(
      'SELECT id FROM jobseekers WHERE user_id = $1',
      [userId]
    );

    if (jobSeekerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    await pool.query(
      `INSERT INTO work_experience (jobseeker_id, institution, role, start_date, end_date, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [jobSeekerResult.rows[0].id, institution, role, startDate, endDate]
    );

    // Recalculate star rating
    await updateStarRating(userId);

    res.json({ message: 'Work experience added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload document
router.post('/upload-document/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { documentType, fileUrl } = req.body;

    const jobSeekerResult = await pool.query(
      'SELECT id FROM jobseekers WHERE user_id = $1',
      [userId]
    );

    if (jobSeekerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    await pool.query(
      `INSERT INTO documents (jobseeker_id, type, file_url, verified, created_at)
       VALUES ($1, $2, $3, false, NOW())`,
      [jobSeekerResult.rows[0].id, documentType, fileUrl]
    );

    // Recalculate star rating
    await updateStarRating(userId);

    res.json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Recalculate star rating
async function updateStarRating(userId) {
  try {
    const jobSeekerResult = await pool.query(
      'SELECT id FROM jobseekers WHERE user_id = $1',
      [userId]
    );

    if (jobSeekerResult.rows.length === 0) return;

    const jobSeekerId = jobSeekerResult.rows[0].id;
    let starRating = 1; // Base: 1 star on registration

    // +1 star when all credentials uploaded
    const credentialsResult = await pool.query(
      `SELECT COUNT(*) FROM documents WHERE jobseeker_id = $1 AND type IN ('credential', 'cv')`,
      [jobSeekerId]
    );
    if (parseInt(credentialsResult.rows[0].count) > 0) starRating++;

    // +1 star when ID uploaded
    const idResult = await pool.query(
      `SELECT COUNT(*) FROM documents WHERE jobseeker_id = $1 AND type = 'id'`,
      [jobSeekerId]
    );
    if (parseInt(idResult.rows[0].count) > 0) starRating++;

    // +1 star when "Letter from previous institution" uploaded
    const letterResult = await pool.query(
      `SELECT COUNT(*) FROM documents WHERE jobseeker_id = $1 AND type = 'letter'`,
      [jobSeekerId]
    );
    if (parseInt(letterResult.rows[0].count) > 0) starRating++;

    // +1 star when experience >= 2 years
    const jobSeeker = await pool.query(
      'SELECT years_experience FROM jobseekers WHERE id = $1',
      [jobSeekerId]
    );
    if (jobSeeker.rows[0].years_experience >= 2) starRating++;

    // +1 star when previous work history filled
    const workExpResult = await pool.query(
      `SELECT COUNT(*) FROM work_experience WHERE jobseeker_id = $1`,
      [jobSeekerId]
    );
    if (parseInt(workExpResult.rows[0].count) > 0) starRating++;

    // Cap at 5 stars
    starRating = Math.min(starRating, 5);

    // Update star rating
    await pool.query(
      'UPDATE jobseekers SET star_rating = $1 WHERE id = $2',
      [starRating, jobSeekerId]
    );
  } catch (error) {
    console.error('Error updating star rating:', error);
  }
}

module.exports = router;
