const express = require('express');
const router = express.Router();

// In-memory job storage
const jobs = {};
let jobCounter = 1;

// In-memory job applications
const applications = {};

/**
 * GET /api/jobs - Get all jobs
 * Query params: category, limit, offset
 */
router.get('/all', (req, res) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query;
    
    let jobList = Object.values(jobs).sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    if (category && category !== 'all') {
      jobList = jobList.filter(job => job.category === category);
    }

    const total = jobList.length;
    const paginatedJobs = jobList.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      jobs: paginatedJobs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
});

/**
 * GET /api/jobs/:id - Get single job with comments
 */
router.get('/:id', (req, res) => {
  try {
    const job = jobs[req.params.id];
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ success: false, message: 'Error fetching job' });
  }
});

/**
 * POST /api/jobs - Create new job posting
 * Body: { title, description, category, salary, location, recruiter_id, recruiter_name, company_name }
 */
router.post('/create', (req, res) => {
  try {
    const { title, description, category, salary, location, recruiter_id, recruiter_name, company_name } = req.body;

    if (!title || !description || !recruiter_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const jobId = `job_${jobCounter++}`;
    const newJob = {
      id: jobId,
      title,
      description,
      category: category || 'teaching',
      salary: salary || 'Negotiable',
      location: location || 'Nigeria',
      recruiter_id,
      recruiter_name: recruiter_name || 'Recruiter',
      company_name: company_name || 'Company',
      created_at: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      comments: [],
      applications: [],
      status: 'open',
    };

    jobs[jobId] = newJob;

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Error creating job' });
  }
});

/**
 * POST /api/jobs/:id/like - Toggle like on job
 * Body: { user_id, user_name }
 */
router.post('/:id/like', (req, res) => {
  try {
    const job = jobs[req.params.id];
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { user_id, user_name } = req.body;
    const likeIndex = job.liked_by.findIndex(like => like.user_id === user_id);

    if (likeIndex > -1) {
      // Unlike
      job.liked_by.splice(likeIndex, 1);
      job.likes--;
    } else {
      // Like
      job.liked_by.push({ user_id, user_name, timestamp: new Date().toISOString() });
      job.likes++;
    }

    res.json({
      success: true,
      job,
      liked: likeIndex === -1,
    });
  } catch (error) {
    console.error('Error liking job:', error);
    res.status(500).json({ success: false, message: 'Error liking job' });
  }
});

/**
 * POST /api/jobs/:id/comment - Add comment to job
 * Body: { user_id, user_name, text }
 */
router.post('/:id/comment', (req, res) => {
  try {
    const job = jobs[req.params.id];
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { user_id, user_name, text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text required' });
    }

    const comment = {
      id: `comment_${Date.now()}`,
      user_id,
      user_name: user_name || 'Anonymous',
      text,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked_by: [],
    };

    job.comments.push(comment);

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment,
      totalComments: job.comments.length,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

/**
 * POST /api/jobs/:id/apply - Apply for job
 * Body: { seeker_id, seeker_name, cover_letter }
 */
router.post('/:id/apply', (req, res) => {
  try {
    const job = jobs[req.params.id];
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { seeker_id, seeker_name, cover_letter } = req.body;

    // Check if already applied
    const alreadyApplied = job.applications.some(app => app.seeker_id === seeker_id);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied for this job' });
    }

    const application = {
      id: `app_${Date.now()}`,
      seeker_id,
      seeker_name: seeker_name || 'Job Seeker',
      cover_letter: cover_letter || '',
      status: 'pending',
      applied_at: new Date().toISOString(),
    };

    job.applications.push(application);

    res.status(201).json({
      success: true,
      message: 'Application submitted',
      application,
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Error applying for job' });
  }
});

module.exports = router;
