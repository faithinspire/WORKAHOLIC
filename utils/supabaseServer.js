/**
 * Supabase Server-Side Integration
 * Handles all database operations with Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://zzpxjmmtlophkllboncl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTM0MzIyMywiZXhwIjoyMDk2OTE5MjIzfQ.rxdEi2xwDacskFUVU92LApeGc8Ysnxdh5Gmyjp72t-o';

let supabase = null;
let connectionStatus = {
  connected: false,
  lastChecked: null,
  error: null
};

try {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: {
      schema: 'public'
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
  console.log('✅ Supabase client initialized');
} catch (err) {
  console.error('❌ Failed to initialize Supabase client:', err.message);
}

/**
 * Test Supabase connection
 */
async function testConnection() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('count()', { count: 'exact' })
      .limit(1);

    if (error) throw error;

    connectionStatus.connected = true;
    connectionStatus.error = null;
    connectionStatus.lastChecked = new Date();
    console.log('✅ Supabase connection verified');
    return true;
  } catch (err) {
    connectionStatus.connected = false;
    connectionStatus.error = err.message;
    connectionStatus.lastChecked = new Date();
    console.warn('⚠️  Supabase connection unavailable - using in-memory storage:', err.message);
    // Don't throw - allow app to continue with in-memory storage
    return false;
  }
}

/**
 * Get all users/profiles
 */
async function getAllUsers(limit = 100, offset = 0) {
  try {
    if (!connectionStatus.connected) {
      return { users: [], count: 0, success: false, error: 'Supabase not connected', fromFallback: true };
    }
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { users: data || [], count, success: true };
  } catch (err) {
    console.warn('⚠️  Error fetching users (using fallback):', err.message);
    return { users: [], count: 0, success: false, error: err.message, fromFallback: true };
  }
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  try {
    if (!connectionStatus.connected) {
      return { user: null, success: false, error: 'Supabase not connected', fromFallback: true };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { user: data, success: true };
  } catch (err) {
    console.warn('⚠️  Error fetching user (using fallback):', err.message);
    return { user: null, success: false, error: err.message, fromFallback: true };
  }
}

/**
 * Create or update user profile
 */
async function upsertUserProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ id: userId, ...profileData, updated_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ User profile updated:', userId);
    return { user: data, success: true };
  } catch (err) {
    console.error('Error upserting user profile:', err.message);
    return { user: null, success: false, error: err.message };
  }
}

/**
 * Get all jobs
 */
async function getAllJobs(limit = 50, offset = 0, filters = {}) {
  try {
    if (!connectionStatus.connected) {
      return { jobs: [], count: 0, success: false, error: 'Supabase not connected', fromFallback: true };
    }
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.recruiter_id) query = query.eq('recruiter_id', filters.recruiter_id);

    const { data, error, count } = await query;

    if (error) throw error;
    return { jobs: data || [], count, success: true };
  } catch (err) {
    console.warn('⚠️  Error fetching jobs (using fallback):', err.message);
    return { jobs: [], count: 0, success: false, error: err.message, fromFallback: true };
  }
}

/**
 * Get job by ID
 */
async function getJobById(jobId) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return { job: data, success: true };
  } catch (err) {
    console.error('Error fetching job:', err.message);
    return { job: null, success: false, error: err.message };
  }
}

/**
 * Create a new job posting
 */
async function createJob(jobData) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...jobData, created_at: new Date(), status: 'active' }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Job created:', data.id);
    return { job: data, success: true };
  } catch (err) {
    console.error('Error creating job:', err.message);
    return { job: null, success: false, error: err.message };
  }
}

/**
 * Update job posting
 */
async function updateJob(jobId, updates) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Job updated:', jobId);
    return { job: data, success: true };
  } catch (err) {
    console.error('Error updating job:', err.message);
    return { job: null, success: false, error: err.message };
  }
}

/**
 * Delete job
 */
async function deleteJob(jobId) {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
    console.log('✅ Job deleted:', jobId);
    return { success: true };
  } catch (err) {
    console.error('Error deleting job:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get job applications
 */
async function getApplications(limit = 100, offset = 0, filters = {}) {
  try {
    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (filters.job_id) query = query.eq('job_id', filters.job_id);
    if (filters.user_id) query = query.eq('user_id', filters.user_id);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error, count } = await query;

    if (error) throw error;
    return { applications: data || [], count, success: true };
  } catch (err) {
    console.error('Error fetching applications:', err.message);
    return { applications: [], count: 0, success: false, error: err.message };
  }
}

/**
 * Submit job application
 */
async function submitApplication(applicationData) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([{ ...applicationData, created_at: new Date(), status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Application submitted:', data.id);
    return { application: data, success: true };
  } catch (err) {
    console.error('Error submitting application:', err.message);
    return { application: null, success: false, error: err.message };
  }
}

/**
 * Get messages
 */
async function getMessages(conversationId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { messages: data || [], success: true };
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    return { messages: [], success: false, error: err.message };
  }
}

/**
 * Send message
 */
async function sendMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...messageData, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Message sent:', data.id);
    return { message: data, success: true };
  } catch (err) {
    console.error('Error sending message:', err.message);
    return { message: null, success: false, error: err.message };
  }
}

/**
 * Get feeds/posts
 */
async function getFeeds(limit = 50, offset = 0) {
  try {
    if (!connectionStatus.connected) {
      return { feeds: [], count: 0, success: false, error: 'Supabase not connected', fromFallback: true };
    }
    const { data, error, count } = await supabase
      .from('feeds')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { feeds: data || [], count, success: true };
  } catch (err) {
    console.warn('⚠️  Error fetching feeds (using fallback):', err.message);
    return { feeds: [], count: 0, success: false, error: err.message, fromFallback: true };
  }
}

/**
 * Create post
 */
async function createPost(postData) {
  try {
    const { data, error } = await supabase
      .from('feeds')
      .insert([{ ...postData, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Post created:', data.id);
    return { post: data, success: true };
  } catch (err) {
    console.error('Error creating post:', err.message);
    return { post: null, success: false, error: err.message };
  }
}

/**
 * Search jobs
 */
async function searchJobs(query, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return { jobs: data || [], success: true };
  } catch (err) {
    console.error('Error searching jobs:', err.message);
    return { jobs: [], success: false, error: err.message };
  }
}

/**
 * Get connection status
 */
function getConnectionStatus() {
  return connectionStatus;
}

/**
 * Get Supabase client (for direct access if needed)
 */
function getSupabaseClient() {
  return supabase;
}

// Test connection on startup
setTimeout(() => {
  testConnection();
}, 1000);

// Export all functions
module.exports = {
  // Connection
  testConnection,
  getConnectionStatus,
  getSupabaseClient,

  // Users
  getAllUsers,
  getUserById,
  upsertUserProfile,

  // Jobs
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,

  // Applications
  getApplications,
  submitApplication,

  // Messages
  getMessages,
  sendMessage,

  // Feeds
  getFeeds,
  createPost,

  // Search
  searchJobs
};
