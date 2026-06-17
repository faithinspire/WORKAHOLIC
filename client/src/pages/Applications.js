import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/applications/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Application withdrawn');
      await fetchApplications();
    } catch (err) {
      alert('Failed to withdraw application');
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
    appCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      gap: '1rem',
    },
    appInfo: {
      flex: 1,
    },
    appTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.5rem',
    },
    appCompany: {
      fontSize: '0.95rem',
      color: '#2563eb',
      fontWeight: '600',
      marginBottom: '0.75rem',
    },
    appMeta: {
      display: 'flex',
      gap: '1.5rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.75rem',
      flexWrap: 'wrap',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.375rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    pendingStatus: {
      background: '#fef3c7',
      color: '#92400e',
    },
    acceptedStatus: {
      background: '#dcfce7',
      color: '#166534',
    },
    rejectedStatus: {
      background: '#fee2e2',
      color: '#991b1b',
    },
    withdrawButton: {
      background: '#ef4444',
      color: 'white',
      padding: '0.625rem 1rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
      fontSize: '0.875rem',
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
    },
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return styles.acceptedStatus;
      case 'rejected':
        return styles.rejectedStatus;
      default:
        return styles.pendingStatus;
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status?.toLowerCase() === filter.toLowerCase());

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
          <h1 style={styles.title}>My Applications</h1>
          <p style={{ color: '#6b7280' }}>Track all your job applications</p>
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
            All ({applications.length})
          </button>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'pending' ? '#2563eb' : '#e5e7eb',
              color: filter === 'pending' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'accepted' ? '#2563eb' : '#e5e7eb',
              color: filter === 'accepted' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            style={{
              ...styles.filterButton,
              background: filter === 'rejected' ? '#2563eb' : '#e5e7eb',
              color: filter === 'rejected' ? 'white' : '#374151',
            }}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>

        {/* Error Message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#6b7280' }}>Loading applications...</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div>
            {filteredApplications.map((app) => (
              <div key={app.id} style={styles.appCard}>
                <div style={styles.appInfo}>
                  <h3 style={styles.appTitle}>{app.job_title}</h3>
                  <p style={styles.appCompany}>{app.institution_name}</p>
                  <div style={styles.appMeta}>
                    <span>📅 Applied: {new Date(app.applied_date).toLocaleDateString()}</span>
                    <span>
                      <span style={{...styles.statusBadge, ...getStatusStyle(app.status)}}>
                        {app.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </span>
                  </div>
                </div>
                {app.status?.toLowerCase() === 'pending' && (
                  <button
                    style={styles.withdrawButton}
                    onClick={() => withdrawApplication(app.id)}
                    onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📝</div>
            <p style={styles.emptyStateText}>No applications yet</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Start applying to jobs to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
