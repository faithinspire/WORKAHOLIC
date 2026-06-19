# 📚 SEO & Virality API Reference Guide

## Overview

This document provides complete API reference for the SEO and Virality system endpoints.

**Base URL (Local):** `http://localhost:5000`  
**Base URL (Production):** `https://faithjobs.vercel.app`

---

## Jobs SEO Endpoints

### 1. Get Job by ID

**Endpoint:**
```
GET /api/jobs-seo/:id
```

**Description:** Retrieve a job with full SEO metadata and sharing templates.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | Integer | Yes | Job ID |

**Response:**
```json
{
  "id": 1,
  "title": "Senior Python Developer",
  "company_name": "TechCorp",
  "description": "We're looking for...",
  "job_type": "Full-time",
  "work_location_type": "Remote",
  "base_salary_min": 5000000,
  "base_salary_max": 7500000,
  "currency": "NGN",
  "slug": "techcorp-senior-python-developer",
  "views_count": 142,
  "share_count": 28,
  "application_count": 5,
  "seo": {
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Senior Python Developer",
      "jobLocationType": "TELECOMMUTE",
      "baseSalary": {
        "currency": "NGN",
        "value": {
          "minValue": 5000000,
          "maxValue": 7500000
        }
      }
    },
    "ogMeta": {
      "title": "Senior Python Developer at TechCorp",
      "description": "We're looking for a talented...",
      "image": "https://...",
      "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-python-developer"
    },
    "sharingTemplates": {
      "linkedin": "I'm exploring...",
      "twitter": "Check out this...",
      "whatsapp": "You might be interested...",
      "email": "..."
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Job not found
- `500` - Server error

**Example:**
```bash
curl http://localhost:5000/api/jobs-seo/1
```

---

### 2. Get Job by URL Slug

**Endpoint:**
```
GET /api/jobs-seo/by-slug/:slug
```

**Description:** Retrieve a job using its URL slug (used for SEO-friendly URLs).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slug` | String | Yes | Job URL slug (e.g., `techcorp-senior-developer`) |

**Response:** Same as Get Job by ID

**Status Codes:**
- `200` - Success
- `404` - Job not found
- `500` - Server error

**Example:**
```bash
curl http://localhost:5000/api/jobs-seo/by-slug/techcorp-senior-python-developer
```

**Note:** This endpoint only returns jobs where `is_backfilled = false` (organically posted jobs).

---

### 3. Get Share Templates

**Endpoint:**
```
GET /api/jobs-seo/:id/share-templates
```

**Description:** Get pre-formatted sharing templates for a specific job across 5 platforms.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | Integer | Yes | Job ID |

**Response:**
```json
{
  "linkedin": {
    "title": "Exciting opportunity!",
    "text": "I found this great opportunity: Senior Python Developer at TechCorp...",
    "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-developer"
  },
  "twitter": {
    "text": "🚀 Hiring: Senior Python Developer at TechCorp - Remote\n\n✨ Salary: NGN 5-7.5M\n\nCheck it out: [url]",
    "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-developer"
  },
  "whatsapp": {
    "text": "Hey! Found an interesting job posting that might be perfect for you...",
    "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-developer"
  },
  "email": {
    "subject": "Check out: Senior Python Developer at TechCorp",
    "body": "I wanted to share this job opportunity with you...",
    "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-developer"
  },
  "directLink": {
    "url": "https://faithjobs.vercel.app/jobs/techcorp-senior-developer"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Job not found
- `500` - Server error

**Example:**
```bash
curl http://localhost:5000/api/jobs-seo/1/share-templates
```

---

### 4. Track Job View

**Endpoint:**
```
POST /api/jobs-seo/:id/track-view
```

**Description:** Record that a user viewed a job (for analytics).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | Integer | Yes | Job ID |

**Request Body:** (None required)
```json
{}
```

**Response:**
```json
{
  "success": true
}
```

**Side Effects:**
- Increments `jobs.views_count` by 1
- Creates/updates entry in `job_analytics` table with `metric_type='view'`

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:5000/api/jobs-seo/1/track-view
```

---

### 5. Track Job Share

**Endpoint:**
```
POST /api/jobs-seo/:id/track-share
```

**Description:** Record that a user shared a job on a specific platform.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | Integer | Yes | Job ID |

**Request Body:**
```json
{
  "platform": "LinkedIn",
  "jobseeker_id": 42
}
```

**Platform Options:**
- `LinkedIn`
- `Twitter`
- `WhatsApp`
- `Email`
- `Direct-Link`

**Response:**
```json
{
  "success": true,
  "message": "Share tracked"
}
```

**Side Effects:**
- Creates entry in `job_shares` table with platform and timestamp
- Increments `jobs.share_count` by 1
- Creates/updates entry in `job_analytics` table with `metric_type='share'`

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:5000/api/jobs-seo/1/track-share \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "LinkedIn",
    "jobseeker_id": 42
  }'
