import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Mobile bottom navbar
  if (isMobile && isAuthenticated) {
    const bottomNavStyle = {
      container: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#f0f9ff',
        borderTop: '1px solid #e5e7eb',
        zIndex: 40,
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.5rem',
        padding: '0.5rem',
        maxWidth: '100%',
      },
      navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 0',
        fontSize: '0.65rem',
        fontWeight: '600',
        textDecoration: 'none',
        color: '#6b7280',
        transition: 'all 0.2s',
        borderRadius: '0.375rem',
      },
      navItemActive: {
        color: '#2563eb',
        background: '#dbeafe',
      },
      icon: {
        fontSize: '1.25rem',
        marginBottom: '0.25rem',
      },
    };

    const isActive = (path) => location.pathname === path;

    return (
      <>
        {/* Top navbar - minimal on mobile */}
        <nav style={{
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
            ✝️ FaithJobs
          </Link>
          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            {userRole ? `${userRole.charAt(0).toUpperCase()}` : 'A'}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div style={bottomNavStyle.container}>
          <div style={bottomNavStyle.grid}>
            {userRole === 'jobseeker' ? (
              <>
                <Link
                  to="/job-matches"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/job-matches') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>💼</div>
                  <span>Matches</span>
                </Link>
                <Link
                  to="/applications"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/applications') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>📋</div>
                  <span>Apps</span>
                </Link>
                <Link
                  to="/my-portfolio"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/my-portfolio') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>👤</div>
                  <span>Profile</span>
                </Link>
                <Link
                  to="/feeds"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/feeds') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>📢</div>
                  <span>Feed</span>
                </Link>
                <Link
                  to="/messages"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/messages') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>💬</div>
                  <span>Chat</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/jobs') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>🔍</div>
                  <span>Browse</span>
                </Link>
                <Link
                  to="/post-job"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/post-job') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>📝</div>
                  <span>Post</span>
                </Link>
                <Link
                  to="/feeds"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/feeds') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>📢</div>
                  <span>Feed</span>
                </Link>
                <Link
                  to="/messages"
                  style={{
                    ...bottomNavStyle.navItem,
                    ...(isActive('/messages') ? bottomNavStyle.navItemActive : {}),
                  }}
                >
                  <div style={bottomNavStyle.icon}>💬</div>
                  <span>Chat</span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    ...bottomNavStyle.navItem,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                  }}
                >
                  <div style={bottomNavStyle.icon}>🚪</div>
                  <span>Exit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Add padding to body to account for bottom navbar */}
        <div style={{ paddingBottom: '6rem' }} />
      </>
    );
  }

  // Desktop navbar
  return (
    <nav style={{
      background: 'linear-gradient(to right, #2563eb, #4f46e5)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          to="/"
          style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          ✝️ <span>FaithJobs</span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Login
              </Link>
              <Link
                to="/signup/jobseeker"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Job Seeker
              </Link>
              <Link
                to="/signup/recruiter"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Recruiter
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/job-matches"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                💼 Matches
              </Link>
              <Link
                to="/jobs"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                🔍 Jobs
              </Link>
              <Link
                to="/feeds"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                📢 Feed
              </Link>
              <Link
                to="/messages"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                💬 Messages
              </Link>
              <Link
                to="/my-portfolio"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                👤 Profile
              </Link>
              {userRole === 'recruiter' && (
                <Link
                  to="/post-job"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  📝 Post Job
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  fontWeight: '600',
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
