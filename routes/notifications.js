const express = require('express');
const router = express.Router();

// In-memory notifications and user preferences
const notifications = {};
const jobMatches = {};
let notificationCounter = 1;

/**
 * Simple job matching algorithm based on job category
 */
function findMatchingJobs(jobSeeker, allJobs) {
  const seekerCategory = jobSeeker.job_category || 'teaching';
  
  return Object.values(allJobs)
    .filter(job => {
      // Match by category
      if (job.category === seekerCategory) return true;
      
      // Teaching matches with lecturer/educator roles
      if (seekerCategory === 'teaching' && ['education', 'teaching', 'lecturer'].includes(job.category)) return true;
      
      // Tech matches with IT/developer roles
      if (seekerCategory === 'tech' && ['tech', 'it', 'developer', 'engineer'].includes(job.category)) return true;
      
      return false;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5); // Return top 5 matches
}

/**
 * GET /api/notifications/:user_id - Get user notifications
 */
router.get('/:user_id', (req, res) => {
  try {
    const userNotifications = notifications[req.params.user_id] || [];
    const sorted = userNotifications.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({
      success: true,
      notifications: sorted,
      unread: sorted.filter(n => !n.read).length,
      total: sorted.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

/**
 * POST /api/notifications/mark-read - Mark notification as read
 */
router.post('/mark-read', (req, res) => {
  try {
    const { user_id, notification_id } = req.body;

    if (!notifications[user_id]) {
      return res.status(404).json({ success: false, message: 'No notifications' });
    }

    const notification = notifications[user_id].find(n => n.id === notification_id);
    if (notification) {
      notification.read = true;
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification:', error);
    res.status(500).json({ success: false, message: 'Error marking notification' });
  }
});

/**
 * POST /api/notifications/create - Create notification
 */
router.post('/create', (req, res) => {
  try {
    const { user_id, type, title, message, data, source_user_id } = req.body;

    if (!user_id || !type || !title) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    if (!notifications[user_id]) {
      notifications[user_id] = [];
    }

    const notification = {
      id: `notif_${notificationCounter++}`,
      type, // 'job_match', 'new_comment', 'new_like', 'new_application'
      title,
      message: message || '',
      data: data || {},
      source_user_id: source_user_id || null,
      timestamp: new Date().toISOString(),
      read: false,
    };

    notifications[user_id].push(notification);

    res.status(201).json({
      success: true,
      message: 'Notification created',
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Error creating notification' });
  }
});

/**
 * POST /api/notifications/generate-matches - Generate job matches for seeker
 * Body: { seeker_id, seeker_data, all_jobs }
 */
router.post('/generate-matches', (req, res) => {
  try {
    const { seeker_id, seeker_data, all_jobs } = req.body;

    if (!seeker_id || !seeker_data) {
      return res.status(400).json({ success: false, message: 'Seeker ID and data required' });
    }

    // Find matching jobs
    const matchedJobs = findMatchingJobs(seeker_data, all_jobs || {});

    // Store matches
    jobMatches[seeker_id] = {
      seeker_id,
      matches: matchedJobs,
      last_updated: new Date().toISOString(),
      category: seeker_data.job_category || 'teaching',
    };

    // Create notifications for each match
    if (!notifications[seeker_id]) {
      notifications[seeker_id] = [];
    }

    matchedJobs.forEach((job, index) => {
      if (index < 3) { // Notify for top 3 matches
        notifications[seeker_id].push({
          id: `notif_${notificationCounter++}`,
          type: 'job_match',
          title: `New ${seeker_data.job_category} job: ${job.title}`,
          message: `${job.company_name} is hiring for this position`,
          data: {
            job_id: job.id,
            salary: job.salary,
            location: job.location,
            company: job.company_name,
          },
          source_user_id: job.recruiter_id,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    });

    res.json({
      success: true,
      message: `Found ${matchedJobs.length} matching jobs`,
      matches: matchedJobs,
      notificationsCreated: Math.min(3, matchedJobs.length),
    });
  } catch (error) {
    console.error('Error generating matches:', error);
    res.status(500).json({ success: false, message: 'Error generating matches' });
  }
});

/**
 * GET /api/notifications/matches/:seeker_id - Get cached job matches
 */
router.get('/matches/:seeker_id', (req, res) => {
  try {
    const matches = jobMatches[req.params.seeker_id];

    if (!matches) {
      return res.json({
        success: true,
        matches: [],
        message: 'No matches found. Update your profile to get matches.',
      });
    }

    res.json({
      success: true,
      matches: matches.matches,
      category: matches.category,
      last_updated: matches.last_updated,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, message: 'Error fetching matches' });
  }
});

module.exports = router;
