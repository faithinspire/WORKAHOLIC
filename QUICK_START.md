# FaithJobs - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+ installed
- npm installed
- Port 5000 and 3000 available

---

## Step 1: Install Dependencies (2 minutes)

### Backend
```bash
# From root directory
npm install
```

### Frontend
```bash
# From another terminal
cd client
npm install
```

---

## Step 2: Start Backend Server (1 minute)

```bash
# From root directory
npm start
```

**Expected Output**:
```
✅ Server running on port 5000
📍 http://localhost:5000
🏥 Health check: http://localhost:5000/api/health
```

---

## Step 3: Start Frontend Server (1 minute)

```bash
# From client directory
cd client
npm start
```

**Expected Output**:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## Step 4: Test the App (1 minute)

### Browser
1. Open `http://localhost:3000`
2. You should see the FaithJobs home page
3. Click "Job Seeker" or "Recruiter" to sign up
4. After signup, you'll have access to:
   - 🔍 **Jobs** - Job board with filtering
   - 📢 **Community** - Social feed
   - 💬 **Messages** - Messaging system
   - 📋 **Portfolio** - User portfolio
   - 👤 **Dashboard** - Personal dashboard

### Verify Backend
Open in browser: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "FaithJobs API is running",
  "timestamp": "2024-06-17T12:00:00.000Z"
}
```

---

## 📱 Test on Different Devices

### Mobile (Browser DevTools)
1. Press `F12` to open DevTools
2. Click device toggle (Ctrl+Shift+M)
3. Select different devices:
   - iPhone 12/13
   - Samsung Galaxy S21
   - iPad Air

### Features to Test
- [x] Mobile hamburger menu appears
- [x] Menu items clickable
- [x] Pages load correctly
- [x] No horizontal scroll
- [x] Buttons are touch-friendly

---

## 🆕 New Features to Try

### Portfolio Page
1. Login or sign up
2. Click "📋 Portfolio" in navbar
3. View your profile showcase
4. Click on another user to see their portfolio

### Messages
1. Click "💬 Messages" in navbar
2. See conversation list (empty on first login)
3. Create new message by clicking message icon on a profile

### Community Feed
1. Click "📢 Community" in navbar
2. Write a post in the text area
3. Like and comment on posts from others

### Job Board
1. Click "🔍 Jobs" in navbar
2. Use filters to search:
   - Filter by State
   - Filter by Education Level
   - Filter by Subject
3. Click "Apply" on a job

---

## 🔍 Verify All Components

### Check Pages Load
- [x] Home page: http://localhost:3000/
- [x] Login: http://localhost:3000/login
- [x] Job Board: http://localhost:3000/jobs
- [x] Portfolio: http://localhost:3000/portfolio
- [x] Messages: http://localhost:3000/messages
- [x] Community: http://localhost:3000/feeds

### Check Backend Endpoints
```bash
# Test each endpoint (use Postman or curl)

# Health check
http://localhost:5000/api/health

# Auth test
POST http://localhost:5000/api/auth/login
Body: {"email": "test@example.com", "password": "test"}

# Jobs test
http://localhost:5000/api/jobs/list

# Messages test
http://localhost:5000/api/messages/inbox/1
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
# Windows: taskkill /F /IM node.exe
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Not Loading
```bash
# Clear browser cache
# Windows: Ctrl+Shift+Delete
# Mac: Cmd+Shift+Delete

# Or hard reload
# Windows: Ctrl+Shift+R
# Mac: Cmd+Shift+R
```

### API Not Working
1. Check backend is running: `http://localhost:5000/api/health`
2. Check browser console for errors (F12)
3. Check terminal for backend errors
4. Restart backend: `npm start`

---

## 📊 What Works Out of the Box

### ✅ Authentication
- Sign up as Job Seeker or Recruiter
- Login with email/password
- Session persistence
- Role-based access

### ✅ Job Seekers
- Create profile
- Search jobs
- Apply for jobs
- View applications
- Upload documents
- Manage experience

### ✅ Recruiters
- Create company profile
- Post jobs
- Search candidates
- Manage candidates
- Subscription tracking

### ✅ Social Features
- Community feed
- Like/comment on posts
- Direct messaging
- User profiles
- Portfolio showcase

### ✅ Responsive Design
- Mobile-first approach
- Tablet-optimized
- Desktop-enhanced
- Touch-friendly
- No horizontal scroll

---

## 🔐 Security Notes

### Default JWT Secret
Current `.env` has a default JWT secret. For production:
```bash
JWT_SECRET=your-secure-secret-key-here
```

### Database Credentials
Supabase credentials are in `.env`. Change before production deployment.

### API Security
- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- CORS enabled for localhost
- Input validation on all forms

---

## 📈 Next Steps

### For Development
1. Create test accounts
2. Add sample data
3. Test all features
4. Customize styling

### For Deployment
1. Update environment variables
2. Setup production database
3. Configure HTTPS
4. Deploy backend
5. Deploy frontend

---

## 🎓 Learning Resources

### Frontend Stack
- React: UI components
- React Router: Page routing
- Axios: API calls
- Tailwind CSS: Styling

### Backend Stack
- Express.js: Web server
- PostgreSQL: Database (via Supabase)
- JWT: Authentication
- Bcrypt: Password hashing

### Database
- Supabase: PostgreSQL managed database
- 15 tables pre-configured
- REST API available

---

## 📞 Support

### Common Issues
1. **Pages show "Coming Soon"** → Routes added, refresh page
2. **Mobile menu not showing** → Clear cache and refresh
3. **API not responding** → Check backend is running
4. **Database errors** → Check Supabase connection

### Debug Mode
Enable console logging:
```javascript
// In browser console
localStorage.debug = 'app:*'
```

---

## ✨ Key Features Implemented

| Feature | Status | How to Access |
|---------|--------|--------------|
| 3 New Pages | ✅ Done | See navbar after login |
| Mobile Menu | ✅ Done | Click hamburger on mobile |
| Responsive Design | ✅ Done | Resize browser to test |
| Messaging | ✅ Done | Click 💬 Messages |
| Community Feed | ✅ Done | Click 📢 Community |
| Portfolio | ✅ Done | Click 📋 Portfolio |
| Job Board | ✅ Done | Click 🔍 Jobs |
| Supabase | ✅ Configured | Connected in backend |

---

## 🎯 Your Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Homepage loads in browser
- [ ] Can sign up as Job Seeker
- [ ] Can sign up as Recruiter
- [ ] Can login with created account
- [ ] Can see all navbar items after login
- [ ] Can navigate to Jobs page
- [ ] Can navigate to Portfolio page
- [ ] Can navigate to Messages page
- [ ] Can navigate to Community page
- [ ] Mobile view works (resize or use DevTools)
- [ ] All pages are responsive
- [ ] Backend health check works

---

## 🚀 You're All Set!

Everything is configured and ready to use. The app includes:
- ✅ 3 new missing pages
- ✅ Fully responsive design (mobile/tablet/desktop)
- ✅ Enhanced navigation with mobile menu
- ✅ All backend APIs integrated
- ✅ Supabase ready to use
- ✅ Real-time features (messaging, community)

**Start exploring and building!**

---

**Last Updated**: June 17, 2024
**Status**: ✅ READY FOR USE
