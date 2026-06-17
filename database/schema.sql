-- Users table (base authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('jobseeker', 'recruiter', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Seekers table (Teachers)
CREATE TABLE IF NOT EXISTS jobseekers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    state VARCHAR(100),
    lga VARCHAR(100),
    education_level VARCHAR(100),
    subject VARCHAR(100),
    employment_type VARCHAR(50),
    years_experience INT DEFAULT 0,
    star_rating INT DEFAULT 1 CHECK (star_rating >= 0 AND star_rating <= 5),
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(100),
    university_id INT,
    polytechnic_id INT,
    state VARCHAR(100),
    lga VARCHAR(100),
    proof_url TEXT,
    subscription_type VARCHAR(50) DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'premium')),
    scans_remaining INT DEFAULT 5,
    subscription_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Polytechnics table
CREATE TABLE IF NOT EXISTS polytechnics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States table
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LGAs table
CREATE TABLE IF NOT EXISTS lgas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    jobseeker_id INT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credential', 'cv', 'id', 'letter', 'certificate', 'portfolio')),
    file_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- Work Experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id SERIAL PRIMARY KEY,
    jobseeker_id INT NOT NULL,
    institution VARCHAR(255),
    role VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- Scans table (Recruiter scanning job seekers)
CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    recruiter_id INT NOT NULL,
    jobseeker_id INT NOT NULL,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    education_level VARCHAR(100),
    subject VARCHAR(100),
    location_state VARCHAR(100),
    location_lga VARCHAR(100),
    employment_type VARCHAR(50),
    salary VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    jobseeker_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- Community Feeds table
CREATE TABLE IF NOT EXISTS community_feeds (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Feed Likes table
CREATE TABLE IF NOT EXISTS feed_likes (
    id SERIAL PRIMARY KEY,
    feed_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feed_id, user_id),
    FOREIGN KEY (feed_id) REFERENCES community_feeds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Feed Comments table
CREATE TABLE IF NOT EXISTS feed_comments (
    id SERIAL PRIMARY KEY,
    feed_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feed_id) REFERENCES community_feeds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- News Feeds table
CREATE TABLE IF NOT EXISTS news_feeds (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),
    image_url TEXT,
    category VARCHAR(50) CHECK (category IN ('education', 'tech', 'jobs', 'recruitment', 'news', 'opportunities')),
    external_url TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobseekers_user_id ON jobseekers(user_id);
CREATE INDEX IF NOT EXISTS idx_jobseekers_state ON jobseekers(state);
CREATE INDEX IF NOT EXISTS idx_recruiters_user_id ON recruiters(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_jobseeker_id ON documents(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_jobseeker_id ON work_experience(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_scans_recruiter_id ON scans(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(location_state);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_jobseeker_id ON applications(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_community_feeds_user_id ON community_feeds(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_likes_feed_id ON feed_likes(feed_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_feed_id ON feed_comments(feed_id);
CREATE INDEX IF NOT EXISTS idx_news_feeds_category ON news_feeds(category);
