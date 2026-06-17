# 🚀 WORKAHOLIC - GETTING STARTED GUIDE

## ACCESS THE PLATFORM

**Server**: http://localhost:5002

---

## 🌐 PLATFORM FLOW

### For Job Seekers

1. **Visit Landing Page**
   - Go to: `http://localhost:5002`
   - See: Hero section with image, news feed, community feed link

2. **Sign Up (Professional Form)**
   - Click: "Find Jobs" button
   - Fill: 20+ fields including:
     - Personal info (name, email, phone, state)
     - Professional background (experience, education)
     - Job preferences (desired job, category, salary)
     - Qualifications (certifications, skills)
     - About you (professional bio)

3. **Access Dashboard**
   - After login: Redirected to `/jobseeker-dashboard-feed.html`
   - Features:
     - Community feed (post updates, see others' posts)
     - Comments system (comment on posts)
     - View other profiles (click user names)
     - Portfolio section (upload resume, certificates)

4. **Build Your Portfolio**
   - Go to: Profile → My Portfolio
   - Upload:
     - Profile picture
     - Resume (PDF, DOC, DOCX)
     - Certificates (PDF, JPG, PNG)
   - Add:
     - Professional title
     - About you (bio)
     - Skills (comma-separated)
     - Work experience
   - Share: Profile link with recruiters

5. **Community Features**
   - Post about job search, skills, opportunities
   - Comment on other professionals' posts
   - View other users' portfolios from feed
   - Network with hiring professionals

---

### For Recruiters

1. **Sign Up**
   - Click: "Post a Job" button on landing
   - Fill: Company information
   - Redirect to: Recruiter dashboard

2. **Access Dashboard**
   - After login: `/recruiter-dashboard-feed.html`
   - See: Interest requests, job postings, company profile

3. **Manage Interest Requests**
   - Section: "Interest Requests" in sidebar
   - Shows: Job seekers interested in your jobs
   - Actions:
     - View Profile: See candidate's portfolio
     - Employ: Hire the candidate (triggers payment if needed)
     - Reject: Skip candidate

4. **Payment System** (PAYSTACK)
   - **First Hire**: FREE ✅
   - **Subsequent Hires**: ₦5,000 per hire
   
   **How it works**:
   - Click "Employ" button
   - System checks hire count
   - If 1st hire: Automatically approved (free)
   - If 2nd+ hire: Opens Paystack payment modal
   - Enter card details (Paystack handles all payments)
   - After payment: Candidate hired, subscription activated

5. **Company Profile**
   - Go to: "Company Profile" in sidebar
   - Update:
     - Company name
     - Company email
     - Company description
   - Save: Profile information

6. **Post Jobs**
   - Button: "Post New Job" (coming soon in current version)
   - Will include: Job title, description, salary, location

---

## 📱 RESPONSIVE DESIGN

**Desktop** (1200px+)
- 3-column layout
- Full sidebar visible
- Trending sidebar on right

**Tablet** (768px-1200px)
- 2-column layout
- Sidebar collapses
- Main content + sidebar only

**Mobile** (< 768px)
- 1-column layout
- Bottom navigation bar
- Full-width content
- Sidebar hidden (swipe to open)

---

## 🔑 KEY FEATURES

### For Job Seekers
✅ Professional signup form  
✅ Portfolio management  
✅ File uploads (resume, certificates)  
✅ Community feed & networking  
✅ Comment on posts  
✅ View other profiles  
✅ Professional networking  

### For Recruiters
✅ Company profile management  
✅ Interest request tracking  
✅ Candidate profile viewing  
✅ One-click hiring  
✅ Paystack payment integration  
✅ First hire free  
✅ Subscription management  

### General
✅ Responsive design (all devices)  
✅ Professional UI/UX  
✅ Real-time updates  
✅ Secure authentication  
✅ Data persistence (Supabase)  

---

## 💳 PAYSTACK TEST CREDENTIALS

To test the payment system:

1. **Test Card** (Paystack sandbox):
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)

2. **Payment Flow**:
   - Recruiter clicks "Employ" on 2nd+ candidate
   - Paystack modal opens
   - Enter test card info above
   - Click "Pay"
   - See success message

---

## 📁 FILE LOCATIONS

### Key Pages
- Landing: `/public/index.html`
- Job Seeker Signup: `/public/signup-jobseeker.html`
- Job Seeker Dashboard: `/public/jobseeker-dashboard-feed.html`
- Recruiter Signup: `/public/recruiter-signup.html`
- Recruiter Dashboard: `/public/recruiter-dashboard-feed.html`
- Portfolio: `/public/portfolio.html`
- View Profile: `/public/view-profile.html`

### Backend
- Auth: `/routes/auth.js`
- Payment: `/routes/payment.js`
- Feed: `/routes/feed.js`
- Jobs: `/routes/jobs.js`
- Profiles: `/routes/profiles.js`

### Config
- Environment: `/.env`
- Database: `/database/schema.sql`
- Supabase: `/config/supabase.js`

---

## 🛠️ TROUBLESHOOTING

**Issue**: Pages not loading or showing blank  
**Solution**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (F5)
- Check browser console for errors (F12)

**Issue**: Payment modal not opening  
**Solution**:
- Check that Paystack keys are in `.env`
- Verify internet connection
- Try different browser

**Issue**: File uploads not working  
**Solution**:
- Check file format (resume: PDF/DOC/DOCX, certificates: PDF/JPG/PNG)
- Check file size (< 10MB recommended)
- Try different file
- Check browser console for errors

**Issue**: Paystack payment error  
**Solution**:
- Use correct test card: `4111 1111 1111 1111`
- Check internet connection
- Try different card details
- Verify Paystack API key in `.env`

---

## 📞 SUPPORT

For issues or questions:
1. Check server console logs
2. Check browser console (F12)
3. Verify `.env` configuration
4. Restart server (`npm start`)

---

## ✨ QUICK START CHECKLIST

- [ ] Server running on port 5002
- [ ] Visit http://localhost:5002
- [ ] Create job seeker account
- [ ] Complete professional signup form
- [ ] Upload resume to portfolio
- [ ] View community feed
- [ ] Comment on posts
- [ ] Create recruiter account
- [ ] Test payment (2nd hire)
- [ ] Hire a candidate

---

**Ready to use! 🎉**

Last Updated: **June 17, 2026**
