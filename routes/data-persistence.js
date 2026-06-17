/**
 * Data Persistence Module for FAITHJOBS
 * Manages in-memory storage and provides data recovery
 */

class DataPersistence {
  constructor() {
    this.users = {};
    this.profiles = {};
    this.feedPosts = {};
    this.jobs = {};
    this.comments = {};
    this.notifications = {};
    this.applications = {};
    this.uploads = {};
  }

  /**
   * Save user profile
   */
  saveProfile(userId, profileData) {
    if (!this.profiles[userId]) {
      this.profiles[userId] = {
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        followers: [],
        following: [],
        total_followers: 0,
        total_posts: 0,
      };
    } else {
      this.profiles[userId] = {
        ...this.profiles[userId],
        ...profileData,
        updated_at: new Date().toISOString(),
      };
    }
    return this.profiles[userId];
  }

  /**
   * Get user profile
   */
  getProfile(userId) {
    return this.profiles[userId] || null;
  }

  /**
   * Get all profiles
   */
  getAllProfiles() {
    return Object.values(this.profiles);
  }

  /**
   * Save feed post
   */
  saveFeedPost(postId, postData) {
    this.feedPosts[postId] = {
      id: postId,
      ...postData,
      created_at: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      comments: [],
      reactions: {},
    };

    // Update user profile post count
    if (postData.user_id && this.profiles[postData.user_id]) {
      this.profiles[postData.user_id].total_posts = (this.profiles[postData.user_id].total_posts || 0) + 1;
    }

    return this.feedPosts[postId];
  }

  /**
   * Get feed posts
   */
  getFeedPosts(limit = 20, offset = 0) {
    const posts = Object.values(this.feedPosts).sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
    return {
      posts: posts.slice(offset, offset + limit),
      total: posts.length,
    };
  }

  /**
   * Add comment to post
   */
  addComment(postId, commentData) {
    if (!this.feedPosts[postId]) return null;

    const comment = {
      id: `comment_${Date.now()}`,
      ...commentData,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked_by: [],
    };

    if (!this.feedPosts[postId].comments) {
      this.feedPosts[postId].comments = [];
    }

    this.feedPosts[postId].comments.push(comment);
    return comment;
  }

  /**
   * Get post comments
   */
  getPostComments(postId) {
    if (!this.feedPosts[postId]) return [];
    return this.feedPosts[postId].comments || [];
  }

  /**
   * Like/unlike post
   */
  toggleLike(postId, userId, userName) {
    if (!this.feedPosts[postId]) return null;

    const post = this.feedPosts[postId];
    const likeIndex = post.liked_by.findIndex(l => l.user_id === userId);

    if (likeIndex > -1) {
      post.liked_by.splice(likeIndex, 1);
      post.likes--;
    } else {
      post.liked_by.push({ user_id: userId, user_name: userName });
      post.likes++;
    }

    return post;
  }

  /**
   * Save job posting
   */
  saveJob(jobId, jobData) {
    this.jobs[jobId] = {
      id: jobId,
      ...jobData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      applications: [],
      likes: 0,
      liked_by: [],
      comments: [],
    };

    // Update recruiter profile
    if (jobData.recruiter_id && this.profiles[jobData.recruiter_id]) {
      this.profiles[jobData.recruiter_id].total_jobs_posted = (this.profiles[jobData.recruiter_id].total_jobs_posted || 0) + 1;
    }

    return this.jobs[jobId];
  }

  /**
   * Get all jobs
   */
  getJobs(category = null, limit = 10, offset = 0) {
    let jobs = Object.values(this.jobs).sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );

    if (category && category !== 'all') {
      jobs = jobs.filter(job => job.category === category);
    }

    return {
      jobs: jobs.slice(offset, offset + limit),
      total: jobs.length,
    };
  }

  /**
   * Get recent jobs for homepage
   */
  getRecentJobs(limit = 5) {
    return Object.values(this.jobs)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  /**
   * Create notification
   */
  createNotification(userId, notificationData) {
    if (!this.notifications[userId]) {
      this.notifications[userId] = [];
    }

    const notification = {
      id: `notif_${Date.now()}`,
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications[userId].push(notification);
    return notification;
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId, limit = 10) {
    const userNotifs = this.notifications[userId] || [];
    return userNotifs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(userId, notificationId) {
    if (!this.notifications[userId]) return null;
    const notif = this.notifications[userId].find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      return notif;
    }
    return null;
  }

  /**
   * Save picture
   */
  savePicture(userId, pictureData) {
    this.uploads[userId] = {
      data: pictureData,
      uploaded_at: new Date().toISOString(),
      url: `http://localhost:5001/api/profiles/${userId}/picture/view`,
    };

    // Update profile picture
    if (this.profiles[userId]) {
      this.profiles[userId].profile_picture = this.uploads[userId].url;
    }

    return this.uploads[userId];
  }

  /**
   * Get picture
   */
  getPicture(userId) {
    return this.uploads[userId] || null;
  }

  /**
   * Get all users (for displaying in dashboard)
   */
  getAllUsers() {
    return Object.values(this.profiles).map(profile => ({
      ...profile,
      posts_count: profile.total_posts || 0,
      followers_count: profile.total_followers || 0,
    }));
  }

  /**
   * Get new users (sorted by creation date)
   */
  getNewUsers(limit = 10) {
    return Object.values(this.profiles)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  /**
   * Search profiles
   */
  searchProfiles(query) {
    return Object.values(this.profiles).filter(profile =>
      profile.user_name.toLowerCase().includes(query.toLowerCase()) ||
      (profile.bio && profile.bio.toLowerCase().includes(query.toLowerCase())) ||
      profile.job_category.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      total_users: Object.keys(this.profiles).length,
      total_posts: Object.keys(this.feedPosts).length,
      total_jobs: Object.keys(this.jobs).length,
      total_comments: Object.values(this.feedPosts).reduce((sum, post) => sum + (post.comments || []).length, 0),
      total_applications: Object.keys(this.applications).length,
    };
  }

  /**
   * Clear all data (for reset/cleanup)
   */
  clearAllData() {
    this.users = {};
    this.profiles = {};
    this.feedPosts = {};
    this.jobs = {};
    this.comments = {};
    this.notifications = {};
    this.applications = {};
    this.uploads = {};
  }

  /**
   * Export data (for backup)
   */
  exportData() {
    return {
      profiles: this.profiles,
      feedPosts: this.feedPosts,
      jobs: this.jobs,
      notifications: this.notifications,
      applications: this.applications,
      uploads: this.uploads,
      exported_at: new Date().toISOString(),
    };
  }

  /**
   * Import data (for restore)
   */
  importData(data) {
    if (data.profiles) this.profiles = data.profiles;
    if (data.feedPosts) this.feedPosts = data.feedPosts;
    if (data.jobs) this.jobs = data.jobs;
    if (data.notifications) this.notifications = data.notifications;
    if (data.applications) this.applications = data.applications;
    if (data.uploads) this.uploads = data.uploads;
  }
}

// Create global instance
const dataPersistence = new DataPersistence();

module.exports = dataPersistence;
