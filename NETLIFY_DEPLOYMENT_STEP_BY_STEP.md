# Step-by-Step: Deploy FaithJobs to Netlify

## 🎯 OVERVIEW

We'll deploy:
1. **Frontend (React)** → Netlify (Free tier)
2. **Backend (Node.js)** → Heroku or Railway
3. **Database** → Supabase (Already set up)

---

## ✅ PART 1: PREPARE YOUR LOCAL PROJECT

### Step 1.1: Ensure Everything Works Locally

```bash
# Terminal 1: Start backend
cd c:\Users\OLU\FAITHJOBS
npm start

# Terminal 2: Start frontend (new terminal)
cd c:\Users\OLU\FAITHJOBS\client
npm start
```

Open `http://localhost:3000` and verify:
- ✅ Home page loads
- ✅ Can signup
- ✅ Can login
- ✅ All pages work
- ✅ Styling is correct (Tailwind CSS)

### Step 1.2: Update Client Configuration

Edit `c:\Users\OLU\FAITHJOBS\client\src\index.js`:

Add API URL configuration at the top:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set API URL for environment
window.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 1.3: Update All API Calls

In **every page file** that makes API calls, update the URL:

Example: `client/src/pages/Login.js`

Change from:
```javascript
axios.post('http://localhost:5000/api/auth/login', formData)
```

To:
```javascript
const API_URL = window.API_URL || 'http://localhost:5000';
axios.post(`${API_URL}/api/auth/login`, formData)
```

### Step 1.4: Create Environment Files

Create `c:\Users\OLU\FAITHJOBS\client\.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

### Step 1.5: Test Build Locally

```bash
cd c:\Users\OLU\FAITHJOBS\client
npm run build
```

Should complete without errors and create a `build` folder.

---

## ✅ PART 2: SETUP GITHUB REPOSITORY

### Step 2.1: Initialize Git (if not already done)

```bash
cd c:\Users\OLU\FAITHJOBS
git init
```

### Step 2.2: Create .gitignore

Create `c:\Users\OLU\FAITHJOBS\.gitignore`:

```
node_modules/
.env
.env.local
build/
client/build/
.DS_Store
npm-debug.log
*.log
```

### Step 2.3: Commit Files

```bash
cd c:\Users\OLU\FAITHJOBS
git add .
git commit -m "FaithJobs - Ready for production"
```

### Step 2.4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `faithjobs`
3. Description: `Teaching and Lecturing Job Platform`
4. Public
5. Click "Create repository"

### Step 2.5: Push to GitHub

```bash
cd c:\Users\OLU\FAITHJOBS

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/faithjobs.git

# Rename branch to main
git branch -M main

# Push
git push -u origin main
```

---

## ✅ PART 3: DEPLOY FRONTEND TO NETLIFY

### Step 3.1: Create Netlify Account

1. Go to https://app.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Netlify to access GitHub

### Step 3.2: Create New Site

1. In Netlify dashboard, click "New site from Git"
2. Choose "GitHub"
3. Search for `faithjobs` repository
4. Click it to connect

### Step 3.3: Configure Build Settings

Fill in these settings:

- **Branch to deploy**: `main`
- **Build command**: `cd client && npm run build`
- **Publish directory**: `client/build`

### Step 3.4: Add Environment Variables

1. In the Netlify settings page, BEFORE clicking "Deploy"
2. Click "Advanced" > "New variable"
3. Add:
   - Key: `REACT_APP_API_URL`
   - Value: (Leave empty for now - we'll update after backend is deployed)

### Step 3.5: Deploy

Click "Deploy site"

Wait 2-5 minutes for build to complete.

**Result**: Your frontend will be live at `https://your-site-name.netlify.app`

### Step 3.6: View Deploy Status

1. In Netlify, click "Deployments"
2. Check build logs if there are errors
3. Once green checkmark appears, frontend is live

---

## ✅ PART 4: DEPLOY BACKEND TO HEROKU

### Step 4.1: Create Heroku Account

1. Go to https://www.heroku.com
2. Click "Sign up"
3. Fill in details
4. Verify email

### Step 4.2: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

For Windows: Download and run the installer

Verify installation:
```bash
heroku --version
```

### Step 4.3: Login to Heroku

```bash
heroku login
```

Will open browser to login, then confirm in terminal.

### Step 4.4: Create Heroku App

```bash
cd c:\Users\OLU\FAITHJOBS
heroku create faithjobs-api
```

This creates a Heroku app and adds a git remote.

