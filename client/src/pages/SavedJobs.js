import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const currentUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/jobs/saved/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedJobs(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/saved/${jobId}/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Job removed from saved');
      await fetchSavedJobs();
    } catch (err) {
      alert('Failed to remove job');
    }
  };

  const applyJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/apply/${jobId}/${currentUserId}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Application submitted!');
      await fetchSavedJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      padding: '2rem 1rem',
      paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
    },
    wrapper: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.5rem',
    },
    controlBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    sortSelect: {
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      cursor: 'pointer',
      background: 'white',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem',
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '4px solid #dbeafe',
      borderTop: '4px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem',
    },
    errorBox: {
      background: '#fecaca',
      border: '1px solid #f87171',
      color: '#991b1b',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      marginBottom: '2rem',
    },
    jobCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1rem',
      borderLeft: '4px solid #16a34a',
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '1rem',
      gap: '1rem',
    },
    jobTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.5rem',
    },
    jobCompany: {
      fontSize: '0.95rem',
      color: '#2563eb',
      fontWeight: '600',
      marginBottom: '0.75rem',
    },
    jobMeta: {
      display: 'flex',
      gap: '1.5rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem',
      flexWrap: 'wrap',
    },
    jobBadge: {
      display: 'inline-block',
      background: '#dbeafe',
      color: '#1e40af',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    jobDescription: {
      color: '#374151',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      marginBottom: '1rem',
      maxHeight: '100px',
      overflow: 'hidden',
    },
    jobActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    button: {
      padding: '0.625rem 1.25rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
    },
    applyButton: {
      background: '#2563eb',
      color: 'white',
      flex: 1,
    },
    removeButton: {
      background: '#f3f4f6',
      color: '#ef4444',
      border: '1px solid #ef4444',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    emptyStateText: {
      fontSize: '1.125rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
    },
  };

  const sortedJobs = [...savedJobs].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.saved_at) - new Date(a.saved_at);
    } else if (sortBy === 'alphabetical') {
      return (a.job_title || '').localeCompare(b.job_title || '');
    }
    return 0;
  });

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Saved Jobs</h1>
          <p style={{ color: '#6b7280' }}>Jobs you've bookmarked for later</p>
        </div>

        {/* Control Bar */}
        <div style={styles.controlBar}>
          <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="recent">Recently Saved</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#6b7280' }}>Loading saved jobs...</p>
          </div>
        ) : sortedJobs.length > 0 ? (
          <div>
            {sortedJobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{job.job_title}</h3>
                    <p style={styles.jobCompany}>{job.institution_name || 'Unknown Institution'}</p>
                  </div>
                  <span style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}>
                    💾 {job.saved_at ? new Date(job.saved_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>

                <div style={styles.jobMeta}>
                  <span style={styles.jobBadge}>📍 {job.location || 'Nigeria'}</span>
                  <span style={styles.jobBadge}>💼 {job.employment_type || 'Full-time'}</span>
                  <span style={styles.jobBadge}>🎓 {job.education_level || 'Any'}</span>
                </div>

                <p style={styles.jobDescription}>
                  {job.description || job.job_description || 'No description provided'}
                </p>

                <div style={styles.jobActions}>
                  <button
                    style={{...styles.button, ...styles.applyButton}}
                    onClick={() => applyJob(job.id)}
                    onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                  >
                    Apply Now
                  </button>
                  <button
                    style={{...styles.button, ...styles.removeButton}}
                    onClick={() => removeJob(job.id)}
                    onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                    onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>💾</div>
            <p style={styles.emptyStateText}>No saved jobs yet</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Save jobs while browsing to find them here later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
