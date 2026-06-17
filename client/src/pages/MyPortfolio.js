import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    qualification: '',
  });
  const currentUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/profiles/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setPortfolio(response.data);
      setFormData({
        bio: response.data?.bio || '',
        skills: response.data?.skills || '',
        experience: response.data?.experience || '',
        qualification: response.data?.qualification || '',
      });
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/profiles/${currentUserId}/update`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setEditing(false);
      await fetchPortfolio();
      alert('Portfolio updated successfully!');
    } catch (err) {
      setError('Failed to update portfolio');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      padding: '2rem 1rem',
    },
    wrapper: {
      maxWidth: '900px',
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
    profileCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '2rem',
      marginBottom: '2rem',
    },
    profileHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '2rem',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem',
    },
    profileRole: {
      fontSize: '1rem',
      color: '#2563eb',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    profileStats: {
      display: 'flex',
      gap: '2rem',
      marginTop: '1rem',
    },
    statItem: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2563eb',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    editButton: {
      background: '#2563eb',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    sectionCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '1rem',
    },
    sectionContent: {
      color: '#374151',
      lineHeight: '1.6',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#374151',
      fontWeight: '600',
      marginBottom: '0.5rem',
      fontSize: '0.95rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      minHeight: '120px',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    button: {
      flex: 1,
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
      fontSize: '1rem',
    },
    submitButton: {
      background: '#16a34a',
      color: 'white',
    },
    cancelButton: {
      background: '#e5e7eb',
      color: '#374151',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    errorBox: {
      background: '#fecaca',
      border: '1px solid #f87171',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Portfolio</h1>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>{portfolio?.user_name || 'Your Name'}</h2>
              <p style={styles.profileRole}>{portfolio?.job_category || 'Professional'}</p>
              <div style={styles.profileStats}>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>{portfolio?.total_followers || 0}</div>
                  <div style={styles.statLabel}>Followers</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>{portfolio?.star_rating || 0}</div>
                  <div style={styles.statLabel}>Rating</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>{portfolio?.years_experience || 0}</div>
                  <div style={styles.statLabel}>Years Exp.</div>
                </div>
              </div>
            </div>
            <button
              style={{...styles.editButton}}
              onClick={() => setEditing(!editing)}
              onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.background = '#2563eb'}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {portfolio?.bio && !editing && (
            <p style={{ color: '#374151', lineHeight: '1.6' }}>{portfolio.bio}</p>
          )}
        </div>

        {!editing ? (
          <>
            {/* Bio Section */}
            {portfolio?.bio && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>About</h3>
                <p style={styles.sectionContent}>{portfolio.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            {portfolio?.skills && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Skills</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {portfolio.skills.split(',').map((skill, idx) => (
                    <span key={idx} style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {portfolio?.experience && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Experience</h3>
                <p style={styles.sectionContent}>{portfolio.experience}</p>
              </div>
            )}

            {/* Qualification Section */}
            {portfolio?.qualification && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Qualifications</h3>
                <p style={styles.sectionContent}>{portfolio.qualification}</p>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Edit Portfolio</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Teaching, Communication, Leadership"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your work experience..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Qualifications</label>
              <textarea
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="List your educational qualifications..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={{...styles.button, ...styles.submitButton}}
                onMouseEnter={(e) => e.target.style.background = '#15803d'}
                onMouseLeave={(e) => e.target.style.background = '#16a34a'}
              >
                Save Changes
              </button>
              <button
                type="button"
                style={{...styles.button, ...styles.cancelButton}}
                onClick={() => setEditing(false)}
                onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.background = '#e5e7eb'}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
