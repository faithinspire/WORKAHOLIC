const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, dbConnected: isDbConnected } = require('../config/database');

// Supabase integration
let supabaseDB = null;
try {
    supabaseDB = require('../database/init-supabase');
    console.log('✅ Supabase module loaded');
} catch (err) {
    console.log('⚠️  Supabase module not available:', err.message);
}

// In-memory storage for when database is not connected
const inMemoryUsers = {};
const inMemoryJobseekers = {};
const inMemoryRecruiters = {};

// Generate JWT token
const generateToken = (userId, role, email) => {
  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// Sign Up - Generic endpoint (handles both jobseeker and recruiter)
router.post('/signup', async (req, res) => {
  try {
    // Accept both 'name' and 'fullname' for flexibility
    const { email, password, fullname, name, phone, role = 'jobseeker' } = req.body;
    const userFullname = fullname || name;
    
    if (!email || !password || !userFullname) {
      return res.status(400).json({ message: 'Missing required fields: email, password, fullname (or name)' });
    }

    // Check if user already exists (in-memory first)
    if (inMemoryUsers[email]) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user in in-memory storage
    const userId = `user_${Math.floor(Math.random() * 1000000)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      id: userId,
      email,
      password: hashedPassword,
      fullname: userFullname,
      phone,
      role,
      created_at: new Date().toISOString(),
      profile_picture: null,
      bio: '',
      followers: [],
      following: [],
    };

    inMemoryUsers[email] = userData;

    // Store all professional fields for job seekers
    if (role === 'jobseeker') {
      const { 
        professional_title, years_experience, education_level, field_of_study, educationLevel,
        desired_job_title, job_category, subject, employment_type, employmentType, desired_salary,
        availability, state, certifications, skills, bio: userBio, preferred_locations, lga
      } = req.body;
      
      const jobseekerProfile = {
        user_id: userId,
        fullname: userFullname,
        email,
        phone,
        state: state || '',
        lga: lga || '',
        professional_title: professional_title || '',
        years_experience: parseInt(years_experience) || 0,
        education_level: education_level || educationLevel || '',
        field_of_study: field_of_study || '',
        desired_job_title: desired_job_title || '',
        job_category: job_category || subject || 'teaching',
        employment_type: employment_type || employmentType || '',
        desired_salary: desired_salary || '',
        availability: availability || 'immediate',
        certifications: certifications || '',
        skills: skills || '',
        bio: userBio || '',
        preferred_locations: preferred_locations || [],
        profile_image_url: null,
        star_rating: 1,
        total_followers: 0,
        created_at: new Date().toISOString()
      };
      
      inMemoryJobseekers[userId] = jobseekerProfile;
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem(`jobseeker_${userId}`, JSON.stringify(jobseekerProfile));
        localStorage.setItem(`profile_${userId}`, JSON.stringify(jobseekerProfile));
      } catch (e) {
        console.warn('Could not save to localStorage');
      }
    } else if (role === 'recruiter') {
      const { company_name, institution_type, company_type, state } = req.body;
      
      const recruiterProfile = {
        user_id: userId,
        fullname: userFullname,
        email,
        phone,
        company_name: company_name || 'Company',
        institution_type: institution_type || 'school',
        company_type: company_type || 'school',
        state: state || 'Nigeria',
        subscription_type: 'basic',
        subscription_status: 'active',
        hires_used: 0,
        hires_free_used: 0,
        subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        scans_remaining: 5,
        profile_picture: null,
        company_logo: null,
        bio: '',
        created_at: new Date().toISOString()
      };
      
      inMemoryRecruiters[userId] = recruiterProfile;
      
      // Store in localStorage
      try {
        localStorage.setItem(`recruiter_${userId}`, JSON.stringify(recruiterProfile));
      } catch (e) {
        console.warn('Could not save to localStorage');
      }
    }

    // SAVE TO SUPABASE (async, non-blocking)
    (async () => {
      try {
        if (supabaseDB && supabaseDB.saveUser) {
          const supabaseUser = {
            id: userId,
            email,
            password: hashedPassword,
            fullname: userFullname,
            phone,
            role,
            created_at: new Date().toISOString(),
            ...req.body // Include all additional fields
          };
          await supabaseDB.saveUser(supabaseUser);
          console.log('✅ User saved to Supabase:', email);
        }
      } catch (supabaseError) {
        console.warn('⚠️  Could not save to Supabase:', supabaseError.message);
        // Continue anyway - in-memory and localStorage are sufficient
      }
    })();

    const token = generateToken(userId, role, email);

    // Return full user data
    const responseUser = {
      id: userId,
      email,
      fullname: userFullname,
      phone,
      role,
      ...req.body
    };

    res.status(201).json({
      message: `${role === 'jobseeker' ? 'Job Seeker' : 'Recruiter'} registered successfully`,
      token,
      userId,
      user: responseUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Recruiter Signup - Specific endpoint
router.post('/signup/jobseeker', async (req, res) => {
  try {
    const { email, password, fullname, phone, role = 'jobseeker' } = req.body;
    
    if (!email || !password || !fullname) {
      return res.status(400).json({ message: 'Missing required fields: email, password, fullname' });
    }

    // Check if user already exists
    if (inMemoryUsers[email]) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userId = `user_${Math.floor(Math.random() * 1000000)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    inMemoryUsers[email] = {
      id: userId,
      email,
      password: hashedPassword,
      fullname,
      phone: phone || '',
      role: 'jobseeker',
      created_at: new Date().toISOString(),
    };

    // Create initial jobseeker profile
    const jobseekerProfile = {
      user_id: userId,
      fullname,
      email,
      phone: phone || '',
      state: '',
      lga: '',
      professional_title: '',
      years_experience: 0,
      education_level: '',
      field_of_study: '',
      desired_job_title: '',
      job_category: 'teaching',
      employment_type: '',
      desired_salary: '',
      availability: 'immediate',
      certifications: '',
      skills: '',
      bio: '',
      preferred_locations: [],
      profile_image_url: null,
      star_rating: 1,
      total_followers: 0,
      created_at: new Date().toISOString()
    };

    inMemoryJobseekers[userId] = jobseekerProfile;

    // Store in localStorage
    try {
      localStorage.setItem(`jobseeker_${userId}`, JSON.stringify(jobseekerProfile));
      localStorage.setItem(`profile_${userId}`, JSON.stringify(jobseekerProfile));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    const token = generateToken(userId, 'jobseeker', email);

    res.status(201).json({
      message: 'Job Seeker registered successfully',
      token,
      userId,
      user: {
        id: userId,
        email,
        fullname,
        phone,
        role: 'jobseeker',
        ...req.body
      },
    });
  } catch (error) {
    console.error('Job seeker signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Recruiter Signup - Specific endpoint

router.post('/recruiter/signup', async (req, res) => {
  try {
    const { email, password, fullname, company_name, phone, institution_type, state } = req.body;
    
    if (!email || !password || !fullname || !company_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    if (inMemoryUsers[email]) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userId = `user_${Math.floor(Math.random() * 1000000)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    inMemoryUsers[email] = {
      id: userId,
      email,
      password: hashedPassword,
      fullname,
      phone: phone || '',
      role: 'recruiter',
      created_at: new Date().toISOString(),
    };

    const recruiterProfile = {
      user_id: userId,
      fullname,
      email,
      phone: phone || '',
      company_name,
      institution_type: institution_type || 'school',
      company_type: 'school',
      state: state || 'Nigeria',
      subscription_type: 'free',
      subscription_status: 'active',
      hires_used: 0,
      hires_free_used: 0,
      subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      scans_remaining: 5,
      profile_picture: null,
      company_logo: null,
      bio: '',
      created_at: new Date().toISOString()
    };

    inMemoryRecruiters[userId] = recruiterProfile;

    // Store in localStorage
    try {
      localStorage.setItem(`recruiter_${userId}`, JSON.stringify(recruiterProfile));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    // SAVE TO SUPABASE (async)
    (async () => {
      try {
        if (supabaseDB && supabaseDB.saveUser) {
          const supabaseUser = {
            id: userId,
            email,
            password: hashedPassword,
            fullname,
            phone: phone || '',
            role: 'recruiter',
            company_name,
            created_at: new Date().toISOString(),
            ...req.body
          };
          await supabaseDB.saveUser(supabaseUser);
          console.log('✅ Recruiter saved to Supabase:', email);
        }
      } catch (supabaseError) {
        console.warn('⚠️  Could not save recruiter to Supabase:', supabaseError.message);
      }
    })();

    const token = generateToken(userId, 'recruiter', email);

    res.status(201).json({
      message: 'Recruiter registered successfully',
      token,
      user: {
        id: userId,
        email,
        fullname,
        phone,
        role: 'recruiter',
        company_name,
        ...req.body
      },
    });
  } catch (error) {
    console.error('Recruiter signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let userRecord = null;

    // Check in-memory storage FIRST (most reliable)
    if (inMemoryUsers[email]) {
      userRecord = inMemoryUsers[email];
    } else {
      // Try database as fallback
      if (isDbConnected()) {
        try {
          const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          if (userResult && userResult.rows && userResult.rows.length > 0) {
            userRecord = userResult.rows[0];
          }
        } catch (dbError) {
          console.log('Database query failed, using in-memory only');
        }
      }
    }

    if (!userRecord) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, userRecord.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get full user info
    let userData = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      fullname: userRecord.fullname || 'User',
      phone: userRecord.phone || '',
    };

    // Get additional info from in-memory storage
    if (userRecord.role === 'jobseeker' && inMemoryJobseekers[userRecord.id]) {
      userData = { ...userData, ...inMemoryJobseekers[userRecord.id] };
    } else if (userRecord.role === 'recruiter' && inMemoryRecruiters[userRecord.id]) {
      userData = { ...userData, ...inMemoryRecruiters[userRecord.id] };
    } else {
      // Try to fetch from localStorage fallback
      try {
        const stored = localStorage.getItem(`${userRecord.role}_${userRecord.id}`);
        if (stored) {
          const storedData = JSON.parse(stored);
          userData = { ...userData, ...storedData };
        }
      } catch (e) {
        console.warn('Could not get localStorage fallback');
      }
    }

    const token = generateToken(userRecord.id, userRecord.role, email);

    res.json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
