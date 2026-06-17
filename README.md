# FaithJobs - Teaching & Lecturing Job Platform for Nigeria

A full-stack web application connecting job seekers (teachers & lecturers) with recruiters (schools, universities, polytechnics) across Nigeria's education sector.

## Features

### For Job Seekers
- Register with full profile including state/LGA selection
- Upload credentials, ID, and letters of good standing
- Star rating system (0-5 stars based on profile completion & experience)
- Track work experience history
- View and apply for teaching jobs
- Profile completeness tracking

### For Recruiters
- Register school/institution with official information
- Search for qualified job seekers using filters
- Subscription plans:
  - **Basic**: ₦5,000/month = 5 scans per month
  - **Premium**: ₦20,000/month = Unlimited scans
- Post job vacancies for free
- View applications on posted jobs
- Contact qualified candidates

### Admin Features
- Manage states, LGAs, universities, and polytechnics
- Basic analytics dashboard

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + Bcrypt
- **File Uploads**: Multer (local storage)

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL (v12+)

### Backend Setup

1. **Clone and navigate to project**
```bash
cd faithjobs
npm install
```

2. **Create `.env` file** (copy from `.env.example`)
```bash
cp .env.example .env
```

3. **Configure environment variables**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=faithjobs
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

4. **Create database and run migrations**
```bash
# Create database
createdb faithjobs

# Import schema
psql faithjobs < database/schema.sql

# Seed data
node database/seed.js
```

5. **Start backend server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
npm install
```

2. **Start development server**
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Database Schema

### Core Tables
- **users** - Base authentication (jobseeker, recruiter, admin)
- **jobseekers** - Job seeker profiles with star ratings
- **recruiters** - Recruiter/institution profiles
- **documents** - Uploaded credentials, ID, letters
- **work_experience** - Job seeker work history
- **universities** - Nigerian universities database
- **polytechnics** - Nigerian polytechnics database
- **states** - All 36 states + FCT
- **lgas** - Local Government Areas per state

### Operations Tables
- **jobs** - Job postings by recruiters
- **applications** - Job applications from seekers
- **scans** - Recruiter scan history for billing/audit

## API Endpoints

### Authentication
- `POST /api/auth/signup/jobseeker` - Register job seeker
- `POST /api/auth/signup/recruiter` - Register recruiter
- `POST /api/auth/login` - Login

### Job Seekers
- `GET /api/jobseekers/profile/:userId` - Get profile
- `PUT /api/jobseekers/profile/:userId` - Update profile
- `POST /api/jobseekers/work-experience/:userId` - Add work experience
- `POST /api/jobseekers/upload-document/:userId` - Upload document

### Recruiters
- `GET /api/recruiters/profile/:userId` - Get recruiter profile
- `POST /api/recruiters/search-jobseekers/:userId` - Search job seekers with filters
- `POST /api/recruiters/upgrade-premium/:userId` - Upgrade subscription

### Jobs
- `POST /api/jobs/create/:recruiterId` - Post new job
- `GET /api/jobs/list` - Get all jobs with filters
- `GET /api/jobs/:jobId` - Get single job
- `POST /api/jobs/apply/:jobId/:jobSeekerId` - Apply for job
- `GET /api/jobs/applications/:recruiterId` - Get applications

### Uploads
- `POST /api/uploads/upload` - Upload file (multipart/form-data)

## Star Rating System

Job seekers earn stars based on:
1. **Base**: 1 star on registration
2. **+1**: When credentials uploaded
3. **+1**: When ID uploaded  
4. **+1**: When letter from previous institution uploaded
5. **+1**: When experience >= 2 years
6. **+1**: When work history has at least 1 entry

Maximum: 5 stars

## File Structure

```
faithjobs/
├── server.js                 # Main server entry
├── package.json             # Backend dependencies
├── config/
│   ├── database.js         # DB connection
│   └── data.js             # States, LGAs, universities, polytechnics
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── jobSeeker.js        # Job seeker routes
│   ├── recruiter.js        # Recruiter routes
│   ├── jobs.js             # Job posting routes
│   └── uploads.js          # File upload routes
├── database/
│   ├── schema.sql          # PostgreSQL schema
│   └── seed.js             # Database seeding script
├── uploads/                # Uploaded files directory
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── data/           # Static data (states, LGAs, etc.)
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   └── public/             # Static files
└── README.md
```

## Authentication Flow

1. User signs up with email/password
2. Password hashed with bcrypt
3. JWT token issued on successful login
4. Token stored in localStorage on frontend
5. Token included in Authorization header for protected routes
6. Server validates JWT and user role

## Subscription & Payment

**Current Implementation**: Mock payment system
- Basic: ₦5,000/month → 5 scans allocated
- Premium: ₦20,000/month → Unlimited scans

**Future Integration**: Paystack integration for real payments

## Usage Examples

### Job Seeker Registration
```
1. Sign up at /signup/jobseeker
2. Fill multi-step form (personal, education, location)
3. Upload credentials and ID
4. View profile at /dashboard/jobseeker
5. Browse and apply for jobs at /jobs
```

### Recruiter Workflow
```
1. Sign up at /signup/recruiter
2. Select institution type and details
3. Choose subscription plan
4. Access /dashboard/recruiter
5. Use filters to search job seekers (1 scan = 5 profiles)
6. Post jobs at /post-job
7. View applications and contact candidates
```

## Future Enhancements

1. **Real Payment Integration** - Paystack/Flutterwave
2. **Messaging System** - Direct messaging between recruiters and job seekers
3. **Email Notifications** - Job alerts, application status updates
4. **Advanced Filters** - Certification requirements, specific skills
5. **Admin Dashboard** - Analytics, user management, payment verification
6. **Mobile App** - React Native version
7. **Video Profiles** - Video CV support
8. **Ratings & Reviews** - Bidirectional rating system
9. **Interview Scheduling** - Built-in calendar/scheduling
10. **Document Verification** - Automated credential verification

## Testing

```bash
# Backend tests (when implemented)
npm test

# Frontend tests
cd client
npm test
```

## Deployment

### Backend
```bash
# Build (if needed)
npm run build:backend

# Deploy to Heroku/AWS/DigitalOcean
git push heroku main
```

### Frontend
```bash
cd client
npm run build
# Deploy build/ folder to Netlify/Vercel
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Solution: Ensure PostgreSQL is running
- Linux/Mac: brew services start postgresql
- Windows: Start PostgreSQL service
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
Solution: Kill process on port 5000
- npx kill-port 5000
```

### CORS Errors
Ensure frontend URL is allowed in backend CORS configuration.

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open GitHub issue
- Email: support@faithjobs.com
- WhatsApp: +234 (XXX) XXX-XXXX

## Credits

Built with ❤️ for Nigeria's education sector

---

**Current Date**: June 2026
**Version**: 1.0.0
**Status**: Production Ready
