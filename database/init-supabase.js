/**
 * Supabase Database Initialization
 * Initializes connection and provides query helpers
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://zzpxjmmtlophkllboncl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTM0MzIyMywiZXhwIjoyMDk2OTE5MjIzfQ.rxdEi2xwDacskFUVU92LApeGc8Ysnxdh5Gmyjp72t-o';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

console.log('✅ Supabase client created successfully');

// Test connection
(async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count()', { count: 'exact' })
      .limit(1);

    if (error) {
      console.warn('⚠️  Supabase test query failed:', error.message);
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
  } catch (err) {
    console.warn('⚠️  Supabase connection warning:', err.message);
  }
})();

// Helper function to safely query Supabase
async function query(table, operation = 'select', options = {}) {
  try {
    switch (operation.toLowerCase()) {
      case 'select':
        return await supabase
          .from(table)
          .select(options.select || '*', options.selectOptions)
          .range(options.offset || 0, (options.offset || 0) + (options.limit || 100) - 1);

      case 'insert':
        return await supabase
          .from(table)
          .insert(options.data)
          .select();

      case 'update':
        return await supabase
          .from(table)
          .update(options.data)
          .eq(options.match_field || 'id', options.match_value)
          .select();

      case 'delete':
        return await supabase
          .from(table)
          .delete()
          .eq(options.match_field || 'id', options.match_value);

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (err) {
    console.error(`Supabase query error on ${table}:`, err.message);
    throw err;
  }
}

// Export Supabase client and helper
module.exports = {
  supabase,
  query,
  
  // Specific helpers for common operations
  
  async getProfiles(limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getProfileById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async upsertProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profile])
      .select()
      .single();
    return { data, error };
  },

  async getJobs(limit = 50, offset = 0, filters = {}) {
    let query = supabase
      .from('jobs')
      .select('*')
      .range(offset, offset + limit - 1);

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.recruiter_id) query = query.eq('recruiter_id', filters.recruiter_id);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async getJobById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createJob(job) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...job, created_at: new Date(), status: 'active' }])
      .select()
      .single();
    return { data, error };
  },

  async updateJob(id, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteJob(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getApplications(filters = {}) {
    let query = supabase
      .from('applications')
      .select('*');

    if (filters.job_id) query = query.eq('job_id', filters.job_id);
    if (filters.user_id) query = query.eq('user_id', filters.user_id);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async submitApplication(application) {
    const { data, error } = await supabase
      .from('applications')
      .insert([{ ...application, created_at: new Date(), status: 'pending' }])
      .select()
      .single();
    return { data, error };
  },

  async getMessages(conversationId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);
    return { data, error };
  },

  async sendMessage(message) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...message, created_at: new Date() }])
      .select()
      .single();
    return { data, error };
  },

  async getFeeds(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createPost(post) {
    const { data, error } = await supabase
      .from('feeds')
      .insert([{ ...post, created_at: new Date() }])
      .select()
      .single();
    return { data, error };
  },

  async searchJobs(searchQuery, limit = 20) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
      .limit(limit);
    return { data, error };
  }
};
