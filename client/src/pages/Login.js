import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userName', response.data.fullname || 'User');
      
      if (response.data.role === 'jobseeker') {
        navigate('/dashboard/jobseeker');
      } else if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard/recruiter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    formContainer: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
      padding: '2rem',
      width: '100%',
      maxWidth: '400px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    logo: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    errorBox: {
      background: '#fee2e2',
      borderLeft: '4px solid #dc2626',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
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
    submitButton: {
      width: '100%',
      background: 'linear-gradient(to right, #2563eb, #4f46e5)',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '2rem',
      transition: 'opacity 0.2s',
    },
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    links: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginTop: '0.75rem',
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <div style={styles.logo}>✝️</div>
          <h1 style={styles.title}>FaithJobs</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={styles.input}
            />
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Don't have an account?</p>
          <div style={styles.links}>
            <a href="/signup/jobseeker" style={styles.link}>
              Join as Job Seeker
            </a>
            <span style={{ color: '#9ca3af' }}>or</span>
            <a href="/signup/recruiter" style={styles.link}>
              Join as Recruiter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
