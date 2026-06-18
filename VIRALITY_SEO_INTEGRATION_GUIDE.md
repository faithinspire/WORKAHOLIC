# SEO Virality & Advanced Job Posting Integration Guide

## 📋 Overview

This guide covers the integration of advanced SEO, viral sharing mechanisms, and programmatic landing pages into the FaithJobs platform.

**Components Added:**
1. ✅ Enhanced Database Schema with SEO fields
2. ✅ SEO Utilities Module (JSON-LD, OG meta, sharing)
3. ✅ React SEO Head Component
4. ✅ Job Detail Page with Full SEO
5. ✅ Application Success Page with Viral Sharing
6. ✅ Programmatic Landing Pages (Role/Location)
7. ✅ Backend Routes for SEO and Analytics

---

## 🗄️ Database Setup

### 1. Run Migration

```bash
# Navigate to database folder
cd database

# Execute the migration SQL file
psql -U your_db_user -d your_db_name -f migration-seo-virality.sql
```

**New Tables Created:**
- `job_categories` - Job categories (Teaching, Engineering, etc.)
- `job_category_mapping` - Jobs to categories (many-to-many)
- `job_locations` - Geographic locations (Remote, Lagos, Abuja, etc.)
- `job_location_mapping` - Jobs to locations (many-to-many)
- `job_shares` - Track viral shares per platform
- `job_analytics` - Track views, clicks, shares, applications
- `application_success` - Track application status and shares

**Enhanced Fields on `jobs` table:**
```sql
-- SEO & Metadata
- company_name (VARCHAR)
- company_logo_url (TEXT)
- job_type (Full-time, Part-time, Contract, Internship)
- work_location_type (On-site, Hybrid, Remote)
- base_salary_min (DECIMAL)
- base_salary_max (DECIMAL)
- currency (VARCHAR)
- is_backfilled (BOOLEAN) - distinguishes organic vs curated jobs
- slug (VARCHAR) - URL-friendly identifier

-- Computed SEO
- seo_title (VARCHAR)
- seo_description (TEXT)
- og_image_url (TEXT)

-- Hiring Details
- application_url (TEXT)
- hiring_manager_name (VARCHAR)
- hiring_manager_email (VARCHAR)

-- Analytics
- views_count (INT)
- share_count (INT)
- application_count (INT)
- date_posted (TIMESTAMP)
- valid_through (DATE)
```

---

## 🔧 Backend Setup

### 1. Install Utils Module

**File:** `utils/seo.js`

```bash
# Already included - contains:
# - generateSlug()
# - generateJobPostingJsonLd()
# - generateOpenGraphMeta()
# - generateTwitterCardMeta()
# - generateProgrammaticSeoMeta()
# - generateSharingTemplates()
```

### 2. Register New Routes in `server.js`

Add these routes to your main server file:

```javascript
// routes/jobs-seo.js - Job detail and analytics
const jobsSeoRoutes = require('./routes/jobs-seo');
app.use('/api/jobs-seo', jobsSeoRoutes);

// routes/jobs-landing.js - Programmatic landing pages
const jobsLandingRoutes = require('./routes/jobs-landing');
app.use('/api/jobs-landing', jobsLandingRoutes);
```

### 3. Verify Routes Available

**SEO Routes:**
- `GET /api/jobs-seo/by-slug/:slug` - Get job by slug with SEO data
- `GET /api/jobs-seo/:id` - Get job by ID with SEO data
- `GET /api/jobs-seo/:id/share-templates` - Get sharing templates
- `POST /api/jobs-seo/:id/track-view` - Track job views
- `POST /api/jobs-seo/:id/track-share` - Track viral shares

**Landing Page Routes:**
- `GET /api/jobs-landing/by-role/:role` - Jobs by category
- `GET /api/jobs-landing/by-location/:location` - Jobs by location
- `GET /api/jobs-landing/:role/:location` - Jobs by both filters
- `GET /api/jobs-landing/categories` - All categories
- `GET /api/jobs-landing/locations` - All locations

---

## 🎨 Frontend Setup

### 1. Copy Components

**File:** `client/src/components/SEOHead.js`

React component that injects SEO meta tags and JSON-LD into the document head.

