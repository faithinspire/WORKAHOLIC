# FaithJobs - Fix Broken Pages & Netlify Deployment Guide

## 🚨 WHY PAGES ARE BROKEN

**ROOT CAUSE**: Tailwind CSS is not installed. Without it, all styling is missing.

---

## ✅ STEP 1: FIX BROKEN PAGES (Fix Tailwind CSS)

### A. Delete node_modules in client directory

```bash
# In PowerShell/Command Prompt
cd c:\Users\OLU\FAITHJOBS\client
rmdir /s /q node_modules
del package-lock.json
```

### B. Reinstall dependencies with Tailwind

```bash
cd c:\Users\OLU\FAITHJOBS\client
npm install
```

This will install:
- React
- React Router
- Axios
- **Tailwind CSS** ← This fixes the broken pages
- PostCSS
- Autoprefixer

### C. Start the app

```bash
# Terminal 1: Backend
cd c:\Users\OLU\FAITHJOBS
npm start

# Terminal 2: Frontend (NEW TERMINAL)
cd c:\Users\OLU\FAITHJOBS\client
npm start
```

**Expected Result**: All pages will now show with proper styling ✅

---

## 🔐 ADMIN LOGIN DETAILS

### Admin Account Setup

**Email**: `admin@faithjobs.com`
**Password**: `Admin@2024`

### How to Create Admin Account

If the admin account doesn't exist, create it:

```bash
# Run the admin creation script
node database/init-admin.js
```

### How to Login as Admin

1. Go to http://localhost:3000/login
2. Enter:
   - Email: `admin@faithjobs.com`
   - Password: `Admin@2024`
3. You'll be redirected to the admin dashboard

### Admin Features Available

- ✅ View all users (job seekers and recruiters)
- ✅ View all jobs
- ✅ View all applications
- ✅ Manage system settings
- ✅ View analytics

---

## 🔍 VERIFY SUPABASE CONNECTION

### Method 1: Check Backend Health

```bash
# Open in browser
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "FaithJobs API is running",
  "timestamp": "2024-06-17T12:00:00.000Z"
}
```

### Method 2: Check Database Connection

Open `http://localhost:5000/api/status`

Should show database connection status.

### Method 3: Test Database Operations

1. Sign up as a new user
2. Check if account is saved (login with same credentials)
3. If login works → **Supabase is connected** ✅

### Method 4: Check Supabase Console

Go to https://app.supabase.co/projects

Login with your Supabase account and check:
- ✅ Database tables exist (users, jobs, jobseekers, etc.)
- ✅ New records appear when you sign up
- ✅ Authentication is working

### How to Know if Supabase is Fully Connected

✅ **YES** if:
- Data persists after refreshing (you can login after signup)
- New users appear in Supabase console
- Job postings are saved
- Messages are stored

❌ **NO** if:
- Data disappears after refresh
- Can't login after signing up
- Using in-memory storage only

### Current Status

**Supabase Configuration**: ✅ CONFIGURED
- `.env` has credentials
- Connection pooling set up
- REST API fallback ready

**Database Connection**: ⚠️ VERIFY BY TESTING
- Sign up → Login test

---

## 🚀 DEPLOY TO NETLIFY

### Step 1: Create Netlify Account

1. Go to https://app.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (recommended)

### Step 2: Prepare Project for Netlify

#### A. Update Frontend Build Configuration

Create `.env` file in `client` directory:

```bash
cd c:\Users\OLU\FAITHJOBS\client
```

Create file `.env`:
```
REACT_APP_API_URL=https://faithjobs-backend.herokuapp.com
REACT_APP_ENV=production
```

(Replace with your actual backend URL when deployed)

#### B. Create netlify.toml in root directory

Create `c:\Users\OLU\FAITHJOBS\netlify.toml`:

```toml
[build]
command = "cd client && npm run build"
publish = "client/build"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/static/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

### Step 3: Build Frontend Locally

```bash
cd c:\Users\OLU\FAITHJOBS\client
npm run build
```

This creates a `build` folder with production files.

### Step 4: Connect GitHub Repository

1. Push your project to GitHub:
```bash
cd c:\Users\OLU\FAITHJOBS
git init
git add .
git commit -m "FaithJobs - Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/faithjobs.git
git push -u origin main
```

2. In Netlify:
   - Click "New site from Git"
   - Select "GitHub"
   - Choose your `faithjobs` repository
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`
   - Click "Deploy"

