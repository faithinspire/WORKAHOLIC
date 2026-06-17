const express = require('express');
const router = express.Router();

// In-memory storage
const dashboards = {};
const portfolios = {};
const jobRequests = {};

/**
 * GET /api/dashboard/:userId
 * Get appropriate dashboard based on user role
 */
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userRole = req.headers['x-user-role'] || 'jobseeker';
        
        let dashboardData = {
            userId,
            role: userRole,
            timestamp: new Date(),
        };

        if (userRole === 'recruiter') {
            // Recruiter Dashboard
            dashboardData = {
                ...dashboardData,
                type: 'RECRUITER_DASHBOARD',
                sections: [
                    { id: 'posted_jobs', title: 'Posted Jobs', icon: 'briefcase' },
                    { id: 'applications', title: 'Job Applications', icon: 'file-alt' },
                    { id: 'job_requests', title: 'Interest Requests', icon: 'bell', new: true },
                    { id: 'messages', title: 'Messages', icon: 'envelope' },
                    { id: 'analytics', title: 'Analytics', icon: 'chart-bar' },
                    { id: 'company_profile', title: 'Company Profile', icon: 'building' },
                ],
                widgets: [
                    { type: 'stats', title: 'Posted Jobs', value: 0 },
                    { type: 'stats', title: 'Total Applications', value: 0 },
                    { type: 'stats', title: 'Interested Candidates', value: 0 },
                    { type: 'recent_requests', title: 'Recent Interest Requests', limit: 5 },
                ]
            };
        } else {
            // Job Seeker Dashboard
            dashboardData = {
                ...dashboardData,
                type: 'JOBSEEKER_DASHBOARD',
                sections: [
                    { id: 'job_matches', title: 'Job Matches', icon: 'star', new: true },
                    { id: 'applications', title: 'My Applications', icon: 'paper-plane' },
                    { id: 'saved_jobs', title: 'Saved Jobs', icon: 'bookmark' },
                    { id: 'profile', title: 'My Profile', icon: 'user-circle' },
                    { id: 'portfolio', title: 'Portfolio', icon: 'briefcase' },
                    { id: 'messages', title: 'Messages', icon: 'envelope' },
                    { id: 'notifications', title: 'Notifications', icon: 'bell' },
                ],
                widgets: [
                    { type: 'job_matches', title: 'Recommended Jobs', limit: 5 },
                    { type: 'stats', title: 'Applications Sent', value: 0 },
                    { type: 'stats', title: 'Profile Views', value: 0 },
                    { type: 'recent_notifications', title: 'Recent Updates', limit: 5 },
                ]
            };
        }

        res.json({
            success: true,
            dashboard: dashboardData,
            message: `${userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'} dashboard loaded successfully`
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Error loading dashboard', error: error.message });
    }
});

/**
 * GET /api/portfolio/:userId
 * Get user's portfolio (resume, certificates, etc.)
 */
router.get('/portfolio/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        let portfolio = portfolios[userId] || {
            userId,
            resume: null,
            certificates: [],
            experience: [],
            education: [],
            skills: [],
            about: '',
            profileImage: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        res.json({
            success: true,
            portfolio,
            message: 'Portfolio retrieved successfully'
        });
    } catch (error) {
        console.error('Portfolio error:', error);
        res.status(500).json({ success: false, message: 'Error loading portfolio', error: error.message });
    }
});

/**
 * POST /api/portfolio/:userId
 * Update user's portfolio
 */
router.post('/portfolio/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { resume, certificates, experience, education, skills, about, profileImage } = req.body;

        portfolios[userId] = {
            userId,
            resume: resume || null,
            certificates: certificates || [],
            experience: experience || [],
            education: education || [],
            skills: skills || [],
            about: about || '',
            profileImage: profileImage || null,
            createdAt: portfolios[userId]?.createdAt || new Date(),
            updatedAt: new Date(),
        };

        res.json({
            success: true,
            portfolio: portfolios[userId],
            message: 'Portfolio updated successfully'
        });
    } catch (error) {
        console.error('Portfolio update error:', error);
        res.status(500).json({ success: false, message: 'Error updating portfolio', error: error.message });
    }
});

/**
 * GET /api/portfolio/public/:userId
 * Get another user's public portfolio view
 */
router.get('/public/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        let portfolio = portfolios[userId];
        
        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found'
            });
        }

        // Return only public fields
        const publicPortfolio = {
            userId: portfolio.userId,
            about: portfolio.about,
            skills: portfolio.skills,
            experience: portfolio.experience,
            education: portfolio.education,
            certificates: portfolio.certificates,
            profileImage: portfolio.profileImage,
            updatedAt: portfolio.updatedAt,
        };

        res.json({
            success: true,
            portfolio: publicPortfolio,
            message: 'Public portfolio retrieved successfully'
        });
    } catch (error) {
        console.error('Public portfolio error:', error);
        res.status(500).json({ success: false, message: 'Error loading portfolio', error: error.message });
    }
});

