const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client
let supabase = null;

try {
    if (SUPABASE_URL && SUPABASE_KEY) {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase client initialized');
    } else {
        console.warn('⚠️  Supabase credentials missing from .env');
    }
} catch (err) {
    console.warn('⚠️  Error initializing Supabase client:', err.message);
}

// Initialize all required tables in Supabase (async)
async function initializeDatabase() {
    try {
        if (!supabase) {
            console.log('⚠️  Supabase not initialized - using fallback storage');
            return null;
        }

        console.log('🗄️  Initializing Supabase Database...');
        console.log('URL:', SUPABASE_URL);

        // Test connection
        const { data: users, error: testError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (testError) {
            console.log('⚠️  Error testing Supabase connection:', testError.message);
        } else {
            console.log('✅ Connected to Supabase successfully');
        }

        return supabase;
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        return null;
    }
}

/**
 * Save user to Supabase
 */
async function saveUser(userData) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();

        if (error) {
            console.log('⚠️  Could not save to Supabase:', error.message);
            return null;
        }

        console.log('✅ User saved to Supabase');
        return data[0];
    } catch (error) {
        console.error('Error saving user:', error);
        return null;
    }
}

/**
 * Get user from Supabase
 */
async function getUser(email) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.log('⚠️  Error fetching user:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

/**
 * Save portfolio to Supabase
 */
async function savePortfolio(portfolioData) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('portfolios')
            .upsert([portfolioData])
            .select();

        if (error) {
            console.log('⚠️  Could not save portfolio:', error.message);
            return null;
        }

        console.log('✅ Portfolio saved to Supabase');
        return data[0];
    } catch (error) {
        console.error('Error saving portfolio:', error);
        return null;
    }
}

/**
 * Get portfolio from Supabase
 */
async function getPortfolio(userId) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.log('⚠️  Error fetching portfolio:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error getting portfolio:', error);
        return null;
    }
}

/**
 * Save comment to Supabase
 */
async function saveComment(commentData) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('comments')
            .insert([commentData])
            .select();

        if (error) {
            console.log('⚠️  Could not save comment:', error.message);
            return null;
        }

        console.log('✅ Comment saved to Supabase');
        return data[0];
    } catch (error) {
        console.error('Error saving comment:', error);
        return null;
    }
}

/**
 * Get comments for a post
 */
async function getComments(postId) {
    try {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('⚠️  Error fetching comments:', error.message);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

/**
 * Save job request to Supabase
 */
async function saveJobRequest(requestData) {
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('job_requests')
            .insert([requestData])
            .select();

        if (error) {
            console.log('⚠️  Could not save job request:', error.message);
            return null;
        }

        console.log('✅ Job request saved to Supabase');
        return data[0];
    } catch (error) {
        console.error('Error saving job request:', error);
        return null;
    }
}

/**
 * Get job requests for recruiter
 */
async function getJobRequests(recruiterId) {
    try {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('job_requests')
            .select('*')
            .eq('recruiter_id', recruiterId)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('⚠️  Error fetching job requests:', error.message);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error getting job requests:', error);
        return [];
    }
}

// Initialize on module load (async)
(async () => {
    if (supabase) {
        await initializeDatabase();
    }
})();

module.exports = {
    supabase,
    saveUser,
    getUser,
    savePortfolio,
    getPortfolio,
    saveComment,
    getComments,
    saveJobRequest,
    getJobRequests,
};
