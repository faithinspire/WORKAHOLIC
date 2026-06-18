/**
 * Job Detail Page
 * Displays detailed job information with full SEO optimization
 * Route: /jobs/:slug or /jobs/:id
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SEOHead from '../components/SEOHead';

export default function JobDetail() {
  const { slug, id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMenu, setShareMenu] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchJob();
  }, [slug, id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const endpoint = slug
        ? `http://localhost:5000/api/jobs/by-slug/${slug}`
        : `http://localhost:5000/api/jobs/${id}`;

      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setJob(response.data);
      setError('');

      // Track view
      trackJobView(response.data.id);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const trackJobView = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/track-view`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const applyJob = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/jobs/${job.id}/apply`,
        { jobseeker_id: currentUserId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 201) {
        // Redirect to success page
        window.location.href = `/application-success/${response.data.application_id}`;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  const shareJob = async (platform) => {
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${job.id}/share`,
        { platform, jobseeker_id: currentUserId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      // Get sharing templates from backend
      const templates = await axios.get(`http://localhost:5000/api/jobs/${job.id}/share-templates`);
      const template = templates.data[platform.toLowerCase()];

      if (template) {
        window.open(template.url, '_blank');
      }
    } catch (err) {
      console.error('Error sharing job:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p>{error || 'Job not found'}</p>
        </div>
      </div>
    );
  }

  // Prepare SEO data
  const baseUrl = window.location.origin;
  const jobUrl = `${baseUrl}/jobs/${job.slug || job.id}`;
  const salaryText = job.base_salary_min && job.base_salary_max
    ? `${job.base_salary_min.toLocaleString()}-${job.base_salary_max.toLocaleString()} ${job.currency || 'NGN'}`
    : 'Competitive';

  const seoTitle = job.seo_title || `${job.title} at ${job.company_name}`;
  const seoDescription = job.seo_description || `${job.title} position at ${job.company_name}. Location: ${job.work_location_type}. Salary: ${salaryText}`;

  // Build JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description,
    'datePosted': job.date_posted,
    'validThrough': job.valid_through,
    'employmentType': job.job_type || 'FULL_TIME',
    'jobLocationType': job.work_location_type === 'Remote' ? 'TELECOMMUTE' : 'PHYSICAL',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company_name,
      'logo': job.company_logo_url
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'NG',
        'addressRegion': job.location_state,
        'addressLocality': job.location_lga
      }
    }
  };

  if (job.base_salary_min && job.base_salary_max) {
    jsonLd.baseSalary = {
      '@type': 'PriceSpecification',
      'priceCurrency': job.currency || 'NGN',
      'price': `${job.base_salary_min}-${job.base_salary_max}`
    };
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        ogImage={job.og_image_url}
        ogUrl={jobUrl}
        jsonLd={jsonLd}
        canonical={jobUrl}
      />

      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            {job.company_logo_url && (
              <img src={job.company_logo_url} alt={job.company_name} style={styles.companyLogo} />
            )}
            <div style={styles.headerText}>
              <h1 style={styles.title}>{job.title}</h1>
              <p style={styles.company}>{job.company_name}</p>
              <div style={styles.badges}>
                <span style={styles.badge}>{job.job_type || 'Full-time'}</span>
                <span style={styles.badge}>{job.work_location_type}</span>
                {job.base_salary_min && <span style={styles.badge}>{salaryText}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionBar}>
          <button onClick={applyJob} style={styles.applyButton}>
            Apply Now →
          </button>
          <div style={styles.shareContainer}>
            <button onClick={() => setShareMenu(!shareMenu)} style={styles.shareButton}>
              Share ↗
            </button>
            {shareMenu && (
              <div style={styles.shareMenu}>
                <button onClick={() => shareJob('LinkedIn')} style={styles.shareOption}>
                  💼 LinkedIn
                </button>
                <button onClick={() => shareJob('Twitter')} style={styles.shareOption}>
                  𝕏 Twitter/X
                </button>
                <button onClick={() => shareJob('WhatsApp')} style={styles.shareOption}>
                  💬 WhatsApp
                </button>
                <button onClick={() => shareJob('Email')} style={styles.shareOption}>
                  ✉️ Email
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(jobUrl);
                    alert('Link copied!');
                  }} 
                  style={styles.shareOption}
                >
                  🔗 Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Left Column */}
          <div style={styles.mainColumn}>
            {/* Description */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>About the Role</h2>
              <div style={styles.description}>
                {job.description}
              </div>
            </section>

            {/* Required Skills */}
            {job.required_skills && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Required Skills</h2>
                <div style={styles.skillsList}>
                  {Array.isArray(job.required_skills)
                    ? job.required_skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))
                    : JSON.parse(job.required_skills || '[]').map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))
                  }
                </div>
              </section>
            )}

            {/* Nice to Have Skills */}
            {job.nice_to_have_skills && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Nice to Have</h2>
                <div style={styles.skillsList}>
                  {Array.isArray(job.nice_to_have_skills)
                    ? job.nice_to_have_skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))
                    : JSON.parse(job.nice_to_have_skills || '[]').map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))
                  }
                </div>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Benefits</h2>
                <ul style={styles.benefitsList}>
                  {Array.isArray(job.benefits)
                    ? job.benefits.map((benefit, idx) => (
                        <li key={idx} style={styles.benefitItem}>✓ {benefit}</li>
                      ))
                    : JSON.parse(job.benefits || '[]').map((benefit, idx) => (
                        <li key={idx} style={styles.benefitItem}>✓ {benefit}</li>
                      ))
                  }
                </ul>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div style={styles.sidebar}>
            {/* Job Details Card */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Job Details</h3>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Experience Level:</span>
                <span style={styles.detailValue}>{job.education_level || 'Not specified'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Location:</span>
                <span style={styles.detailValue}>
                  {job.location_state} {job.location_lga ? `- ${job.location_lga}` : ''}
                </span>
              </div>
              {job.base_salary_min && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Salary:</span>
                  <span style={styles.detailValue}>{salaryText}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Type:</span>
                <span style={styles.detailValue}>{job.job_type || 'Full-time'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Posted:</span>
                <span style={styles.detailValue}>
                  {new Date(job.date_posted).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Hiring Manager Card */}
            {job.hiring_manager_name && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Hiring Manager</h3>
                <p style={styles.cardContent}>{job.hiring_manager_name}</p>
                {job.hiring_manager_email && (
                  <p style={styles.cardContent}>
                    <a href={`mailto:${job.hiring_manager_email}`} style={styles.link}>
                      {job.hiring_manager_email}
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Apply Button */}
            <button onClick={applyJob} style={styles.applyButtonLarge}>
              Apply Now →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
    padding: '2rem 1rem',
    paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
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
  errorContainer: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '0.5rem',
    color: '#dc2626',
  },
  header: {
    background: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  },
  headerContent: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
  },
  companyLogo: {
    width: '80px',
    height: '80px',
    borderRadius: '0.5rem',
    objectFit: 'cover',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.5rem',
  },
  company: {
    fontSize: '1.125rem',
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  badges: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  actionBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  applyButton: {
    background: '#16a34a',
    color: 'white',
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shareContainer: {
    position: 'relative',
  },
  shareButton: {
    background: '#2563eb',
    color: 'white',
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shareMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    marginTop: '0.5rem',
    zIndex: 10,
  },
  shareOption: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.95rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '2rem',
  },
  mainColumn: {
    minWidth: 0,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  section: {
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
  description: {
    color: '#374151',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  skillsList: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  skillTag: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
  },
  benefitItem: {
    padding: '0.75rem 0',
    color: '#374151',
    fontSize: '0.95rem',
  },
  card: {
    background: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.75rem',
  },
  cardContent: {
    color: '#374151',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f3f4f6',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#6b7280',
  },
  detailValue: {
    color: '#374151',
  },
  applyButtonLarge: {
    width: '100%',
    background: '#16a34a',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  }
};