```javascript
import SEOHead from '../components/SEOHead';

// Usage in any page:
<SEOHead
  title="Senior Python Developer at TechCorp"
  description="Senior Python Developer position..."
  ogTitle="Senior Python Developer at TechCorp"
  ogDescription="..."
  ogImage="https://..."
  ogUrl="https://..."
  jsonLd={...}
  canonical="https://..."
/>
```

### 2. Add Pages

**Job Detail Page:** `client/src/pages/JobDetail.js`
- Fetches job with SEO data
- Displays full job information
- Shows share menu
- Generates JSON-LD automatically
- Tracks views

**Application Success Page:** `client/src/pages/ApplicationSuccess.js`
- Shown after user applies to job
- Includes viral sharing incentives
- Multiple platform share buttons (LinkedIn, Twitter, WhatsApp, Email)
- Share tracking and metrics
- Encourages network sharing

**Programmatic Landing Page:** `client/src/pages/ProgrammaticLandingPage.js`
- Dynamic pages for categories/locations
- Grid of jobs matching filters
- SEO-optimized titles and descriptions
- Call-to-action sections

### 3. Update App.js Routes

Add these routes to your React Router:

```javascript
import JobDetail from './pages/JobDetail';
import ApplicationSuccess from './pages/ApplicationSuccess';
import ProgrammaticLandingPage from './pages/ProgrammaticLandingPage';

// In your Routes component:
<Route path="/jobs/:slug" element={<JobDetail />} />
<Route path="/jobs/id/:id" element={<JobDetail />} />
<Route path="/application-success/:applicationId" element={<ApplicationSuccess />} />
<Route path="/jobs/:role" element={<ProgrammaticLandingPage />} />
<Route path="/jobs/:location" element={<ProgrammaticLandingPage />} />
<Route path="/jobs/:role/:location" element={<ProgrammaticLandingPage />} />
```

---

## 📊 Data Structure Examples

### Job Object with SEO Fields

```json
{
  "id": 1,
  "title": "Senior Python Developer",
  "company_name": "TechCorp Nigeria",
  "company_logo_url": "https://...",
  "description": "We're looking for a Senior Python Developer...",
  "job_type": "Full-time",
  "work_location_type": "Remote",
  "base_salary_min": 2000000,
  "base_salary_max": 3500000,
  "currency": "NGN",
  "is_backfilled": false,
  "slug": "techcorp-senior-python-developer",
  "seo_title": "Senior Python Developer at TechCorp | Remote",
  "seo_description": "Senior Python Developer position at TechCorp. Remote, Full-time...",
  "og_image_url": "https://...",
  "application_url": "https://techcorp.com/apply",
  "hiring_manager_name": "John Doe",
  "hiring_manager_email": "john@techcorp.com",
  "date_posted": "2026-06-17T10:00:00Z",
  "valid_through": "2026-07-17",
  "views_count": 245,
  "share_count": 47,
  "application_count": 12
}
```

### JSON-LD Output

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Senior Python Developer",
  "description": "We're looking for...",
  "datePosted": "2026-06-17T10:00:00Z",
  "validThrough": "2026-07-17",
  "employmentType": "FULL_TIME",
  "jobLocationType": "TELECOMMUTE",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "TechCorp Nigeria",
    "logo": "https://..."
  },
  "baseSalary": {
    "@type": "PriceSpecification",
    "priceCurrency": "NGN",
    "price": "2000000-3500000"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG"
    }
  }
}
```

---

## 🔗 URL Patterns (Programmatic SEO)

### Single Filter Routes

```
/jobs/teaching-education          # All teaching jobs
/jobs/remote                       # All remote jobs
/jobs/engineering                  # All engineering jobs
```

### Combined Routes (Best for SEO)

```
/jobs/python-developer/remote      # Python devs, remote
/jobs/teaching/lagos               # Teaching jobs in Lagos
/jobs/data-analytics/hybrid        # Data analysts, hybrid
/jobs/engineering/abuja            # Engineering in Abuja
```

### SEO Benefits

- **Long-tail keywords**: "Remote Python Developer Jobs"
- **Location-based**: "Teaching Jobs in Lagos"
- **Category + Level**: "Entry-level Engineering Jobs"
- **Naturally indexable**: Each page is unique, fresh content

---

## 📈 Analytics & Metrics

### Tracked Metrics

**Job Analytics Table:**
- `view` - Page views
- `click` - Click-through rate
- `share` - Social shares
- `apply` - Applications
- `seo_impression` - Search impressions (optional integration)

### Track View

```javascript
// Automatically tracked when JobDetail page loads
POST /api/jobs-seo/:id/track-view
```

### Track Share

```javascript
// Called when user clicks share button
POST /api/jobs-seo/:id/track-share
Body: { platform: "LinkedIn", jobseeker_id: 123 }
```

### Viral Metrics

```sql
-- Query: Most shared jobs
SELECT j.id, j.title, COUNT(js.id) as shares
FROM jobs j
LEFT JOIN job_shares js ON j.id = js.job_id
GROUP BY j.id
ORDER BY shares DESC
LIMIT 10;

