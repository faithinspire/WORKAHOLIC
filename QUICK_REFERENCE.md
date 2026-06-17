# FaithJobs Quick Reference Card

## 🚀 Start Application (2 Commands)

### Terminal 1 - Backend
```bash
npm start
```
Runs on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd client && npm start
```
Runs on `http://localhost:3000`

---

## 🔑 Sample Login Credentials

### Job Seeker
```
Email: teacher@example.com
Pass: teacher123
```

### Recruiter
```
Email: recruiter@example.com
Pass: recruiter123
```

---

## 📍 Key URLs

| Page | URL | Access |
|------|-----|--------|
| Home | / | Public |
| Job Seeker Signup | /signup/jobseeker | Public |
| Recruiter Signup | /signup/recruiter | Public |
| Login | /login | Public |
| Job Board | /jobs | Public |
| Job Seeker Dashboard | /dashboard/jobseeker | Auth Required |
| Recruiter Dashboard | /dashboard/recruiter | Auth Required |
| Post Job | /post-job | Recruiter Only |
| API Health | http://localhost:5000/api/health | Public |

---

## 🎯 User Workflows

### For Job Seekers
1. Sign up at `/signup/jobseeker`
2. Select education level & subject
3. Upload documents/ID to boost star rating
4. Go to `/jobs` and apply for positions
5. View applications in `/dashboard/jobseeker`

### For Recruiters
1. Sign up at `/signup/recruiter`
2. Choose Basic or Premium plan
3. Go to `/dashboard/recruiter` to search candidates
4. Post jobs at `/post-job`
5. View applicants in dashboard

---

## 📊 Star Rating Breakdown

| Achievement | Stars |
|-------------|-------|
| Just signed up | 1 ⭐ |
| + Upload credentials | 2 ⭐ |
| + Upload ID | 3 ⭐ |
| + Upload letter | 4 ⭐ |
| + 2+ years exp OR work history | 5 ⭐ |

---

## 💰 Pricing Model

| Plan | Price | Scans | Best For |
|------|-------|-------|----------|
| Basic | ₦5,000/mo | 5/month | Trying out |
| Premium | ₦20,000/mo | ∞ | Active recruiting |

---

## 🗄️ Database Connection

```javascript
// PostgreSQL
Host: localhost
Port: 5432
Database: faithjobs
User: postgres
Password: (from .env)
```

---

## 🔐 Authentication

- **Method**: JWT Tokens
- **Storage**: localStorage (frontend)
- **Header**: `Authorization: Bearer <token>`
- **Expiry**: 7 days (configurable)

---

## 📂 Important Files

```
.env                    # Configuration
config/data.js          # States, LGAs, universities
database/schema.sql     # Database structure
init.js                 # Setup script
routes/                 # API endpoints
client/src/             # React components
```

---

## 🧪 Quick Testing

### Create Test Job Seeker
1. Go to `/signup/jobseeker`
2. Email: `test@example.com`
3. Password: `test123`
4. Fill multi-step form
5. Submit

### Create Test Recruiter
1. Go to `/signup/recruiter`
2. Email: `recruiter@example.com`
3. Choose Basic Plan
4. Submit

### Test Search
1. Login as recruiter
2. Go to Dashboard
3. Select filters (State, Level, etc.)
4. Click "Search"

---

## 📞 Common Commands

```bash
# Initialize database
node init.js

# Start backend
npm start

# Start frontend (from client directory)
npm start

# Stop all servers
Ctrl + C (in each terminal)

# Reset database
dropdb faithjobs
createdb faithjobs
node init.js
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000/5000 in use | `npx kill-port 3000` |
| DB connection error | Check PostgreSQL is running |
| Module not found | `npm install` |
| CORS error | Check backend CORS config |
| Can't login | Verify credentials in init.js output |

---

## 🎨 Customization Quick Tips

### Change Colors
- File: `client/src/index.css`
- Colors: Update Tailwind classes

### Add More States/LGAs
- File: `config/data.js`
- Then run: `node init.js`

### Modify Subscription Prices
- File: `routes/auth.js`
- Find: `subscriptionType === 'premium'`

### Change JWT Expiry
- File: `.env`
- Update: `JWT_EXPIRE=7d`

---

## 📈 Performance Tips

- ✅ Database indexes already configured
- ✅ Connection pooling enabled
- ✅ Pagination ready (modify routes to add)
- ✅ Gzip compression (enable in production)

---

## 🔒 Security Checklist

- [ ] `.env` file not committed to git
- [ ] JWT_SECRET changed from default
- [ ] Database password secured
- [ ] CORS restricted to trusted domains
- [ ] Input validation on all forms
- [ ] HTTPS enabled (production)

---

## 📚 File Structure at Glance

```
Backend           Frontend
─────────        ─────────
server.js        App.js
routes/          pages/
config/          components/
database/        data/
middleware/      public/
```

---

## 🚀 Deployment Steps

1. Set production environment variables
2. Build frontend: `cd client && npm run build`
3. Deploy backend to Heroku/AWS
4. Deploy frontend build to Vercel/Netlify
5. Update API endpoints in frontend
6. Test all features
7. Monitor logs

---

## 📞 Support

- **Issues?** Check SETUP_GUIDE.md
- **Features?** See PROJECT_SUMMARY.md
- **API Docs?** Check README.md
- **Code?** Read inline comments

---

## ✨ Quick Features Reference

| Feature | Status | Where |
|---------|--------|-------|
| Multi-step signup | ✅ | SignupJobSeeker.js |
| Star ratings | ✅ | jobSeeker.js route |
| Search with filters | ✅ | RecruiterDashboard.js |
| File uploads | ✅ | uploads.js route |
| Job posting | ✅ | PostJob.js |
| Applications | ✅ | JobBoard.js |
| Subscriptions | ✅ | recruiter.js route |
| Authentication | ✅ | auth.js route |

---

## 🎯 Next Steps

1. ✅ Install & setup: `node init.js`
2. ✅ Start services: `npm start` & `cd client && npm start`
3. ✅ Login with sample accounts
4. ✅ Test job seeker flow
5. ✅ Test recruiter flow
6. ✅ Post a job & apply
7. ✅ Customize and deploy

---

**Last Updated**: June 2026 | **Version**: 1.0.0 | **Status**: Ready for Production ✅
