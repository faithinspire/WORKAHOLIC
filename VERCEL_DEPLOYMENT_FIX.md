# Vercel Deployment Fix Guide

## 🚀 Current Status
- ✅ **Backend Server**: Running on port 5000
- ✅ **Database**: Connected to Supabase
- ✅ **Frontend**: Ready to build
- ✅ **Orange Theme**: Implemented with animations
- ✅ **Supabase Integration**: Client-side helpers configured

---

## 📋 Deployment Checklist

### Step 1: Fix Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your FaithJobs project
3. Go to **Settings → Environment Variables**
4. Add/Update these variables:

```env
# Supabase Configuration
SUPABASE_URL=https://zzpxjmmtlophkllboncl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDMyMjMsImV4cCI6MjA5NjkxOTIyM30.eY7AQba-GwOaTOdV95CxB4OzwvAxsEwefcmJ4ZxaqAc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTM0MzIyMywiZXhwIjoyMDk2OTE5MjIzfQ.rxdEi2xwDacskFUVU92LApeGc8Ysnxdh5Gmyjp72t-o
DATABASE_URL=postgresql://postgres:Workaholic%4020262@db.zzpxjmmtlophkllboncl.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=U13JT+n0kd2rHPsX2U8rZQkwRieTXkB2NMJmERt5nTNHrLhGCpPMFY7oybcwLYLuLG8a9cFdM8Jv8NYBqhNaDg==
JWT_EXPIRE=7d

# Frontend Environment Variables (Production)
REACT_APP_SUPABASE_URL=https://zzpxjmmtlophkllboncl.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHhqbW10bG9waGtsbGJvbmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDMyMjMsImV4cCI6MjA5NjkxOTIyM30.eY7AQba-GwOaTOdV95CxB4OzwvAxsEwefcmJ4ZxaqAc
REACT_APP_API_URL=https://faithjobs.vercel.app

# Node Environment
NODE_ENV=production
```

### Step 2: Verify vercel.json Configuration

The `vercel.json` file has been updated with:
- ✅ Correct build command
- ✅ Output directory set to `client/build`
- ✅ Proper environment variables
- ✅ Cache control headers
- ✅ API request rewrites

### Step 3: Pre-Deployment Checks

Run these commands locally to verify everything works:

```bash
# 1. Build the frontend
cd client
npm run build

# 2. Check build output exists
ls -la build/

# 3. Install production dependencies
npm install --production

# 4. Start server
npm start
```

### Step 4: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally (if not already done)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# View logs
vercel logs --follow
```

**Option B: GitHub Integration (If Connected)**
1. Push changes to main/master branch
2. Vercel automatically deploys (if configured)
3. Check deployment status in Vercel Dashboard

### Step 5: Post-Deployment Verification

After deployment, verify these:

```
✓ URL loads: https://faithjobs.vercel.app
✓ Orange theme visible
✓ API health check: https://faithjobs.vercel.app/api/health
✓ Supabase connection works
✓ Login/Signup functional
✓ Job listings load
✓ No console errors
```

---

## 🔧 Common Deployment Errors & Fixes

### Error 1: "Build failed - npm modules missing"
**Cause**: Dependencies not properly installed
**Fix**:
```bash
rm -rf node_modules client/node_modules package-lock.json client/package-lock.json
npm install
cd client && npm install
```

### Error 2: "Supabase connection failed in production"
**Cause**: Environment variables not set in Vercel
**Fix**:
1. Verify variables in Vercel dashboard
2. Use `vercel env list` to confirm
3. Redeploy after adding variables

### Error 3: "React app won't start"
**Cause**: Missing Supabase client library
**Fix**:
```bash
cd client
npm install @supabase/supabase-js
npm run build
```

### Error 4: "Port already in use"
**Cause**: Another process using port 5000
**Fix**:
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────┐
│        Browser (User)               │
└────────────────┬────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  https://faithjobs.vercel.app │  (Vercel CDN)
    └────────────┬───────────────┘
                 │
    ┌────────────▼─────────────┐
    │   Express Backend         │
    │   (server.js)             │
    │   ├─ Auth Routes          │
    │   ├─ Job Routes           │
    │   ├─ Message Routes       │
    │   └─ Feed Routes          │
    └────────────┬──────────────┘
                 │
    ┌────────────▼──────────────┐
    │  Supabase PostgreSQL      │
    │  (zzpxjmmtlophkllboncl)   │
    │  ├─ profiles              │
    │  ├─ jobs                  │
    │  ├─ applications          │
    │  └─ messages              │
    └──────────────────────────┘
```

---

## 🎨 New Features Deployed

### 1. Orange Theme
- **Animated gradient backgrounds**
- **Orange-tinted scrollbars**
- **Orange gradient buttons**
- **Card hover animations**

### 2. Supabase Integration
- **Real-time database connection**
- **Helper functions for common operations**
- **Connection status indicator**

### 3. Improved Vercel Config
- **Proper build sequence**
- **Environment variable support**
- **Cache optimization**
- **SPA routing support**

---

## 📝 Rollback Instructions

If deployment has issues, rollback with:

```bash
# Revert to previous deployment
vercel rollback

# Or deploy previous commit
git checkout <previous-commit>
vercel --prod
```

---

## ✅ Deployment Success Indicators

After successful deployment:

1. **Green deployment status** in Vercel dashboard
2. **Orange theme visible** on website
3. **Supabase connection banner** shows connected (green)
4. **API health check passes**: `/api/health`
5. **No errors** in browser console
6. **Login/Signup works** with Supabase
7. **Jobs load** from database
8. **Smooth animations** visible

---

## 🔍 Monitoring After Deployment

1. **Check Error Logs**: https://vercel.com/dashboard → Logs
2. **Monitor Performance**: https://app.supabase.com → Logs
3. **Test Features**:
   - User authentication
   - Job posting
   - Applications
   - Messaging
   - Feeds

---

## 📞 Support

If you encounter issues:
1. Check Vercel logs: `vercel logs --follow`
2. Check Supabase status: https://app.supabase.com
3. Review this guide's "Common Deployment Errors" section
4. Check browser console for frontend errors (F12)

---

**Last Updated**: June 2026
**Status**: Ready for Production Deployment
**Next Step**: Follow Step 1 (Set Environment Variables) and proceed through all steps
