import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const currentUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobMatches();
  }, []);

  const fetchJobMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs/matches', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMatches(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load job matches');
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/apply/${jobId}/${currentUserId}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Application submitted successfully!');
      fetchJobMatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  const saveJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/save/${jobId}/${currentUserId}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Job saved successfully!');
      fetchJobMatches();
    } catch (err) {
      alert('Failed to save job');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      padding: '2rem 1rem',
    },
    wrapper: {
      maxWidth: '1200px',
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
    subtitle: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    filterBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
      fontSize: '0.875rem',
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
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
    },
    jobCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      transition: 'all 0.2s',
      borderLeft: '4px solid #2563eb',
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
      marginBottom: '1rem',
    },
    jobMeta: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem',
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
      maxHeight: '80px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    jobActions: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
    },
    button: {
      flex: 1,
      padding: '0.625rem 1rem',
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
    },
    saveButton: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 1rem',
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

  const filteredMatches = filter === 'all' ? matches : matches.filter(job => job.status === filter);

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
          <h1 style={styles.title}>Job Matches</h1>
          <p style={styles.subtitle}>Find jobs tailored to your profile</p>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'all' ? '#2563eb' : '#e5e7eb',
              color: filter === 'all' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('all')}
          >
            All Matches ({matches.length})
          </button>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'applied' ? '#2563eb' : '#e5e7eb',
              color: filter === 'applied' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('applied')}
          >
            Applied
          </button>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'saved' ? '#2563eb' : '#e5e7eb',
              color: filter === 'saved' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('saved')}
          >
            Saved
          </button>
        </div>

        {/* Error Message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#6b7280' }}>Loading job matches...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div style={styles.gridContainer}>
            {filteredMatches.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <h3 style={styles.jobTitle}>{job.job_title}</h3>
                <p style={styles.jobCompany}>{job.institution_name || 'Unknown Institution'}</p>

                <div style={styles.jobMeta}>
                  <span style={styles.jobBadge}>📍 {job.location || 'Nigeria'}</span>
                  <span style={styles.jobBadge}>💼 {job.employment_type || 'Full-time'}</span>
                </div>

                <p style={styles.jobDescription}>{job.description || job.job_description}</p>

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
                    style={{...styles.button, ...styles.saveButton}}
                    onClick={() => saveJob(job.id)}
                    onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
                    onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🔍</div>
            <p style={styles.emptyStateText}>No job matches found</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Complete your profile to get better job recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
