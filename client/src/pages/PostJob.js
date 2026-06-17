import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, subjects } from '../data/data';

export default function PostJob() {
  const [lgas, setLgas] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    educationLevel: '',
    subject: '',
    locationState: '',
    locationLga: '',
    employmentType: '',
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (formData.locationState) {
      setLgas(statesAndLGAs[formData.locationState] || []);
    }
  }, [formData.locationState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/jobs/create/${userId}`, formData);
      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        educationLevel: '',
        subject: '',
        locationState: '',
        locationLga: '',
        employmentType: '',
        salary: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '2rem 1rem',
    },
    maxWidth: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    card: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
      padding: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1.5rem',
    },
    successBox: {
      background: '#dcfce7',
      borderLeft: '4px solid #16a34a',
      color: '#15803d',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    },
    errorBox: {
      background: '#fee2e2',
      borderLeft: '4px solid #dc2626',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#374151',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
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
      minHeight: '150px',
      resize: 'vertical',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(to right, #16a34a, #10b981)',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1.5rem',
      transition: 'opacity 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 Post a New Job</h1>
          <p style={styles.subtitle}>Create an opportunity for talented teachers</p>

          {success && (
            <div style={styles.successBox}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div style={styles.errorBox}>
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics Teacher"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Job description, requirements, and responsibilities..."
                style={styles.textarea}
              ></textarea>
            </div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Level</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>State *</label>
                <select
                  name="locationState"
                  value={formData.locationState}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndLGAs).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>LGA</label>
                <select
                  name="locationLga"
                  value={formData.locationLga}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select LGA</option>
                  {lgas.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Employment Type *</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Salary (Optional)</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., ₦50,000 - ₦100,000"
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Posting Job...' : '✓ Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
