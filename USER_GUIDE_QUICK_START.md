# WORKAHOLIC - Quick Start Guide

## 🎯 WHAT'S WORKING NOW

### 1. Account Creation (Signup)
✅ **FULLY FUNCTIONAL** - Create account in seconds

**Steps:**
1. Go to http://localhost:5001
2. Click "Sign Up" button in navbar
3. Select your role:
   - 👨‍🏫 **I'm a Teacher** - If you're a teaching professional
   - 🏢 **I'm a Recruiter** - If you're hiring teachers
4. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number
   - Password (min 6 characters)
5. Complete role-specific fields:
   - **Teachers**: Education Level, Subject, Teaching Type, Years of Experience, State
   - **Recruiters**: Institution Name, Institution Type, State
6. Click "Create Account"
7. You'll be logged in automatically and see your dashboard

### 2. Login
✅ **FULLY FUNCTIONAL** - Login with your email and password

**Steps:**
1. Click "Login" button in navbar
2. Enter your email address
3. Enter your password
4. Click "Login"
5. You'll see your personalized dashboard

### 3. News & Updates
✅ **FULLY FUNCTIONAL** - Latest news displayed on homepage

**Features:**
- 📰 **5 News Articles** displayed on homepage
- 🔄 **Auto-refresh** - Updates every 1 hour automatically
- 📍 **Location**: Scroll to bottom of homepage to see "General News & Updates"
- 📚 **Categories**: Jobs, Tech, Opportunities, Education
- 🔗 **External Links**: Click articles to read full stories

**What You'll See:**
- Latest teaching job opportunities
- Tech industry hiring news
- NYSC registration updates
- University recruitment drives
- Freelancing opportunities

### 4. Admin Dashboard
✅ **FULLY FUNCTIONAL** - Admin access

**Login Credentials:**
- Email: `admin@workaholic.com`
- Password: `Admin123456`

**URL**: http://localhost:5001/admin.html

**Features Available:**
- Dashboard statistics
- User management
- Job postings
- Responsive on mobile and desktop

---

## 📱 RESPONSIVE DESIGN

All pages are optimized for:
- ✅ **Desktop** (1920px and above)
- ✅ **Tablet** (768px - 1024px)
- ✅ **Mobile** (Under 768px)

The app automatically adjusts layouts for your device:
- Sidebar → Bottom navigation on mobile
- Full width forms on desktop → Stacked on mobile
- Responsive grid for news cards and job listings

---

## 🔍 TESTING CHECKLIST

### ✅ Signup Form
- [ ] Click "Sign Up" button
- [ ] Form opens smoothly
- [ ] Can select role (Teacher/Recruiter)
- [ ] Role-specific fields appear/disappear
- [ ] Form is readable on mobile
- [ ] Can submit successfully
- [ ] Redirected to dashboard after signup

### ✅ News Section
- [ ] Scroll to bottom of homepage
- [ ] See "General News & Updates" section
- [ ] At least 3 news articles display
- [ ] Articles have: Title, Description, Source, Date
- [ ] Articles are responsive (cards stack on mobile)
- [ ] Can see multiple categories

### ✅ Login
- [ ] Click "Login" button
- [ ] Form appears
- [ ] Can enter email and password
- [ ] Successfully login with created account
- [ ] See personalized dashboard

### ✅ Admin Panel
- [ ] Go to http://localhost:5001/admin.html
- [ ] Login with provided credentials
- [ ] See dashboard statistics
- [ ] Dashboard is responsive on mobile

---

## 🔧 TROUBLESHOOTING

### News Not Showing?
1. **Check browser console**: Press F12 to open Developer Tools
2. **Refresh the page**: Press Ctrl+R (or Cmd+R on Mac)
3. **Clear cache**: 
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Edge: Ctrl+Shift+Delete
4. **Check API**: Visit http://localhost:5001/api/news/all in your browser
   - Should see JSON with 5 news articles

### Signup Not Working?
1. **Check server**: Is it running? (Terminal should show "Server running on port 5001")
2. **Check email**: Make sure email address is valid format
3. **Check password**: Must be at least 6 characters
4. **Check console**: Look for error messages in browser console (F12)
5. **Test API directly**:
   ```bash
   curl -X POST http://localhost:5001/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123456","fullname":"Test","phone":"0801234567","role":"jobseeker"}'
   ```

### Form Not Responsive on Mobile?
1. Make sure viewport meta tag is present (it is)
2. Open Developer Tools (F12)
3. Click "Toggle device toolbar" (mobile view)
4. Refresh the page
5. Form should adapt to screen size

### Can't Login After Signup?
1. **Check browser console** for errors
2. **Verify credentials**: Same email and password you used
3. **Check localStorage**: 
   - Open Developer Tools (F12)
   - Go to Application tab
   - Check if "user" data is stored
4. **Try signup again** with different email

---

## 📊 ARCHITECTURE OVERVIEW

```
Browser (Frontend)
    ↓
HTML/CSS/JavaScript Pages
    ↓
API Endpoints (Port 5001)
    ↓
Node.js Express Server
    ↓
Database (PostgreSQL via Supabase)
└── Fallback: In-Memory Storage (when database offline)
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login to account |
| GET | `/api/news/all` | Fetch all news |
| POST | `/api/news/refresh` | Manually refresh news |
| GET | `/api/news/status` | Check news refresh status |
| GET | `/api/health` | Server health check |

---

## 🎯 KEY FEATURES IMPLEMENTED

### ✅ Account Management
- User signup with role selection
- User login with JWT authentication
- In-memory user storage (fallback)
- Password hashing with bcrypt
- JWT token generation

### ✅ News System
- Fetches 5 news articles
- Auto-refresh every 1 hour
- Manual refresh endpoint
- Sample data fallback
- Responsive card layout

### ✅ Admin Panel
- Admin login
- Dashboard statistics
- Responsive design
- Mobile-friendly navigation

### ✅ Authentication
- Login form modal
- Signup form modal
- JWT tokens
- Session management via localStorage

### ✅ Responsive Design
- Mobile-first approach
- Media queries for all breakpoints
- Flexible layouts
- Touch-friendly buttons

---

## 💡 NEXT FEATURES (Coming Soon)

- Job posting by recruiters
- Job applications by teachers
- Teacher profiles
- Search and filter jobs
- Messaging system
- Payment integration
- Rating system

---

## 📞 SUPPORT

If you encounter any issues:
1. Check the browser console (F12)
2. Check the terminal running the server
3. Try clearing cache and refreshing
4. Verify server is running on port 5001
5. Check that all API endpoints respond (use curl tests)

---

**Last Updated**: June 16, 2026  
**System Status**: ✅ All Core Features Working
