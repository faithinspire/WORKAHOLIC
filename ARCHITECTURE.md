# FaithJobs Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB BROWSER                               │
│                   (http://localhost:3000)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    AXIOS HTTP REQUESTS
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (PORT 3000)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               React Router (Navigation)                  │   │
│  │  /  /login  /signup  /jobs  /dashboard  /post-job       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │                    PAGES (8 total)                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ • Home                    • JobSeekerDashboard           │   │
│  │ • Login                   • RecruiterDashboard           │   │
│  │ • SignupJobSeeker         • JobBoard                     │   │
│  │ • SignupRecruiter         • PostJob                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │           Tailwind CSS Styling + Components             │   │
│  │               (Responsive, Mobile-friendly)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │         LocalStorage (Token Management)                  │   │
│  │    • JWT Token  • userId  • userRole                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                 REST API CALLS (JSON)
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              EXPRESS BACKEND (PORT 5000)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         MIDDLEWARE STACK                               │    │
│  │  • CORS  • Body Parser  • Error Handling  • Auth      │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                   │
│  ┌────────────────┬─────────┼──────────┬──────────┐            │
│  ▼                ▼         ▼          ▼          ▼            │
│  ┌──────┐  ┌──────────┐  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │auth  │  │jobSeeker │  │recruiter│ │  jobs  │ │uploads │   │
│  │route │  │  route   │  │  route │ │ route │ │ route  │   │
│  └──────┘  └──────────┘  └────────┘ └────────┘ └────────┘   │
│     │           │            │          │        │             │
│  signup      profile       search    postJob   upload        │
│  login      experience     upgrade    apply    download     │
│  logout      documents     premium    get                    │
│             workExp        scans      list                   │
│                                                                │
└──────────────────────────┬───────────────────────────────────────┘
                           │
              PostgreSQL DATABASE QUERIES (SQL)
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│         POSTGRESQL DATABASE (Port 5432)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   USERS      │  │ JOBSEEKERS   │  │ RECRUITERS   │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ email        │  │ user_id (FK) │  │ user_id (FK) │          │
│  │ password     │  │ fullname     │  │ company_name │          │
│  │ role         │  │ phone        │  │ state        │          │
│  │ created_at   │  │ star_rating  │  │ subscription │          │
│  └──────────────┘  │ state        │  │ scans_remain │          │
│                    │ lga          │  └──────────────┘          │
│                    └──────────────┘                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ DOCUMENTS    │  │WORK_EXPERI   │  │    JOBS      │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ jobseeker_id │  │ jobseeker_id │  │ recruiter_id │          │
│  │ type         │  │ institution  │  │ title        │          │
│  │ file_url     │  │ role         │  │ description  │          │
│  │ verified     │  │ start_date   │  │ location     │          │
│  └──────────────┘  │ end_date     │  └──────────────┘          │
│                    └──────────────┘                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │APPLICATIONS  │  │  SCANS       │  │  STATES      │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ job_id (FK)  │  │ recruiter_id │  │ name         │          │
│  │ jobseeker_id │  │ jobseeker_id │  │ (36 + FCT)   │          │
│  │ applied_at   │  │ scanned_at   │  └──────────────┘          │
│  └──────────────┘  └──────────────┘                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    LGAS      │  │ UNIVERSITIES │  │POLYTECHNICS  │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ name         │  │ name         │  │ name         │          │
│  │ state_id (FK)│  │ state        │  │ state        │          │
│  │(700+ LGAs)   │  │(13+ entries) │  │(5+ entries)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

### Job Seeker Flow
```
                    ┌──────────────────┐
                    │   START - HOME   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  SIGNUP CHOICE   │
                    │ (Job Seeker)     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
              ┌─────┤ MULTI-STEP FORM  │
              │     │ Step 1: Personal │
              │     │ Step 2: Education│
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ PROFILE CREATED  │
              │     │ (1 star rating)  │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ UPLOAD DOCUMENTS │
              │     │ • Credentials    │
              │     │ • ID             │
              │     │ • Letter         │
              │     │ • Work Exp       │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │  STAR RATING     │
              │     │  INCREASES       │
              │     │  (up to 5 stars) │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │  VIEW JOBS       │
              │     │  Browse board    │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │  APPLY FOR JOB   │
              │     │  Submit app      │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │  DASHBOARD       │
              │     │  Track apps      │
              │     │  View rating     │
              │     └────────┬─────────┘
              │              │
              └──────────────┘
```

### Recruiter Flow
```
                    ┌──────────────────┐
                    │   START - HOME   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  SIGNUP CHOICE   │
                    │ (Recruiter)      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ INSTITUTION INFO │
                    │ • Type           │
                    │ • University/    │
                    │   Polytechnic    │
                    │ • Location       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
              ┌─────┤ SELECT PLAN      │
              │     │ • Basic (₦5K)    │
              │     │ • Premium (₦20K) │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ ACCOUNT CREATED  │
              │     │ (Plan activated) │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ SEARCH CANDIDATES│
              │     │ Apply filters:   │
              │     │ • State/LGA      │
              │     │ • Education Lvl  │
              │     │ • Subject        │
              │     │ • Star Rating    │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ VIEW RESULTS     │
              │     │ Up to 5 profiles │
              │     │ (1 scan used)    │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ POST JOBS        │
              │     │ Free posting     │
              │     │ Unlimited        │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ VIEW APPLICATIONS│
              │     │ See all apps for │
              │     │ your jobs        │
              │     └────────┬─────────┘
              │              │
              │              ▼
              │     ┌──────────────────┐
              │     │ DASHBOARD        │
              │     │ Track scans      │
              │     │ Upgrade option   │
              │     │ View metrics     │
              │     └────────┬─────────┘
              │              │
              └──────────────┘
```

---

## Data Model Relationships

```
                    users
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌───▼────┐   ┌───▼──────┐   ┌──▼────────┐
    │jobseek │   │ recuriter│   │   admin   │
    └───┬────┘   └───┬──────┘   └──────────┘
        │            │
        │            │
    ┌───▼─────────┐  │        ┌───────────────┐
    │ documents   │  │        │  universities │
    │ work_exp    │  │        │  polytechnics │
    │             │  │        └───────────────┘
    └─────────────┘  │
                     │
            ┌────────┴────────┐
            │                 │
        ┌───▼────┐        ┌───▼────┐
        │  jobs  │        │ scans  │
        └───┬────┘        └────────┘
            │
        ┌───▼──────────┐
        │applications  │
        └──────────────┘

        ┌────────────────┐
        │    states      │
        └────────┬───────┘
                 │
        ┌────────▼────────┐
        │      lgas       │
        │  (Local areas)  │
        └─────────────────┘
```

---

## API Request/Response Flow

### Example: Job Seeker Search (Recruiter)

```
FRONTEND                           BACKEND                        DATABASE
   │                                 │                               │
   │ 1. User clicks "Search"         │                               │
   │ (with filters)                  │                               │
   │                                 │                               │
   │ 2. POST /api/recruiters/        │                               │
   │    search-jobseekers/:userId    │                               │
   │ {state, lga, education,         │                               │
   │  subject, minStarRating}        │                               │
   ├────────────────────────────────>│                               │
   │                                 │ 3. Verify JWT token           │
   │                                 │ 4. Check subscription         │
   │                                 │                               │
   │                                 │ 5. SELECT * FROM jobseekers   │
   │                                 │    WHERE state = $1           │
   │                                 │    AND star_rating >= $2      │
   │                                 │    LIMIT 5                    │
   │                                 ├──────────────────────────────>│
   │                                 │                               │
   │                                 │ 6. Return 5 records           │
   │                                 │<──────────────────────────────┤
   │                                 │                               │
   │                                 │ 7. INSERT INTO scans...       │
   │                                 │    (Record scan for billing)  │
   │                                 ├──────────────────────────────>│
   │                                 │                               │
   │ 8. {jobSeekers: [...]}          │                               │
   │<────────────────────────────────┤                               │
   │                                 │                               │
   │ 9. Display results              │                               │
   │    Update scans_remaining       │                               │
   │                                 │                               │
```

---

## Authentication Flow

```
1. USER SIGNUP
   ├─ Provide email & password
   ├─ Password → Bcrypt.hash() → Hashed password
   ├─ Store in DB: users table
   └─ Auto-login or redirect to login

2. USER LOGIN
   ├─ Provide email & password
   ├─ DB lookup by email
   ├─ Password → Bcrypt.compare() → Match?
   ├─ Generate JWT token with payload:
   │  {userId, role, email}
   ├─ Return token to frontend
   └─ Frontend stores in localStorage

3. PROTECTED REQUESTS
   ├─ Frontend sends: Authorization: Bearer <token>
   ├─ Backend middleware verifies JWT
   ├─ Extract userId & role from token
   ├─ Check if role allowed for endpoint
   ├─ Proceed if authorized
   └─ Return 403 if unauthorized

4. TOKEN EXPIRY
   ├─ Token expires after 7 days
   ├─ User must login again
   └─ New token issued
```

---

## Subscription & Scanning System

```
BASIC PLAN (₦5,000/month)
├─ 5 scans per month
├─ Each scan = search query
├─ Each search shows up to 5 profiles
├─ Scans reset monthly
└─ Can upgrade to Premium

PREMIUM PLAN (₦20,000/month)
├─ Unlimited scans
├─ No monthly limit
├─ Same features as Basic
├─ Preferred for high-volume recruiting
└─ Can downgrade to Basic

SCAN COUNTING
├─ Each search = 1 scan
├─ Results show: 5 profiles max
├─ Deducted from scans_remaining
├─ Not deducted if Premium
└─ Recorded in scans table for audit
```

---

## Star Rating Calculation

```
INITIAL STATE
└─ User registers → 1 star

INCREMENTAL GAINS
├─ Upload credentials → +1 star (2 stars total)
├─ Upload ID → +1 star (3 stars total)
├─ Upload letter → +1 star (4 stars total)
├─ Experience ≥ 2 years → +1 star (5 stars total)
└─ Work history entry → +1 star (5 stars total)

MAXIMUM
└─ 5 stars (capped)

AUTOMATIC RECALCULATION
├─ Triggered when:
│  ├─ Document uploaded
│  ├─ Profile updated
│  └─ Work experience added
└─ Backend updates star_rating field
```

---

## File Upload System

```
USER UPLOADS FILE
      │
      ▼
MULTER MIDDLEWARE
├─ Validate file type (JPG, PNG, PDF)
├─ Check file size (max 5MB)
├─ Generate unique filename
└─ Save to /uploads directory
      │
      ▼
STORE FILE PATH IN DB
├─ documents table
├─ file_url column
└─ Type: credential/cv/id/letter
      │
      ▼
RETURN FILE URL
├─ Frontend displays in profile
├─ Recruiter can view
└─ Stored for verification
```

---

## Component Hierarchy

```
App (Root)
├─ Navbar
│  ├─ Home link
│  ├─ Job Seeker signup
│  ├─ Recruiter signup
│  ├─ Login
│  └─ Role-based nav
│
├─ Home Page
│  ├─ Hero section
│  ├─ Feature cards
│  └─ CTA buttons
│
├─ Signup Pages
│  ├─ SignupJobSeeker
│  │  ├─ Step 1: Personal
│  │  └─ Step 2: Education
│  └─ SignupRecruiter
│     ├─ Institution info
│     └─ Subscription choice
│
├─ Login Page
│  ├─ Email input
│  ├─ Password input
│  └─ Submit button
│
├─ JobBoard
│  ├─ Filter section
│  └─ Job listings
│
├─ JobSeekerDashboard
│  ├─ Profile sidebar
│  ├─ Document list
│  └─ Work experience
│
├─ RecruiterDashboard
│  ├─ Subscription info
│  ├─ Search filters
│  └─ Results display
│
└─ PostJob
   ├─ Form fields
   └─ Submit button
```

---

This architecture provides a scalable, secure, and user-friendly platform for connecting teachers and lecturers with educational institutions across Nigeria.