### Step 5: Deploy Backend (Heroku or Railway)

#### Option A: Deploy Backend to Heroku

```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
heroku login
heroku create faithjobs-api
git push heroku main

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set DATABASE_URL=your_database_url
heroku config:set JWT_SECRET=your_secret
```

#### Option B: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Add environment variables from `.env`
6. Deploy

### Step 6: Update Frontend with Backend URL

After deploying backend:

1. Get your backend URL (e.g., `https://faithjobs-api.herokuapp.com`)
2. Update `client/.env`:
```
REACT_APP_API_URL=https://faithjobs-api.herokuapp.com
```
3. In `client/src/pages/` and API files, update:
```javascript
// Change from:
axios.get('http://localhost:5000/api/...')

// To:
axios.get(`${process.env.REACT_APP_API_URL}/api/...`)
```

4. Rebuild and redeploy:
```bash
npm run build
git push
```

### Step 7: Verify Deployment

1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Should see home page
3. Try signing up
4. Try logging in
5. All features should work

---

## 🔧 TROUBLESHOOTING DEPLOYMENT

### Pages show "Not found" on Netlify

**Fix**: Add `netlify.toml` with redirect rules (done in Step 2B)

### API calls fail on production

**Fix**: Update all API URLs to use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.get(`${API_URL}/api/endpoint`)
```

### CORS errors

**Fix**: Backend needs CORS headers for your Netlify domain:
```javascript
app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Database connection fails

**Fix**: Verify `.env` variables on production platform (Heroku/Railway)

### Images not loading

**Fix**: Use full URLs or ensure image paths are correct in production

---

## 📋 COMPLETE DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All pages display correctly locally
- [ ] Tailwind CSS installed and working
- [ ] Admin account created
- [ ] Supabase connection verified
- [ ] All API endpoints working
- [ ] Tested signup/login flow
- [ ] GitHub repository created
- [ ] `.env` configured

### Frontend (Netlify)
- [ ] Created Netlify account
- [ ] `netlify.toml` created
- [ ] `client/.env` configured
- [ ] Connected GitHub repository
- [ ] Build command configured
- [ ] Publish directory set to `client/build`
- [ ] Site deployed successfully

### Backend (Heroku/Railway)
- [ ] Created Heroku/Railway account
- [ ] Backend app created
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Health check endpoint working

### Post-Deployment
- [ ] Frontend loads on Netlify
- [ ] Backend API responds
- [ ] Signup works
- [ ] Login works
- [ ] Data persists in Supabase
- [ ] Admin login works
- [ ] All pages fully functional

---

## 🎯 QUICK SUMMARY

### To Fix Broken Pages
```bash
cd c:\Users\OLU\FAITHJOBS\client
rmdir /s /q node_modules
npm install
npm start
```

### Admin Login
- Email: `admin@faithjobs.com`
- Password: `Admin@2024`

### Verify Supabase
- Test signup → login flow
- Check Supabase console for new records

### Deploy to Netlify
1. Create `netlify.toml`
2. Push to GitHub
3. Connect in Netlify
4. Deploy backend separately
5. Update API URL
6. Redeploy frontend

---

## 📞 SUPPORT

### Common Issues

**Pages still broken after install?**
- Delete `node_modules` again
- Run `npm cache clean --force`
- Reinstall: `npm install`

**Admin login not working?**
- Run: `node database/init-admin.js`
- Check `.env` for JWT_SECRET

**Supabase not connected?**
- Verify `.env` has credentials
- Check Supabase console for tables
- Try signup/login test

**Netlify deployment failing?**
- Check build logs in Netlify dashboard
- Verify `netlify.toml` exists
- Ensure `npm run build` works locally

---

## ✅ FINAL CHECKLIST

After completing all steps:

- ✅ Pages display with styling
- ✅ Can login as admin
- ✅ Supabase verified connected
- ✅ App deployed to Netlify
- ✅ Backend deployed to Heroku/Railway
- ✅ Everything working in production

**You're ready to launch! 🚀**
