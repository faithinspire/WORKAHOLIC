import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zzpxjmmtlophkllboncl.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDMyMjMsImV4cCI6MjA5NjkxOTIyM30.eY7AQba-GwOaTOdV95CxB4OzwvAxsEwefcmJ4ZxaqAc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase.from('profiles').select('count()').limit(1);
      if (error) throw error;
      console.log('✓ Supabase connection successful');
      return true;
    } catch (err) {
      console.error('✗ Supabase connection failed:', err.message);
      return false;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      return null;
    }
  },

  // Get all jobs
  async getJobs(limit = 10, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { jobs: data, total: count };
    } catch (err) {
      console.error('Error fetching jobs:', err.message);
      return { jobs: [], total: 0 };
    }
  },

  // Get job by ID
  async getJobById(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching job:', err.message);
      return null;
    }
  },

  // Submit job application
  async submitApplication(applicationData) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✓ Application submitted successfully');
      return data;
    } catch (err) {
      console.error('Error submitting application:', err.message);
      return null;
    }
  },

  // Get user applications
  async getUserApplications(userId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching applications:', err.message);
      return [];
    }
  },

  // Get recruiter's posted jobs
  async getRecruiterJobs(recruiterId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err.message);
      return [];
    }
  },

  // Get messages
  async getMessages(conversationId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching messages:', err.message);
      return [];
    }
  },

  // Send message
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending message:', err.message);
      return null;
    }
  },

  // Get feeds/posts
  async getFeeds(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching feeds:', err.message);
      return [];
    }
  },

  // Create post
  async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from('feeds')
        .insert([postData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating post:', err.message);
      return null;
    }
  },

  // Search jobs
  async searchJobs(query) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(20);
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error searching jobs:', err.message);
      return [];
    }
  }
};

export default supabase;
