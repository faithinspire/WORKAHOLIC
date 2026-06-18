-- ========================================================================
-- MIGRATION: Add SEO, Virality, and Advanced Job Data Support
-- Date: June 17, 2026
-- ========================================================================

-- ========================================================================
-- 1. ALTER JOBS TABLE: Add SEO, structured data, and virality fields
-- ========================================================================

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type VARCHAR(50) CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_location_type VARCHAR(50) CHECK (work_location_type IN ('On-site', 'Hybrid', 'Remote'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS base_salary_min DECIMAL(12, 2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS base_salary_max DECIMAL(12, 2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'NGN';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_backfilled BOOLEAN DEFAULT true COMMENT 'true = scraped/curated, false = organically posted by recruiter';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS slug VARCHAR(500) UNIQUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits TEXT COMMENT 'JSON array of benefits';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS required_skills TEXT COMMENT 'JSON array of required skills';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS nice_to_have_skills TEXT COMMENT 'JSON array of nice-to-have skills';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS valid_through DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_name VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_email VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_posting_type VARCHAR(50) DEFAULT 'Posting' COMMENT 'Schema.org JobPostingType';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS share_count INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_count INT DEFAULT 0;

-- ========================================================================
-- 2. CREATE JOB CATEGORIES TABLE: For programmatic SEO landing pages
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    seo_description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- 3. CREATE JOB_CATEGORY_MAPPING TABLE: Many-to-many relationship
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_category_mapping (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, category_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE CASCADE
);

-- ========================================================================
-- 4. CREATE JOB LOCATIONS TABLE: Improved location handling
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100) DEFAULT 'Nigeria',
    state VARCHAR(100),
    city VARCHAR(100),
    seo_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- 5. CREATE JOB_LOCATION_MAPPING TABLE: Many-to-many relationship
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_location_mapping (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    location_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, location_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES job_locations(id) ON DELETE CASCADE
);

-- ========================================================================
-- 6. CREATE JOB_SHARES TABLE: Track viral sharing metrics
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_shares (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    jobseeker_id INT NOT NULL,
    platform VARCHAR(50) CHECK (platform IN ('LinkedIn', 'Twitter', 'Email', 'Direct-Link', 'WhatsApp')),
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- ========================================================================
-- 7. CREATE JOB_ANALYTICS TABLE: Track engagement and SEO metrics
-- ========================================================================

CREATE TABLE IF NOT EXISTS job_analytics (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    metric_type VARCHAR(100) CHECK (metric_type IN ('view', 'click', 'share', 'apply', 'seo_impression')),
    count INT DEFAULT 1,
    recorded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, metric_type, recorded_date),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- ========================================================================
-- 8. CREATE APPLICATION_SUCCESS TABLE: Track successful applications
-- ========================================================================

CREATE TABLE IF NOT EXISTS application_success (
    id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    job_id INT NOT NULL,
    jobseeker_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'interviewed', 'offered', 'rejected')),
    shares_from_success_page INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE
);

-- ========================================================================
-- 9. ADD INDEXES for performance optimization
-- ========================================================================

CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_work_location_type ON jobs(work_location_type);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_backfilled ON jobs(is_backfilled);
CREATE INDEX IF NOT EXISTS idx_jobs_date_posted ON jobs(date_posted);
CREATE INDEX IF NOT EXISTS idx_jobs_valid_through ON jobs(valid_through);
CREATE INDEX IF NOT EXISTS idx_job_categories_slug ON job_categories(slug);
CREATE INDEX IF NOT EXISTS idx_job_locations_slug ON job_locations(slug);
CREATE INDEX IF NOT EXISTS idx_job_category_mapping_category_id ON job_category_mapping(category_id);
CREATE INDEX IF NOT EXISTS idx_job_location_mapping_location_id ON job_location_mapping(location_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_job_id ON job_shares(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_platform ON job_shares(platform);
CREATE INDEX IF NOT EXISTS idx_job_analytics_job_id ON job_analytics(job_id);
CREATE INDEX IF NOT EXISTS idx_job_analytics_metric_type ON job_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_application_success_job_id ON application_success(job_id);
CREATE INDEX IF NOT EXISTS idx_application_success_status ON application_success(status);

-- ========================================================================
-- 10. POPULATE JOB CATEGORIES (Initial seed data)
-- ========================================================================

INSERT INTO job_categories (name, slug, description, seo_description, sort_order) VALUES
('Teaching & Education', 'teaching-education', 'Teaching positions in schools and universities', 'Find teaching jobs in Nigerian schools, universities, and educational institutions', 1),
('Engineering', 'engineering', 'Software, mechanical, and civil engineering roles', 'Engineering jobs in Nigeria - software developers, DevOps, and more', 2),
('Data & Analytics', 'data-analytics', 'Data science, data engineering, and analytics roles', 'Data science and analytics jobs in Nigeria', 3),
('Business & Finance', 'business-finance', 'Finance, accounting, business development roles', 'Finance and business development jobs in Nigeria', 4),
('Design & Creative', 'design-creative', 'UI/UX design, graphic design, and creative roles', 'Design and creative jobs in Nigeria', 5),
('Sales & Marketing', 'sales-marketing', 'Sales, marketing, and business development roles', 'Sales and marketing jobs in Nigeria', 6),
('Healthcare', 'healthcare', 'Medical, nursing, and healthcare professional roles', 'Healthcare and medical jobs in Nigeria', 7),
('Internships', 'internships', 'Internship and graduate programs', 'Internship opportunities in Nigeria', 8)
ON CONFLICT (slug) DO NOTHING;

-- ========================================================================
-- 11. POPULATE JOB LOCATIONS (Initial seed data)
-- ========================================================================

INSERT INTO job_locations (name, slug, state, city, seo_description) VALUES
('Remote', 'remote', 'Remote', NULL, 'Work from anywhere - remote jobs in Nigeria'),
('Lagos', 'lagos', 'Lagos', 'Lagos', 'Jobs in Lagos, Nigeria - Nigeria''s business hub'),
('Abuja', 'abuja', 'Federal Capital Territory', 'Abuja', 'Jobs in Abuja, Nigeria - capital city opportunities'),
('Kano', 'kano', 'Kano', 'Kano', 'Jobs in Kano, Nigeria'),
('Enugu', 'enugu', 'Enugu', 'Enugu', 'Jobs in Enugu, Nigeria'),
('Port Harcourt', 'port-harcourt', 'Rivers', 'Port Harcourt', 'Jobs in Port Harcourt, Nigeria'),
('Ibadan', 'ibadan', 'Oyo', 'Ibadan', 'Jobs in Ibadan, Nigeria'),
('Hybrid', 'hybrid', 'Multiple', NULL, 'Hybrid work arrangements - flexible location jobs')
ON CONFLICT (slug) DO NOTHING;

-- ========================================================================
-- End of Migration
-- ========================================================================
-- Run this migration carefully. Back up your database first.
-- Test in development environment before production deployment.
-- ========================================================================
