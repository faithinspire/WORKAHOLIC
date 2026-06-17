const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// In-memory admin data
const adminCredentials = {
  email: 'admin@workaholic.com',
  password: 'Admin123456',
  role: 'admin'
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check credentials
    if (email !== adminCredentials.email || password !== adminCredentials.password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate token
    const token = jwt.sign({ 
      email, 
      role: 'admin' 
    }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        email,
        role: 'admin',
        fullname: 'Administrator'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    let users = [];
    
    try {
      // Try database first
      const result = await pool.query(`
        SELECT u.id, u.email, u.role, u.created_at,
               CASE 
                 WHEN u.role = 'jobseeker' THEN js.fullname
                 WHEN u.role = 'recruiter' THEN r.fullname
                 ELSE 'N/A'
               END as fullname
        FROM users u
        LEFT JOIN jobseekers js ON u.id = js.user_id
        LEFT JOIN recruiters r ON u.id = r.user_id
        ORDER BY u.created_at DESC
      `);
      users = result.rows;
    } catch (e) {
      console.log('Database error, returning empty');
    }

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    let jobs = [];
    
    try {
      const result = await pool.query(`
        SELECT j.*, r.company_name, r.fullname as recruiter_name,
               (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applications_count
        FROM jobs j
        LEFT JOIN recruiters r ON j.recruiter_id = r.id
        ORDER BY j.created_at DESC
      `);
      jobs = result.rows;
    } catch (e) {
      console.log('Database error');
    }

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    let applications = [];
    
    try {
      const result = await pool.query(`
        SELECT a.*, j.title, js.fullname, js.email,
               r.company_name
        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN jobseekers js ON a.jobseeker_id = js.id
        LEFT JOIN recruiters r ON j.recruiter_id = r.id
        ORDER BY a.applied_at DESC
      `);
      applications = result.rows;
    } catch (e) {
      console.log('Database error');
    }

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    let stats = {
      totalUsers: 0,
      totalTeachers: 0,
      totalRecruiters: 0,
      totalJobs: 0,
      totalApplications: 0,
      totalFeeds: 0
    };

    try {
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      const teachersResult = await pool.query('SELECT COUNT(*) as count FROM jobseekers');
      const recruitersResult = await pool.query('SELECT COUNT(*) as count FROM recruiters');
      const jobsResult = await pool.query('SELECT COUNT(*) as count FROM jobs');
      const appResult = await pool.query('SELECT COUNT(*) as count FROM applications');
      const feedsResult = await pool.query('SELECT COUNT(*) as count FROM community_feeds');

      stats = {
        totalUsers: usersResult.rows[0]?.count || 0,
        totalTeachers: teachersResult.rows[0]?.count || 0,
        totalRecruiters: recruitersResult.rows[0]?.count || 0,
        totalJobs: jobsResult.rows[0]?.count || 0,
        totalApplications: appResult.rows[0]?.count || 0,
        totalFeeds: feedsResult.rows[0]?.count || 0
      };
    } catch (e) {
      console.log('Database stats error, using defaults');
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.post('/users/:userId/delete', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    try {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    } catch (e) {
      console.log('Database error');
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
