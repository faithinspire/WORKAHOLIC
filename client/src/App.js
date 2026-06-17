import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