### Step 4.5: Add Environment Variables

```bash
heroku config:set SUPABASE_URL=https://zzpxjmmtlophkllboncl.supabase.co
heroku config:set SUPABASE_ANON_KEY=your_anon_key_here
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
heroku config:set DATABASE_URL=postgresql://postgres:...your_db_url...
heroku config:set JWT_SECRET=your_jwt_secret_here
heroku config:set PORT=5000
```

(Copy values from your `.env` file)

### Step 4.6: Create Procfile

Create `c:\Users\OLU\FAITHJOBS\Procfile`:

```
web: node server.js
```

### Step 4.7: Push to Heroku

```bash
cd c:\Users\OLU\FAITHJOBS
git push heroku main
```

Wait for deployment to complete.

### Step 4.8: Get Backend URL

Your backend URL will be shown: `https://faithjobs-api.herokuapp.com`

Test it:
```
https://faithjobs-api.herokuapp.com/api/health
```

Should return:
```json
{
  "status": "FaithJobs API is running"
}
```

---

## ✅ PART 5: CONNECT FRONTEND TO BACKEND

### Step 5.1: Update Netlify Environment Variable

1. Go to Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Build & deploy" > "Environment"
4. Click "Edit variables"
5. Update `REACT_APP_API_URL`:
   - Value: `https://faithjobs-api.herokuapp.com`

### Step 5.2: Update CORS in Backend

Edit `c:\Users\OLU\FAITHJOBS\server.js`:

Find the CORS setup and update:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site-name.netlify.app',
    'https://faithjobs-api.herokuapp.com'
  ],
  credentials: true
}));
```

### Step 5.3: Push Updates

```bash
cd c:\Users\OLU\FAITHJOBS
git add .
git commit -m "Update API URL for production"
git push heroku main
git push origin main
```

This will:
- Update Heroku backend
- Trigger Netlify frontend rebuild

Wait for both to complete.

---

## ✅ PART 6: VERIFY EVERYTHING WORKS

### Test 6.1: Frontend Loads

1. Open your Netlify site: `https://your-site-name.netlify.app`
2. Should see FaithJobs homepage

### Test 6.2: Signup Works

1. Click "Join as Job Seeker"
2. Sign up with new email
3. Should be redirected to dashboard
4. Data should save to Supabase

### Test 6.3: Login Works

1. Logout
2. Try to login with same credentials
3. Should successfully login

### Test 6.4: Pages Load

1. Click through all pages
2. All should display with proper styling
3. No broken styling

### Test 6.5: Admin Login

1. Login as admin:
   - Email: `admin@faithjobs.com`
   - Password: `Admin@2024`
2. Should see admin dashboard

### Test 6.6: Check Supabase

1. Go to https://app.supabase.co
2. Select your project
3. Click "SQL Editor"
4. Run: `SELECT * FROM users;`
5. Should see new users from production

---

## 🎯 FINAL CHECKLIST

- [ ] Frontend builds locally without errors
- [ ] Backend runs locally without errors
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Frontend deployed to Netlify
- [ ] Heroku account created
- [ ] Backend deployed to Heroku
- [ ] Environment variables set
- [ ] Frontend can communicate with backend
- [ ] Signup works on production
- [ ] Login works on production
- [ ] Data appears in Supabase
- [ ] Admin login works
- [ ] All pages display correctly

---

## 📊 YOUR PRODUCTION URLS

After deployment:

- **Frontend**: https://your-site-name.netlify.app
- **Backend**: https://faithjobs-api.herokuapp.com
- **Admin**: https://your-site-name.netlify.app/login
  - Email: `admin@faithjobs.com`
  - Password: `Admin@2024`
- **Database**: Supabase console

---

## 🚀 YOU'RE LIVE!

Your FaithJobs app is now available to everyone on the internet!

Share the link: `https://your-site-name.netlify.app`

---

## 🆘 TROUBLESHOOTING

### Frontend shows "Cannot find module"

**Fix**: 
```bash
cd client
npm install
npm run build
```

### CORS errors on production

**Fix**: Update backend CORS settings and redeploy:
```bash
git push heroku main
```

### Backend doesn't start on Heroku

**Fix**: Check logs:
```bash
heroku logs --tail
```

### Data not persisting

**Fix**: Verify `.env` variables are set on Heroku:
```bash
heroku config
```

### Netlify build fails

**Fix**: Check build logs in Netlify dashboard and fix errors locally first

---

**You're ready to go live! 🎉**