```

**Validation:**
- `platform` must be one of the 5 allowed values
- `jobseeker_id` must be a valid integer

---

## Jobs Landing Page Endpoints

### 1. Get All Categories

**Endpoint:**
```
GET /api/jobs-landing/categories
```

**Description:** Retrieve all job categories for navigation and filtering.

**Parameters:** (None)

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Teaching & Education",
      "slug": "teaching-education",
      "description": "Teaching positions in schools and universities",
      "icon_url": null,
      "seo_description": "Find teaching jobs in Nigerian schools, universities, and educational institutions",
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-06-17T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Engineering",
      "slug": "engineering",
      "description": "Software, mechanical, and civil engineering roles",
      "seo_description": "Engineering jobs in Nigeria - software developers, DevOps, and more",
      "sort_order": 2,
      "is_active": true
    }
  ],
  "total": 8
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl http://localhost:5000/api/jobs-landing/categories
```

**Default Categories:**
1. Teaching & Education
2. Engineering
3. Data & Analytics
4. Business & Finance
5. Design & Creative
6. Sales & Marketing
7. Healthcare
8. Internships

---

### 2. Get All Locations

**Endpoint:**
```
GET /api/jobs-landing/locations
```

**Description:** Retrieve all job locations for filtering.

**Parameters:** (None)

**Response:**
```json
{
  "locations": [
    {
      "id": 1,
      "name": "Remote",
      "slug": "remote",
      "country": "Remote",
      "state": null,
      "city": null,
      "seo_description": "Work from anywhere - remote jobs in Nigeria",
      "is_active": true,
      "created_at": "2026-06-17T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Lagos",
      "slug": "lagos",
      "country": "Nigeria",
      "state": "Lagos",
      "city": "Lagos",
      "seo_description": "Jobs in Lagos, Nigeria - Nigeria's business hub",
      "is_active": true
    }
  ],
  "total": 8
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl http://localhost:5000/api/jobs-landing/locations
```

**Default Locations:**
1. Remote
2. Lagos
3. Abuja
4. Kano
5. Enugu
6. Port Harcourt
7. Ibadan
8. Hybrid

---

### 3. Get Jobs by Category (Role)

**Endpoint:**
```
GET /api/jobs-landing/by-role/:role
```

**Description:** Get all jobs in a specific category.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `role` | String | Yes | Category slug (e.g., `teaching-education`) |
| `limit` | Integer | No | Results per page (default: 20) |
| `offset` | Integer | No | Pagination offset (default: 0) |

**Query String Example:**
```
/api/jobs-landing/by-role/engineering?limit=10&offset=0
```

**Response:**
```json
{
  "category": {
    "id": 2,
    "name": "Engineering",
    "slug": "engineering",
    "description": "Software, mechanical, and civil engineering roles",
    "seo_description": "Engineering jobs in Nigeria - software developers, DevOps, and more"
  },
  "jobs": [
    {
      "id": 5,
      "title": "Junior Frontend Developer",
      "company_name": "WebStudio",
      "slug": "webstudio-junior-frontend-developer",
      "views_count": 45,
      "share_count": 8
    }
  ],
  "seo": {
    "title": "Engineering Jobs in Nigeria | FaithJobs",
    "description": "Engineering jobs in Nigeria - software developers, DevOps, and more"
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 42
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Category not found
- `500` - Server error

**Example:**
```bash
curl "http://localhost:5000/api/jobs-landing/by-role/engineering?limit=10"
```

---

### 4. Get Jobs by Location

**Endpoint:**
```
GET /api/jobs-landing/by-location/:location
```

**Description:** Get all jobs in a specific location.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location` | String | Yes | Location slug (e.g., `remote`, `lagos`) |
| `limit` | Integer | No | Results per page (default: 20) |
| `offset` | Integer | No | Pagination offset (default: 0) |

**Response:** Similar structure to by-role endpoint

**Status Codes:**
- `200` - Success
- `404` - Location not found
- `500` - Server error

**Example:**
```bash
curl "http://localhost:5000/api/jobs-landing/by-location/remote?limit=10"
```

---

### 5. Get Jobs by Role AND Location

**Endpoint:**
```
GET /api/jobs-landing/:role/:location
```

**Description:** Get jobs matching both category and location (combination filter).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `role` | String | Yes | Category slug (e.g., `engineering`) |
| `location` | String | Yes | Location slug (e.g., `remote`) |
| `limit` | Integer | No | Results per page (default: 20) |
| `offset` | Integer | No | Pagination offset (default: 0) |

**Response:**
```json
{
  "category": { ... },
  "location": { ... },
  "jobs": [ ... ],
  "seo": {
    "title": "Remote Engineering Jobs in Nigeria | FaithJobs",
    "description": "Find remote engineering jobs in Nigeria..."
  },
  "pagination": { ... }
}
```