/**
 * POST /api/job-requests/send
 * Job seeker sends interest to recruiter
 */
router.post('/job-requests/send', (req, res) => {
    try {
        const { jobId, jobSeekerId, recruiterId, message } = req.body;

        if (!jobId || !jobSeekerId || !recruiterId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: jobId, jobSeekerId, recruiterId'
            });
        }

        const requestId = `req_${Date.now()}`;
        const jobRequest = {
            id: requestId,
            jobId,
            jobSeekerId,
            recruiterId,
            message: message || '',
            status: 'pending',
            createdAt: new Date(),
            respondedAt: null,
        };

        // Store request
        if (!jobRequests[recruiterId]) {
            jobRequests[recruiterId] = [];
        }
        jobRequests[recruiterId].push(jobRequest);

        res.status(201).json({
            success: true,
            request: jobRequest,
            message: 'Your interest has been sent to the recruiter'
        });
    } catch (error) {
        console.error('Job request error:', error);
        res.status(500).json({ success: false, message: 'Error sending request', error: error.message });
    }
});

/**
 * GET /api/job-requests/recruiter/:recruiterId
 * Get all job interest requests for a recruiter
 */
router.get('/job-requests/recruiter/:recruiterId', (req, res) => {
    try {
        const { recruiterId } = req.params;
        
        const requests = jobRequests[recruiterId] || [];
        
        // Separate pending and responded
        const pending = requests.filter(r => r.status === 'pending');
        const responded = requests.filter(r => r.status !== 'pending');

        res.json({
            success: true,
            requests: {
                pending,
                responded,
                total: requests.length,
            },
            message: 'Job requests retrieved successfully'
        });
    } catch (error) {
        console.error('Get job requests error:', error);
        res.status(500).json({ success: false, message: 'Error loading requests', error: error.message });
    }
});

/**
 * POST /api/job-requests/:requestId/respond
 * Recruiter responds to job interest
 */
router.post('/job-requests/:requestId/respond', (req, res) => {
    try {
        const { requestId } = req.params;
        const { recruiterId, status, message } = req.body;

        if (!recruiterId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: recruiterId, status'
            });
        }

        const recruiterRequests = jobRequests[recruiterId];
        if (!recruiterRequests) {
            return res.status(404).json({
                success: false,
                message: 'No requests found for this recruiter'
            });
        }

        const requestIndex = recruiterRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        recruiterRequests[requestIndex] = {
            ...recruiterRequests[requestIndex],
            status, // 'accepted', 'rejected', 'interview'
            message: message || '',
            respondedAt: new Date(),
        };

        res.json({
            success: true,
            request: recruiterRequests[requestIndex],
            message: `Request ${status} successfully`
        });
    } catch (error) {
        console.error('Respond to request error:', error);
        res.status(500).json({ success: false, message: 'Error responding to request', error: error.message });
    }
});

/**
 * GET /api/notifications/:userId
 * Get welcome and guide notifications for new users
 */
router.get('/notifications/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userRole = req.headers['x-user-role'] || 'jobseeker';

        const notifications = [
            {
                id: 'welcome',
                type: 'welcome',
                title: `Welcome to FAITHJOBS, ${userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}!`,
                message: `We're excited to have you on board. Start exploring ${userRole === 'recruiter' ? 'candidate profiles' : 'amazing job opportunities'} today!`,
                icon: 'heart',
                action: 'dismiss',
                createdAt: new Date(),
            },
            {
                id: 'avatar_guide',
                type: 'guide',
                title: '📸 Upload Your Avatar',
                message: 'Complete your profile by adding a professional avatar. This helps recruiters recognize you and increases your chances of getting hired!',
                icon: 'image',
                action: 'upload_avatar',
                actionText: 'Upload Now',
                createdAt: new Date(Date.now() - 1000),
            },
            {
                id: 'portfolio_guide',
                type: 'guide',
                title: '📄 Complete Your Portfolio',
                message: 'Add your resume, certificates, and experience to your portfolio. Recruiters love detailed profiles!',
                icon: 'briefcase',
                action: 'view_portfolio',
                actionText: 'Go to Portfolio',
                createdAt: new Date(Date.now() - 2000),
            },
        ];

        res.json({
            success: true,
            notifications,
            message: 'Notifications retrieved successfully'
        });
    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ success: false, message: 'Error loading notifications', error: error.message });
    }
});

module.exports = router;