-- Query: Share by platform
SELECT platform, COUNT(*) as count
FROM job_shares
GROUP BY platform;

-- Query: Most viewed jobs
SELECT id, title, views_count
FROM jobs
ORDER BY views_count DESC;
```

---

## 🔄 Workflow: Creating a SEO-Optimized Job

### For Recruiters:

1. **Post Job** with new fields:
   - `job_type` (Full-time/Part-time/Contract/Internship)
   - `work_location_type` (Remote/On-site/Hybrid)
   - `base_salary_min` & `base_salary_max`
   - `slug` (auto-generated from title)

2. **System Automatically:**
   - Generates slug: `techcorp-senior-python-developer`
   - Creates JSON-LD structured data
   - Generates OG image URL
   - Assigns to categories via `job_category_mapping`
   - Assigns to locations via `job_location_mapping`

3. **Job is Indexed:**
   - Available at `/jobs/techcorp-senior-python-developer`
   - Shows in category pages: `/jobs/engineering/remote`
   - Google indexes via JSON-LD
   - Social platforms preview via OG tags

### For Job Seekers:

1. **Browse Landing Page:** `/jobs/remote` or `/jobs/data-analytics/remote`
2. **View Job Detail** with full SEO optimization
3. **Apply** - redirects to `/application-success/:id`
4. **Share** - tracks shares across platforms
5. **Network grows** - each share brings new candidates

---

## 🚀 Performance Tips

### 1. Image Optimization

For OG images:
```javascript
// Use dynamic OG image service (recommended)
`https://og-image.vercel.app/${text}.png?theme=dark`

// Or self-hosted images
`https://yoursite.com/og-images/job-${jobId}.png`
```

### 2. Caching

```javascript
// Cache landing pages for 1 hour (they don't change frequently)
res.set('Cache-Control', 'public, max-age=3600');

// Cache job detail pages for 30 minutes
res.set('Cache-Control', 'public, max-age=1800');
```

### 3. Database Indexes

All created automatically in migration:
- `idx_jobs_slug` - For slug lookups
- `idx_jobs_date_posted` - For sorting
- `idx_job_categories_slug` - For category pages
- `idx_job_location_mapping_*` - For location filters

---

## 🧪 Testing

### 1. Test JSON-LD

Use [Google Rich Results Test](https://search.google.com/test/rich-results):
- Paste your job detail URL
- Should show "JobPosting" structured data

### 2. Test OG Tags

Use [Open Graph Debugger](https://developers.facebook.com/tools/debug/):
- Enter job URL
- Check og:title, og:description, og:image

### 3. Test Landing Pages

```bash
# Should return jobs for this category
curl http://localhost:5000/api/jobs-landing/by-role/python-developer

# Should return jobs in this location
curl http://localhost:5000/api/jobs-landing/by-location/remote

# Should return jobs matching both
curl http://localhost:5000/api/jobs-landing/python-developer/remote
```

---

## 📝 Environment Variables

Add to your `.env` file:

```env
# Site configuration
SITE_URL=https://faithjobs.com
REACT_APP_SITE_URL=https://faithjobs.com

# OG Image service (optional)
OG_IMAGE_SERVICE=https://og-image.vercel.app

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_XXXX
```

---

## 🎯 Next Steps

1. **Run migration** - Set up all new tables
2. **Register routes** - Add to server.js
3. **Update frontend** - Add routes and components
4. **Seed data** - Populate categories and locations
5. **Test thoroughly** - Each page type
6. **Monitor analytics** - Track shares and views
7. **Iterate** - Based on performance metrics

---

## 📞 Support

For questions or issues:
1. Check JSON-LD validation
2. Verify database migrations ran
3. Check browser console for React errors
4. Review Vercel/server logs
5. Test with sample data

---

**Last Updated:** June 17, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
