/**
 * Programmatic Landing Page
 * Dynamic landing pages for SEO-optimized job categories and locations
 * Routes: /jobs/:role, /jobs/:location, /jobs/:role/:location
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEOHead from '../components/SEOHead';

export default function ProgrammaticLandingPage() {
  const { role, location } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    fetchLandingPageData();
  }, [role, location]);

  const fetchLandingPageData = async () => {
    try {
      setLoading(true);

      let endpoint = '';
      if (role && location) {
        endpoint = `http://localhost:5000/api/jobs-landing/${role}/${location}`;
      } else if (role) {
        endpoint = `http://localhost:5000/api/jobs-landing/by-role/${role}`;
      } else if (location) {
        endpoint = `http://localhost:5000/api/jobs-landing/by-location/${location}`;
      }

      if (!endpoint) {
        setError('Invalid page parameters');
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setJobs(response.data.jobs);
      setMetadata(response.data.seo);
      setPageInfo({
        category: response.data.category,
        location: response.data.location
      });
      setError('');
    } catch (err) {
      console.error('Error fetching landing page data:', err);
      setError('Failed to load jobs for this page');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobSlug) => {
    navigate(`/jobs/${jobSlug}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={metadata?.title || 'Job Opportunities'}
        description={metadata?.description || 'Find great job opportunities'}
        ogImage={metadata?.ogImage}
      />

      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              {metadata?.title || 'Job Opportunities'}
            </h1>
            <p style={styles.heroDescription}>
              {metadata?.description || 'Find and apply to amazing opportunities'}
            </p>
            <div style={styles.jobCountBadge}>
              {jobs.length} opportunities available
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div style={styles.filterContent}>
            <div style={styles.filterItem}>
              <label style={styles.filterLabel}>Category:</label>
              <span style={styles.filterValue}>
                {pageInfo.category?.name || 'All'}
              </span>
            </div>
            <div style={styles.filterItem}>
              <label style={styles.filterLabel}>Location:</label>
              <span style={styles.filterValue}>
                {pageInfo.location?.name || 'All'}
              </span>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : jobs.length > 0 ? (
          <div style={styles.jobsGrid}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={styles.jobCard}
                onClick={() => handleJobClick(job.slug || job.id)}
              >
                {job.company_logo_url && (
                  <img
                    src={job.company_logo_url}
                    alt={job.company_name}
                    style={styles.companyLogo}
                  />
                )}

                <div style={styles.jobCardContent}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobCompany}>{job.company_name}</p>

                  <div style={styles.jobMeta}>
                    <span style={styles.metaBadge}>
                      {job.work_location_type}
                    </span>
                    <span style={styles.metaBadge}>
                      {job.job_type || 'Full-time'}
                    </span>
                  </div>

                  <p style={styles.jobDescription}>
                    {job.description?.substring(0, 120)}...
                  </p>

                  {job.base_salary_min && job.base_salary_max && (
                    <p style={styles.jobSalary}>
                      💰 {job.base_salary_min.toLocaleString()} -{' '}
                      {job.base_salary_max.toLocaleString()} {job.currency || 'NGN'}
                    </p>
                  )}

                  <button style={styles.viewButton}>
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>
              No opportunities found for this search.
            </p>
            <p style={styles.emptySubtext}>
              Try adjusting your filters or browse other categories
            </p>
            <button
              onClick={() => navigate('/jobs')}
              style={styles.browseButton}
            >
              Browse All Jobs
            </button>
          </div>
        )}

        {/* SEO Content Section */}
        <div style={styles.contentSection}>
          <h2 style={styles.contentTitle}>Why Choose FaithJobs?</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>✓</span>
              <h3 style={styles.benefitTitle}>Quality Opportunities</h3>
              <p style={styles.benefitText}>
                Vetted job postings from reputable organizations
              </p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>✓</span>
              <h3 style={styles.benefitTitle}>Easy Application</h3>
              <p style={styles.benefitText}>
                Apply with your profile in just one click
              </p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>✓</span>
              <h3 style={styles.benefitTitle}>Career Growth</h3>
              <p style={styles.benefitText}>
                Access roles that match your skills and experience
              </p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>✓</span>
              <h3 style={styles.benefitTitle}>Network Building</h3>
              <p style={styles.benefitText}>
                Connect with professionals in your field
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {jobs.length > 0 && (
          <div style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>Ready to Apply?</h2>
            <p style={styles.ctaText}>
              Create your profile and start applying to these opportunities today
            </p>
            <button
              onClick={() => navigate('/signup/jobseeker')}
              style={styles.ctaButton}
            >
              Get Started Now →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
    padding: '0',
    paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
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
  heroSection: {
    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    color: 'white',
    padding: '3rem 1rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  heroDescription: {
    fontSize: '1.125rem',
    marginBottom: '1.5rem',
    opacity: 0.95,
  },
  jobCountBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  filterBar: {
    background: 'white',
    padding: '1.5rem 1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  filterContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '2rem',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#6b7280',
  },
  filterValue: {
    color: '#2563eb',
    fontWeight: '600',
  },
  jobsGrid: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  jobCard: {
    background: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  companyLogo: {
    width: '50px',
    height: '50px',
    borderRadius: '0.5rem',
    objectFit: 'cover',
    marginBottom: '1rem',
  },
  jobCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  jobTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.25rem',
  },
  jobCompany: {
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  jobMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  metaBadge: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  jobDescription: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginBottom: '0.75rem',
    lineHeight: '1.4',
  },
  jobSalary: {
    color: '#059669',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  viewButton: {
    background: '#2563eb',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#dc2626',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    color: '#9ca3af',
    marginBottom: '1.5rem',
  },
  browseButton: {
    background: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  contentSection: {
    maxWidth: '1200px',
    margin: '3rem auto',
    padding: '0 1rem',
  },
  contentTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  benefitCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  benefitIcon: {
    display: 'inline-block',
    fontSize: '2rem',
    color: '#16a34a',
    marginBottom: '1rem',
  },
  benefitTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.5rem',
  },
  benefitText: {
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 1rem',
    textAlign: 'center',
    marginTop: '3rem',
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.125rem',
    marginBottom: '1.5rem',
    opacity: 0.95,
  },
  ctaButton: {
    background: 'white',
    color: '#667eea',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
  }
};
