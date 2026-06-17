# 🚀 FaithJobs with Supabase - Quick Setup Guide

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database (perfect for our app!)
- Real-time features
- Authentication
- Vector/similarity search
- Free tier with generous limits

---

## Step 1: Create Supabase Account & Project

### 1a. Sign Up
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify email

### 1b. Create Organization
1. Create organization name (e.g., "FaithJobs")
2. Click "Create organization"

### 1c. Create Project
1. Click "New Project"
2. Fill in:
   - **Project name**: faithjobs
   - **Database password**: Create strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing plan**: Free (plenty for testing)
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

---

## Step 2: Get Supabase Connection Details

### 2a. Copy Connection String
1. In Supabase dashboard, go to **Settings** > **Database**
2. Find **Connection string** section
3. Copy the **URI** (starts with `postgresql://`)
4. It looks like: `postgresql://postgres:[password]@[host]:[port]/postgres`

### 2b. Extract Details (if needed)
From the connection string:
- **Host**: supabase project reference + .supabase.co
- **Port**: 5432
- **Database**: postgres
- **User**: postgres
- **Password**: The password you created

---

## Step 3: Create .env File

### Create `.`.env file in project root:

```bash
# Copy .env.example to .env
cp .env.example .env
```

### Edit `.env` with your Supabase details:

```
PORT=5000
NODE_ENV=development

# Supabase Connection (RECOMMENDED - simplest method)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Replace:**
- `[YOUR_PASSWORD]` - The database password you created
- `[YOUR_PROJECT_REF]` - Your Supabase project reference

### Example:
```
DATABASE_URL=postgresql://postgres:MyPassword123@abcdefgh.supabase.co:5432/postgres
```

---

## Step 4: Initialize Database with Supabase

### 4a. Install Dependencies
```bash
npm install
```

### 4b. Create Tables in Supabase
There are 3 options:

#### **Option A: Using Supabase Dashboard (Recommended for first time)**
1. Go to your Supabase dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy entire content from `database/schema.sql`
5. Paste into SQL editor
6. Click **Run**
7. Wait for success message

#### **Option B: Using psql CLI**
```bash
# Install psql if you don't have it
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Connect and run schema
psql -h [YOUR_HOST] -U postgres -d postgres -f database/schema.sql
```

#### **Option C: Using Node.js Script (Automated)**
```bash
# Update init.js to work with Supabase connection string
node init.js
```

### 4c. Seed Data
```bash
# Seed states, LGAs, universities, polytechnics
node database/seed.js
```

---

## Step 5: Start the Servers

### Terminal 1: Backend
```bash
npm start
```
You should see:
```
Server running on port 5000
```

### Terminal 2: Frontend
```bash
cd client
npm install (if not already done)
npm start
```
Browser opens to `http://localhost:3000`

---

## Step 6: Test the Application

### Login with Sample Accounts

**Job Seeker:**
- Email: `teacher@example.com`
- Password: `teacher123`

**Recruiter:**
- Email: `recruiter@example.com`
- Password: `recruiter123`

### Test Features
1. ✅ Login as Job Seeker
2. ✅ View dashboard
3. ✅ Logout & login as Recruiter
4. ✅ Search job seekers
5. ✅ View applications

---

## Supabase Dashboard - Key Features

### 1. SQL Editor
- Run custom SQL queries
- Manage database directly
- View query results

**Path**: Dashboard > SQL Editor

### 2. Table Editor
- View/edit data visually
- Add/delete records
- Filter and sort

**Path**: Dashboard > Table Editor

### 3. Authentication
- Set up Supabase Auth (if you want)
- Manage users
- View sign-ups

**Path**: Dashboard > Authentication

### 4. Realtime
- Enable real-time subscriptions
- Get live data updates
- Perfect for messaging features

**Path**: Dashboard > Realtime

### 5. Storage
- Upload files/images
- Manage file storage
- Use instead of local uploads

**Path**: Dashboard > Storage

### 6. Backups
- View automatic backups
- Restore database
- Point-in-time recovery

**Path**: Dashboard > Backups

---

## Common Supabase Tasks

### View All Data in Table
1. Go to **Table Editor**
2. Click table name
3. View records
4. Click record to edit

### Run Custom Query
1. Go to **SQL Editor**
2. Click **New Query**
3. Write SQL
4. Click **Run**
5. View results

### Add New Row
1. **Table Editor** > Select table
2. Click **Insert Row**
3. Fill in values
4. Click **Save**

### Delete Row
1. **Table Editor** > Select table
2. Click row to select
3. Click **Delete**
4. Confirm

### Backup Database
1. Go to **Settings** > **Backups**
2. View automatic backups
3. Click to restore if needed

---

## Troubleshooting Supabase

### Issue: "Cannot connect to database"

**Check:**
1. Is DATABASE_URL in .env correct?
2. Is Supabase project initialized? (Wait 5+ mins after creation)
3. Is your IP whitelisted? (Usually automatic)

**Solution:**
```bash
# Test connection
psql [YOUR_DATABASE_URL]
```

### Issue: "Tables don't exist"

**Solution:**
1. Go to Supabase > SQL Editor
2. Run schema.sql again
3. Or run: `node database/seed.js`

### Issue: "Port already in use"

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 [PID]
```

### Issue: "401 Unauthorized"

**Solution:**
1. Sample accounts not created
2. Run: `node init.js`
3. Or manually insert test data into users table

---

## Migrating from Local to Supabase

### Backup Local Data
```bash
# Export local database
pg_dump faithjobs > backup.sql
```

### Import to Supabase
```bash
# If you have data in local DB, import to Supabase
psql [YOUR_SUPABASE_DATABASE_URL] < backup.sql
```

---

## Using Supabase Storage (Instead of Local Upload)

### Setup Supabase Storage
1. Go to **Storage** in dashboard
2. Click **New Bucket**
3. Name: `faith-jobs-files`
4. Click **Create**

### Update Uploads Route
Modify `routes/uploads.js`:

```javascript
// Instead of Multer local storage, use Supabase Storage
const supabase = require('@supabase/supabase-js');

const supabaseClient = supabase.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Then use: await supabaseClient.storage.from('faith-jobs-files').upload(...)
```

---

## Production Deployment with Supabase

### 1. Upgrade Supabase Plan (if needed)
- Free tier: Perfect for testing
- Pro tier: For production (~$25/month)
- Custom: For large scale

### 2. Set Secure Environment Variables
```
NODE_ENV=production
DATABASE_URL=[prod_supabase_url]
JWT_SECRET=[strong_random_key]
```

### 3. Enable Row Level Security (RLS)
In Supabase:
1. Go to **SQL Editor**
2. Enable RLS on tables
3. Create policies for users

### 4. Set up Backups
- Supabase auto-backups (included)
- Enable point-in-time recovery (Pro plan)

### 5. Monitor Performance
- Use Supabase dashboard metrics
- Check slow queries
- Optimize indexes if needed

---

## Next Steps

1. ✅ Create Supabase account
2. ✅ Get connection string
3. ✅ Create .env file
4. ✅ Initialize database
5. ✅ Start backend server
6. ✅ Start frontend server
7. ✅ Test with sample accounts
8. ✅ Customize & deploy

---

## Helpful Links

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **FaithJobs README**: ../README.md

---

## Support

Need help?
1. Check Supabase docs
2. Check FaithJobs README.md
3. Review this guide
4. Check `.env.example`

---

**You're all set!** Your FaithJobs app is now connected to Supabase! 🎉
