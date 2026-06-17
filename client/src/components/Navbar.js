import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          ✝️ <span className="hidden sm:inline">FaithJobs</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded transition">Login</Link>
              <Link to="/signup/jobseeker" className="hover:bg-blue-700 px-3 py-2 rounded transition">Job Seeker</Link>
              <Link to="/signup/recruiter" className="hover:bg-blue-700 px-3 py-2 rounded transition">Recruiter</Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className="hover:bg-blue-700 px-3 py-2 rounded transition">🔍 Jobs</Link>
              <Link to="/feeds" className="hover:bg-blue-700 px-3 py-2 rounded transition">📢 Community</Link>
              <Link to="/messages" className="hover:bg-blue-700 px-3 py-2 rounded transition">💬 Messages</Link>
              <Link to="/portfolio" className="hover:bg-blue-700 px-3 py-2 rounded transition">📋 Portfolio</Link>
              {userRole === 'jobseeker' && (
                <Link to="/dashboard/jobseeker" className="hover:bg-blue-700 px-3 py-2 rounded transition">👤 Dashboard</Link>
              )}
              {userRole === 'recruiter' && (
                <>
                  <Link to="/dashboard/recruiter" className="hover:bg-blue-700 px-3 py-2 rounded transition">👤 Dashboard</Link>
                  <Link to="/post-job" className="hover:bg-blue-700 px-3 py-2 rounded transition">📝 Post Job</Link>
                </>
              )}
              <button 
                onClick={handleLogout} 
                className="hover:bg-red-600 px-3 py-2 rounded transition font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-gray-200 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500">
          <div className="px-4 py-3 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block hover:bg-blue-600 px-3 py-2 rounded transition">Login</Link>
                <Link to="/signup/jobseeker" className="block hover:bg-blue-600 px-3 py-2 rounded transition">Job Seeker</Link>
                <Link to="/signup/recruiter" className="block hover:bg-blue-600 px-3 py-2 rounded transition">Recruiter</Link>
              </>
            ) : (
              <>
                <Link to="/jobs" className="block hover:bg-blue-600 px-3 py-2 rounded transition">🔍 Jobs</Link>
                <Link to="/feeds" className="block hover:bg-blue-600 px-3 py-2 rounded transition">📢 Community</Link>
                <Link to="/messages" className="block hover:bg-blue-600 px-3 py-2 rounded transition">💬 Messages</Link>
                <Link to="/portfolio" className="block hover:bg-blue-600 px-3 py-2 rounded transition">📋 Portfolio</Link>
                {userRole === 'jobseeker' && (
                  <Link to="/dashboard/jobseeker" className="block hover:bg-blue-600 px-3 py-2 rounded transition">👤 Dashboard</Link>
                )}
                {userRole === 'recruiter' && (
                  <>
                    <Link to="/dashboard/recruiter" className="block hover:bg-blue-600 px-3 py-2 rounded transition">👤 Dashboard</Link>
                    <Link to="/post-job" className="block hover:bg-blue-600 px-3 py-2 rounded transition">📝 Post Job</Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-red-600 px-3 py-2 rounded transition font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
