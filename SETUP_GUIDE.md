# FaithJobs Setup Guide - Step by Step

## Quick Start (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

### Step 2: Configure Database

**Option A: Using PostgreSQL locally**

1. Install PostgreSQL if not already installed
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. Create database:
```bash
createdb faithjobs
```

3. Run schema:
```bash
psql faithjobs < database/schema.sql
```

4. Seed data:
```bash
node database/seed.js
```

**Option B: Using Railway/Cloud Database**
- Update `.env` with cloud database credentials

### Step 3: Configure Environment

Create `.env` file in root directory:
```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=faithjobs
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Cloudinary (optional - for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Paystack (optional - for payments)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
npm start
# or with auto-reload
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Testing the Application

### Create Test Accounts

1. **Job Seeker Account**
   - Go to http://localhost:3000
   - Click "Job Seeker" signup
   - Fill in:
     - Name: John Teacher
     - Email: john@example.com
     - Phone: 08012345678
     - State: Lagos
     - LGA: Alimosho
     - Level: Secondary School Teacher
     - Subject: Mathematics
     - Employment: Full-time
     - Experience: 2 years
   - Click Register

2. **Recruiter Account**
   - Click "Recruiter" signup
   - Fill in:
     - Name: Jane Recruit
     - Email: jane@example.com
     - Phone: 08087654321
     - Institution: Lagos State University
     - Type: University
     - State: Lagos
     - LGA: Lagos Mainland
     - Plan: Basic
   - Click Register

### Test Workflows

**Job Seeker Flow:**
1. Login with job seeker account
2. Go to "My Dashboard"
3. View profile and star rating (should be 1 initially)
4. Go to "Jobs" and browse opportunities
5. Click "Apply" on a job

**Recruiter Flow:**
1. Login with recruiter account
2. Go to "My Dashboard"
3. See "5 Scans Remaining" (Basic plan)
4. Use filters to find job seekers
5. Click "Search" to see candidates
6. Go to "Post Job" and create a vacancy

## Database Schema Details

### Jobs Table
```sql
jobs(
  id, 
  recruiter_id, 
  title, 
  description, 
  education_level,
  subject, 
  location_state, 
  location_lga, 
  employment_type, 
  salary, 
  created_at
)
```

### Job Seekers Table
```sql
jobseekers(
  id,
  user_id,
  fullname,
  phone,
  state,
  lga,
  education_level,
  subject,
  employment_type,
  years_experience,
  star_rating (1-5),
  profile_image_url,
  created_at
)
```

### Recruiters Table
```sql
recruiters(
  id,
  user_id,
  fullname,
  company_name,
  institution_type,
  university_id/polytechnic_id,
  state,
  lga,
  proof_url,
  subscription_type (basic/premium),
  scans_remaining,
  subscription_expiry,
  created_at
)
```

## Common Issues & Solutions

### Issue: "Cannot find module 'pg'"
**Solution:**
```bash
npm install pg
npm install bcryptjs jsonwebtoken multer cors
```

### Issue: Database connection refused
**Solution:**
1. Check if PostgreSQL is running
2. Verify DB credentials in .env
3. Ensure database exists: `createdb faithjobs`

### Issue: Frontend can't reach backend
**Solution:**
1. Ensure backend is running on port 5000
2. Check CORS configuration
3. Frontend URL should match CORS whitelist

### Issue: Port 3000 or 5000 already in use
**Solution - Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution - Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

## Uploading Files

The application uses local file storage in `uploads/` directory.

**To use Cloudinary instead:**
1. Sign up at https://cloudinary.com
2. Get API credentials
3. Update .env with CLOUDINARY_ variables
4. Uncomment Cloudinary code in upload routes

## Payment Integration

**Current**: Mock payment (no real charges)

**To integrate Paystack:**
1. Sign up at https://paystack.com
2. Get API keys
3. Update .env with PAYSTACK_ variables
4. Update `/api/recruiters/upgrade-premium` endpoint
5. Implement frontend payment flow

## Adding States/LGAs/Universities

Edit `config/data.js` to add more entries.

**After editing, reseed database:**
```bash
node database/seed.js
```

## Creating Admin User

```bash
node -e "
const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('admin123', salt);
  
  await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
    ['admin@faithjobs.com', password, 'admin']
  );
  
  console.log('Admin created: admin@faithjobs.com / admin123');
  process.exit(0);
}

createAdmin();
"
```

## API Documentation

See full documentation in `API_DOCS.md` (create this file with all endpoint details)

## Performance Tips

1. **Add Indexes** - Already included in schema.sql
2. **Enable CORS Caching** - Configure based on your domain
3. **Implement Rate Limiting** - Use express-rate-limit middleware
4. **Use Connection Pooling** - pg connection pool is configured
5. **Optimize Database Queries** - Use SELECT specific columns

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Implement rate limiting
- [ ] Validate all user input
- [ ] Sanitize database queries (already using parameterized)
- [ ] Use HTTPS for database connections

## Deployment Checklist

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create faithjobs-backend

# Set environment variables
heroku config:set JWT_SECRET=your_strong_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment (Vercel)
```bash
npm install -g vercel

cd client
vercel
```

## Support

For issues:
1. Check error messages in browser console
2. Check backend logs: `npm run dev`
3. Verify database connection
4. Check network tab in browser DevTools
5. Review README.md for common issues

## Next Steps

1. ✅ Complete setup
2. ✅ Test with sample accounts
3. ✅ Customize branding/colors
4. ✅ Add more states/universities
5. ✅ Implement real payment
6. ✅ Deploy to production
7. ✅ Monitor and optimize
8. ✅ Gather user feedback
