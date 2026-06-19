const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialize Supabase
const supabaseServer = require('./utils/supabaseServer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Cache control middleware - disable caching for HTML
app.use((req, res, next) => {
  if (req.url.endsWith('.html') || req.url === '/') {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (FIRST - no dependencies)
app.get('/api/health', (req, res) => {
  const dbStatus = supabaseServer.getConnectionStatus();
  res.json({ 
    status: 'FaithJobs API is running', 
    timestamp: new Date(),
    database: dbStatus.connected ? 'connected' : 'disconnected',
    supabaseStatus: dbStatus
  });
});

// Supabase connection status endpoint
app.get('/api/supabase-status', (req, res) => {
  const status = supabaseServer.getConnectionStatus();
  res.json({
    connected: status.connected,
    lastChecked: status.lastChecked,
    error: status.error,
    timestamp: new Date()
  });
});

// Home route with cache control
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API test endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'FaithJobs API - Welcome', 
    backend: 'Running',
    frontend: 'Static files served',
    endpoints: ['/api/health', '/api/auth/login']
  });
});

// Try to load routes - wrap in try-catch
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✓ Auth routes loaded');
} catch (err) {
  console.error('✗ Error loading auth routes:', err.message);
}

try {
  const jobSeekerRoutes = require('./routes/jobSeeker');
  app.use('/api/jobseekers', jobSeekerRoutes);
  console.log('✓ Job Seeker routes loaded');
} catch (err) {
  console.error('✗ Error loading jobseeker routes:', err.message);
}

try {
  const recruiterRoutes = require('./routes/recruiter');
  app.use('/api/recruiters', recruiterRoutes);
  console.log('✓ Recruiter routes loaded');
} catch (err) {
  console.error('✗ Error loading recruiter routes:', err.message);
}

try {
  const jobRoutes = require('./routes/jobs');
  app.use('/api/jobs', jobRoutes);
  console.log('✓ Jobs routes loaded');
} catch (err) {
  console.error('✗ Error loading jobs routes:', err.message);
}

try {
  const uploadRoutes = require('./routes/uploads');
  app.use('/api/uploads', uploadRoutes);
  console.log('✓ Upload routes loaded');
} catch (err) {
  console.error('✗ Error loading upload routes:', err.message);
}

try {
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✓ Admin routes loaded');
} catch (err) {
  console.error('✗ Error loading admin routes:', err.message);
}

try {
  const feedRoutes = require('./routes/feeds');
  app.use('/api/feeds', feedRoutes);
  console.log('✓ Feed routes loaded');
} catch (err) {
  console.error('✗ Error loading feed routes:', err.message);
}

try {
  const newsRoutes = require('./routes/news');
  app.use('/api/news', newsRoutes);
  console.log('✓ News routes loaded');
} catch (err) {
  console.error('✗ Error loading news routes:', err.message);
}

try {
  const externalNewsRoutes = require('./routes/external-news');
  app.use('/api/external-news', externalNewsRoutes);
  console.log('✓ External News routes loaded');
} catch (err) {
  console.error('✗ Error loading external news routes:', err.message);
}

try {
  const messagesRoutes = require('./routes/messages');
  app.use('/api/messages', messagesRoutes);
  console.log('✓ Messages routes loaded');
} catch (err) {
  console.error('✗ Error loading messages routes:', err.message);
}

try {
  const settingsRoutes = require('./routes/settings');
  app.use('/api/settings', settingsRoutes);
  console.log('✓ Settings routes loaded');
} catch (err) {
  console.error('✗ Error loading settings routes:', err.message);
}

try {
  const feedRoutes = require('./routes/feed');
  app.use('/api/feed', feedRoutes);
  console.log('✓ Feed (user posts) routes loaded');
} catch (err) {
  console.error('✗ Error loading feed routes:', err.message);
}

try {
  const paymentRoutes = require('./routes/payment');
  app.use('/api/payment', paymentRoutes);
  console.log('✓ Payment routes loaded');
} catch (err) {
  console.error('✗ Error loading payment routes:', err.message);
}

try {
  const notificationRoutes = require('./routes/notifications');
  app.use('/api/notifications', notificationRoutes);
  console.log('✓ Notifications routes loaded');
} catch (err) {
  console.error('✗ Error loading notifications routes:', err.message);
}

try {
  const profileRoutes = require('./routes/profiles');
  app.use('/api/profiles', profileRoutes);
  console.log('✓ Profiles routes loaded');
} catch (err) {
  console.error('✗ Error loading profiles routes:', err.message);
}

try {
  const dashboardRoutes = require('./routes/dashboard-routes');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✓ Dashboard routes loaded');
} catch (err) {
  console.error('✗ Error loading dashboard routes:', err.message);
}

try {
  const jobsSeoRoutes = require('./routes/jobs-seo');
  app.use('/api/jobs-seo', jobsSeoRoutes);
  console.log('✓ Jobs SEO routes loaded');
} catch (err) {
  console.error('✗ Error loading jobs-seo routes:', err.message);
}

try {
  const jobsLandingRoutes = require('./routes/jobs-landing');
  app.use('/api/jobs-landing', jobsLandingRoutes);
  console.log('✓ Jobs landing routes loaded');
} catch (err) {
  console.error('✗ Error loading jobs-landing routes:', err.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  // Ensure port is a number
  const numPort = parseInt(port, 10);
  
  // Validate port range
  if (numPort < 1 || numPort > 65535) {
    console.error('Port out of valid range. Using default 5000');
    return startServer(5000);
  }

  const server = app.listen(numPort, () => {
    console.log(`\n✅ Server running on port ${numPort}`);
    console.log(`📍 http://localhost:${numPort}`);
    console.log(`🌐 Frontend: http://localhost:${numPort}`);
    console.log(`🏥 Health check: http://localhost:${numPort}/api/health\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = numPort + 1;
      if (nextPort > 65535) {
        console.error('No available ports');
        process.exit(1);
      }
      console.log(`⚠️  Port ${numPort} is in use, trying ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

