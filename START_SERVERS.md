# 🚀 Starting FaithJobs with Supabase

## Quick Start (Choose One Option)

### Option 1: Using Supabase (RECOMMENDED)

#### Step 1: Set Up Supabase
1. Go to https://supabase.com and create account
2. Create new project
3. Copy your **Connection String** from Settings > Database
4. Should look like: `postgresql://postgres:[password]@[host].supabase.co:5432/postgres`

#### Step 2: Update .env File
Edit `.env` in project root:
```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST].supabase.co:5432/postgres
JWT_SECRET=faithjobs_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

#### Step 3: Initialize Supabase Database
```bash
# Run this to create all tables in Supabase
node init.js
```

#### Step 4: Start Both Servers

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
npm --prefix client install
npm --prefix client start
```

---

### Option 2: Using Local PostgreSQL

#### Step 1: Install PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt install postgresql`

#### Step 2: Create Local Database
```bash
createdb faithjobs
```

#### Step 3: .env Configuration
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/faithjobs
JWT_SECRET=faithjobs_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
```

#### Step 4: Initialize Database
```bash
node init.js
```

#### Step 5: Start Servers
**Terminal 1:**
```bash
npm start
```

**Terminal 2:**
```bash
npm --prefix client install
npm --prefix client start
```

---

## What Each Server Does

### Backend Server (Port 5000)
- Express.js API server
- Handles user authentication
- Manages database queries
- Serves API endpoints

**Start with:** `npm start`

### Frontend Server (Port 3000)
- React development server
- User interface
- Connects to backend at localhost:5000

**Start with:** `npm --prefix client start`

---

## 🎯 Expected Output

### Backend Should Show:
```
Server running on port 5000
```

### Frontend Should Show:
```
Compiled successfully!

You can now view faithjobs in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://[YOUR_IP]:3000
```

---

## 🔐 Test the Application

### Access Frontend
Open browser to: `http://localhost:3000`

### Login with Test Accounts
**Job Seeker:**
- Email: `teacher@example.com`
- Password: `teacher123`

**Recruiter:**
- Email: `recruiter@example.com`  
- Password: `recruiter123`

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue: "Database connection refused"
**Check:**
1. Is database URL correct in .env?
2. Is Supabase project initialized?
3. Is PostgreSQL running (local)?
4. Is firewall blocking connection?

### Issue: "Port 3000 already in use"
**Solution - Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**Solution - Mac/Linux:**
```bash
lsof -i :3000
kill -9 [PID]
```

### Issue: "React scripts not found"
**Solution:**
```bash
npm --prefix client install
```

### Issue: Blank page or 404
**Check:**
1. Is backend running on port 5000?
2. Check browser console (F12)
3. Check backend logs

---

## 📊 Verify Everything is Working

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"FaithJobs API is running"}
```

### Check Database Connection
Backend logs should show successful connection.

---

## 🚀 Next Steps

1. ✅ Start both servers (follow Option 1 or 2 above)
2. ✅ Open http://localhost:3000
3. ✅ Login with test credentials
4. ✅ Explore features
5. ✅ Create new accounts
6. ✅ Test job seeker and recruiter flows

---

## 📝 File Structure for Reference

```
faithjobs/
├── server.js              ← Backend entry point
├── package.json           ← Backend dependencies
├── .env                   ← Your configuration (created)
├── config/                ← Database & data config
├── routes/                ← API endpoints
├── database/              ← Schema & seed scripts
└── client/
    ├── package.json       ← Frontend dependencies
    ├── src/
    │   ├── App.js         ← Main React component
    │   ├── pages/         ← Page components
    │   └── components/    ← Reusable components
    └── public/
        └── index.html     ← HTML template
```

---

## 🎓 Understanding the Flow

```
User Browser (http://localhost:3000)
         ↓
    React Frontend (Port 3000)
         ↓
    API Calls (Axios)
         ↓
    Express Backend (Port 5000)
         ↓
    PostgreSQL Database (Supabase or Local)
```

---

## 🆘 Need Help?

1. **Setup issues?** → See SUPABASE_SETUP.md
2. **Code questions?** → See README.md
3. **Architecture?** → See ARCHITECTURE.md
4. **Quick reference?** → See QUICK_REFERENCE.md

---

## ✅ Checklist Before Starting

- [ ] .env file created with DATABASE_URL
- [ ] Database connection tested (local or Supabase)
- [ ] `npm install` completed
- [ ] `npm --prefix client install` completed
- [ ] `node init.js` executed successfully
- [ ] Two terminal windows ready
- [ ] Port 3000 and 5000 are free

---

**Ready to go!** Follow the steps above and you'll have FaithJobs running in minutes. 🎉
