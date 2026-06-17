import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, subjects } from '../data/data';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    state: '',
    educationLevel: '',
    subject: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters.state) {
      setLgas(statesAndLGAs[filters.state] || []);
    }
  }, [filters.state]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/list', { params: filters });
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyJob = async (jobId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`http://localhost:5000/api/jobs/apply/${jobId}/${userId}`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '2rem 1rem',
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '2rem',
    },
    filterSection: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    filterTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#111827',
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
    },
    button: {
      background: '#2563eb',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    jobsList: {
      display: 'grid',
      gap: '1rem',
    },
    jobCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '2rem',
      alignItems: 'start',
    },
    jobTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.25rem',
    },
    company: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    jobDescription: {
      fontSize: '0.875rem',
      color: '#374151',
      marginTop: '0.5rem',
    },
    tags: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
      flexWrap: 'wrap',
    },
    tag: {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
    },
    salary: {
      marginTop: '0.5rem',
      fontWeight: 'bold',
      color: '#059669',
    },
    applyButton: {
      background: '#16a34a',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      height: 'fit-content',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem',
      background: 'white',
      borderRadius: '0.5rem',
    },
    spinner: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      borderTop: '4px solid #2563eb',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>🔍 Teaching Jobs</h1>

        {/* Filters */}
        <div style={styles.filterSection}>
          <h3 style={styles.filterTitle}>Filter Jobs</h3>
          <div style={styles.filterGrid}>
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              style={styles.input}
            >
              <option value="">All States</option>
              {Object.keys(statesAndLGAs).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              name="educationLevel"
              value={filters.educationLevel}
              onChange={handleFilterChange}
              style={styles.input}
            >
              <option value="">All Levels</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="University">University</option>
            </select>

            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              style={styles.input}
            >
              <option value="">All Subjects</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          <button onClick={fetchJobs} style={styles.button}>
            Apply Filters
          </button>
        </div>

        {/* Jobs List */}
        <div style={styles.jobsList}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={{ color: '#6b7280' }}>Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <div key={idx} style={styles.jobCard}>
                <div>
                  <div style={styles.jobTitle}>{job.title}</div>
                  <div style={styles.company}>🏢 {job.company_name}</div>
                  <div style={styles.jobDescription}>{job.description}</div>
                  
                  <div style={styles.tags}>
                    <span style={{...styles.tag, background: '#dbeafe', color: '#1e40af'}}>
                      📚 {job.education_level}
                    </span>
                    <span style={{...styles.tag, background: '#dcfce7', color: '#15803d'}}>
                      💼 {job.employment_type}
                    </span>
                    <span style={{...styles.tag, background: '#fef3c7', color: '#b45309'}}>
                      📍 {job.location_state}
                    </span>
                  </div>
                  
                  {job.salary && (
                    <div style={styles.salary}>💰 Salary: {job.salary}</div>
                  )}
                </div>
                
                <button
                  onClick={() => applyJob(job.id)}
                  style={styles.applyButton}
                >
                  ✓ Apply
                </button>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔍</p>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                No jobs found
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Try adjusting your filters to see more opportunities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