**Status Codes:**
- `200` - Success
- `404` - Category or location not found
- `500` - Server error

**Example:**
```bash
curl "http://localhost:5000/api/jobs-landing/engineering/remote?limit=10"
```

---

## Response Format Standards

### Error Response

All endpoints follow consistent error format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Messages:**
- `"Job not found"` - Requested job doesn't exist
- `"Category not found"` - Requested category doesn't exist
- `"Location not found"` - Requested location doesn't exist
- `"Platform and jobseeker_id required"` - Missing required fields
- `"Server error"` - Unexpected server error

---

## Rate Limiting

Currently **no rate limiting** is implemented. For production, consider:
- Rate limit tracking endpoints: 100 requests/minute per IP
- Rate limit listing endpoints: 1000 requests/minute per IP

---

## Authentication

Currently **no authentication** required. For production, consider:
- JWT tokens for tracking endpoints
- API key for sensitive operations
- Role-based access control

---

## Pagination

### Standard Pagination Format

All listing endpoints support pagination:

**Query Parameters:**
```
?limit=20&offset=0
```

**Response:**
```json
{
  "items": [ ... ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150
  }
}
```

**Calculating Pages:**
```javascript
const totalPages = Math.ceil(pagination.total / pagination.limit);
const currentPage = (pagination.offset / pagination.limit) + 1;
```

---

## Data Types

### Job Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique job ID |
| `title` | String | Job title |
| `company_name` | String | Company name |
| `slug` | String | URL slug |
| `description` | String | Full job description |
| `job_type` | String | Full-time, Part-time, Contract, Internship |
| `work_location_type` | String | On-site, Hybrid, Remote |
| `base_salary_min` | Decimal | Minimum salary |
| `base_salary_max` | Decimal | Maximum salary |
| `currency` | String | Currency code (NGN, USD, etc.) |
| `views_count` | Integer | Total views |
| `share_count` | Integer | Total shares |
| `application_count` | Integer | Total applications |

---

## Usage Examples

### JavaScript/Fetch

**Get jobs by category:**
```javascript
async function getEngineeringJobs() {
  const response = await fetch(
    'http://localhost:5000/api/jobs-landing/by-role/engineering?limit=10'
  );
  const data = await response.json();
  console.log(data.jobs);
}
```

**Track a view:**
```javascript
async function trackJobView(jobId) {
  const response = await fetch(
    `http://localhost:5000/api/jobs-seo/${jobId}/track-view`,
    { method: 'POST' }
  );
  const data = await response.json();
  console.log(data.success);
}
```

**Track a share:**
```javascript
async function trackJobShare(jobId, platform) {
  const response = await fetch(
    `http://localhost:5000/api/jobs-seo/${jobId}/track-share`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: platform,
        jobseeker_id: 42
      })
    }
  );
  const data = await response.json();
  console.log(data.success);
}
```

### curl

**Get categories:**
```bash
curl http://localhost:5000/api/jobs-landing/categories
```

**Get remote jobs:**
```bash
curl "http://localhost:5000/api/jobs-landing/by-location/remote?limit=20"
```

**Get remote engineering jobs:**
```bash
curl "http://localhost:5000/api/jobs-landing/engineering/remote?limit=10"
```

---

## Filtering & Search

### Supported Filters

| Endpoint | Filters |
|----------|---------|
| `by-role/:role` | Category only |
| `by-location/:location` | Location only |
| `/:role/:location` | Category + Location |

### Future Enhancements

Consider adding:
- Job type filter (`?job_type=Full-time`)
- Salary range filter (`?min_salary=1000000&max_salary=5000000`)
- Text search (`?search=python`)
- Skills filter (`?skills=javascript,react`)

---

## SEO Meta Tags Reference

### Open Graph Tags

```html
<meta property="og:title" content="Job Title at Company">
<meta property="og:description" content="Job description...">
<meta property="og:image" content="https://...">
<meta property="og:type" content="website">
<meta property="og:url" content="https://...">
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Job Title at Company">
<meta name="twitter:description" content="Job description...">
<meta name="twitter:image" content="https://...">
```

### JSON-LD (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Developer",
  "jobLocationType": "TELECOMMUTE",
  "baseSalary": {
    "currency": "NGN",
    "value": {
      "minValue": 5000000,
      "maxValue": 7500000
    }
  }
}
```

---

## Support & Issues

**For API issues:**
1. Check endpoint URL spelling
2. Verify required parameters
3. Check response status code
4. Review server logs
5. Test with curl first

**For SEO issues:**
1. View page source in browser
2. Check meta tags present
3. Use https://metatags.io/
4. Validate JSON-LD at https://jsonld.netlify.app/

---

**API Reference Complete** ✅

For more details, see:
- `PHASE_1_EXECUTION_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- Source code comments

