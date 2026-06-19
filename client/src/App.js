import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignupJobSeeker from './pages/SignupJobSeeker';
import SignupRecruiter from './pages/SignupRecruiter';
import Login from './pages/Login';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobBoard from './pages/JobBoard';
import PostJob from './pages/PostJob';
import Portfolio from './pages/Portfolio';
import Messages from './pages/Messages';
import Feeds from './pages/Feeds';
import JobMatches from './pages/JobMatches';
import MyPortfolio from './pages/MyPortfolio';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import JobDetail from './pages/JobDetail';
import ApplicationSuccess from './pages/ApplicationSuccess';
import ProgrammaticLandingPage from './pages/ProgrammaticLandingPage';
import { supabaseHelpers } from './utils/supabaseClient';

function App() {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Test Supabase connection on app load
    const checkConnection = async () => {
      try {
        const isConnected = await supabaseHelpers.testConnection();
        setSupabaseConnected(isConnected);
        if (isConnected) {
          console.log('✅ App initialized with Supabase connected');
        } else {
          setConnectionError('Failed to connect to Supabase');
        }
      } catch (err) {
        console.error('Connection check error:', err);
        setConnectionError(err.message);
      }
    };

    checkConnection();
  }, []);

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #ff6b35, #ff8c42, #ffa366, #f7931e, #ff6b35)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}>
        {/* Connection Status Banner */}
        {!supabaseConnected && (
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
          }}>
            <p style={{ fontSize: '0.9rem' }}>
              ⚠️ Database Status: {connectionError || 'Connecting...'}
            </p>
          </div>
        )}
        
        {supabaseConnected && (
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            padding: '0.8rem',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}>
            ✅ Connected to Supabase
          </div>
        )}
        
        <Navbar />
        
        <div style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup/jobseeker" element={<SignupJobSeeker />} />
            <Route path="/signup/recruiter" element={<SignupRecruiter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/portfolio/:userId?" element={<Portfolio />} />
            <Route path="/messages/:userId?" element={<Messages />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/job-matches" element={<JobMatches />} />
            <Route path="/my-portfolio" element={<MyPortfolio />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            
            {/* SEO & Virality Routes */}
            <Route path="/jobs/:slug" element={<JobDetail />} />
            <Route path="/jobs/id/:id" element={<JobDetail />} />
            <Route path="/application-success/:applicationId" element={<ApplicationSuccess />} />
            <Route path="/jobs/:role" element={<ProgrammaticLandingPage />} />
            <Route path="/jobs/:role/:location" element={<ProgrammaticLandingPage />} />
            <Route path="/locations/:location" element={<ProgrammaticLandingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
