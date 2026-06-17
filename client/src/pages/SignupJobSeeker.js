import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, subjects } from '../data/data';
import { useNavigate } from 'react-router-dom';

export default function SignupJobSeeker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    phone: '',
    state: '',
    lga: '',
    educationLevel: '',
    subject: '',
    employmentType: '',
    yearsExperience: 0,
    bio: '',
    profileImage: null,
  });
  const [lgas, setLgas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.state) {
      setLgas(statesAndLGAs[formData.state] || []);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullname) {
      setError('Please fill all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      // Step 1: Create user account
      const signupResponse = await axios.post('http://localhost:5000/api/auth/signup/jobseeker', {
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        phone: formData.phone,
        role: 'jobseeker'
      });

      const userId = signupResponse.data.userId;
      const token = signupResponse.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', 'jobseeker');
      localStorage.setItem('userName', formData.fullname);

      // Step 2: Auto-create portfolio from signup data
      const portfolioData = {
        user_id: userId,
        user_name: formData.fullname,
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
        job_category: formData.subject || 'teaching',
        bio: formData.bio,
      };

      await axios.post('http://localhost:5000/api/profiles/create', portfolioData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Redirect to dashboard
      navigate('/dashboard/jobseeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
      maxWidth: '500px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
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
      marginBottom: '1rem',
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    },
    stepDot: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '1rem',
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
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      backgroundColor: 'white',
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    backButton: {
      flex: 1,
      background: '#9ca3af',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    nextButton: {
      flex: 1,
      background: '#2563eb',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(to right, #16a34a, #15803d)',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      marginTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>FaithJobs</h1>
          <p style={styles.subtitle}>Job Seeker Registration</p>
        </div>

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          <div style={{
            ...styles.stepDot,
            background: step >= 1 ? '#2563eb' : '#d1d5db',
          }}>1</div>
          <div style={{
            ...styles.stepDot,
            background: step >= 2 ? '#2563eb' : '#d1d5db',
          }}>2</div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
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
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
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

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>
            </>
          )}

          {/* Step 2: Location & Education */}
          {step === 2 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>State of Origin *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndLGAs).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Local Government Area *</label>
                <select
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select LGA</option>
                  {lgas.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select Level</option>
                  <option value="Primary">Primary School Teacher</option>
                  <option value="Secondary">Secondary School Teacher</option>
                  <option value="Polytechnic">Polytechnic Lecturer</option>
                  <option value="University">University Lecturer</option>
                </select>
              </div>

              {(formData.educationLevel === 'Secondary' || formData.educationLevel === 'Primary') && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={styles.select}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Employment Type *</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
                />
              </div>
            </>
          )}

          <div style={styles.buttonContainer}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                onMouseEnter={(e) => e.target.style.background = '#6b7280'}
                onMouseLeave={(e) => e.target.style.background = '#9ca3af'}
                style={styles.backButton}
              >
                Back
              </button>
            )}
            {step < 2 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                style={styles.nextButton}
              >
                Next →
              </button>
            )}
            {step === 2 && (
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.9')}
                onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '⏳ Registering...' : '✓ Register'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
