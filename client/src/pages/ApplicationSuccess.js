/**
 * Application Success Page
 * Shown after a user successfully applies to a job
 * Includes viral sharing incentives and social features
 * Route: /application-success/:applicationId
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEOHead from '../components/SEOHead';

export default function ApplicationSuccess() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareCount, setShareCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);

      // Fetch application details
      const appResponse = await axios.get(
        `http://localhost:5000/api/applications/${applicationId}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      setApplication(appResponse.data);

      // Fetch job details
      const jobResponse = await axios.get(
        `http://localhost:5000/api/jobs-seo/${appResponse.data.job_id}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      setJob(jobResponse.data);
      setError('');
    } catch (err) {
      console.error('Error fetching application data:', err);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const shareJob = async (platform) => {
    try {
      // Track the share
      await axios.post(
        `http://localhost:5000/api/jobs-seo/${job.id}/track-share`,
        { platform, jobseeker_id: currentUserId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      // Update share count
      setShareCount(shareCount + 1);

      // Get share template
      if (job.seo && job.seo.sharingTemplates[platform.toLowerCase()]) {
        const template = job.seo.sharingTemplates[platform.toLowerCase()];
        window.open(template.url, '_blank', 'width=600,height=400');
      }
    } catch (err) {
      console.error('Error sharing job:', err);
    }
  };

  const copyLink = async () => {
    try {
      const jobUrl = `${window.location.origin}/jobs/${job.slug || job.id}`;
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);

      // Track the share
      await axios.post(
        `http://localhost:5000/api/jobs-seo/${job.id}/track-share`,
        { platform: 'Direct-Link', jobseeker_id: currentUserId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      setShareCount(shareCount + 1);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying link:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading your success status...</p>
        </div>
      </div>
    );
  }

  if (error || !job || !application) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p>{error || 'Failed to load application details'}</p>
          <button onClick={() => navigate('/jobs')} style={styles.button}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`Application Submitted - ${job.title} at ${job.company_name}`}
        description={`Congratulations! Your application for ${job.title} at ${job.company_name} has been submitted. Share with your network to earn rewards.`}
      />

      <div style={styles.container}>
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Success Celebration */}
        <div style={styles.celebration}>
          <div style={styles.confetti}>🎉</div>
          <h1 style={styles.successTitle}>Application Submitted!</h1>
          <p style={styles.successMessage}>
            Your application for <strong>{job.title}</strong> at{' '}
            <strong>{job.company_name}</strong> has been successfully submitted.
          </p>
        </div>

        {/* Main Content Container */}
        <div style={styles.contentWrapper}>
          {/* Left Column - Job Summary */}
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Application Details</h2>

              <div style={styles.jobSummary}>
                {job.company_logo_url && (
                  <img src={job.company_logo_url} alt={job.company_name} style={styles.logo} />
                )}
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.company}>{job.company_name}</p>
                  <div style={styles.tags}>
                    <span style={styles.tag}>{job.job_type || 'Full-time'}</span>
                    <span style={styles.tag}>{job.work_location_type}</span>
                  </div>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Status:</span>
                <span style={styles.statusValue}>✓ Submitted</span>
              </div>

              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Applied:</span>
                <span style={styles.statusValue}>
                  {new Date(application.applied_at).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>What's next:</span>
                <span style={styles.statusValue}>
                  The recruiter will review your application
                </span>
              </div>
            </div>

            {/* What You Can Do Next */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>What You Can Do Next</h2>
              <ul style={styles.actionList}>
                <li style={styles.actionItem}>
                  ✓ Check back regularly for recruiter responses
                </li>
                <li style={styles.actionItem}>
                  ✓ Complete your portfolio profile
                </li>
                <li style={styles.actionItem}>
                  ✓ Apply to similar job opportunities
                </li>
                <li style={styles.actionItem}>
                  ✓ Share this role with your network
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Viral Share Section */}
          <div style={styles.rightColumn}>
            <div style={styles.shareCard}>
              <h2 style={styles.shareTitle}>📢 Invite Your Network</h2>
              <p style={styles.shareDescription}>
                Know someone perfect for this role? Spread the word and help your network find great opportunities!
              </p>

              <div style={styles.shareButtons}>
                {/* LinkedIn Share */}
                <button
                  onClick={() => shareJob('LinkedIn')}
                  style={{...styles.shareButton, ...styles.linkedinButton}}
                >
                  <span style={styles.icon}>💼</span>
                  <div>
                    <div style={styles.buttonTitle}>Share on LinkedIn</div>
                    <div style={styles.buttonSubtitle}>Professional network</div>
                  </div>
                </button>

                {/* Twitter/X Share */}
                <button
                  onClick={() => shareJob('Twitter')}
                  style={{...styles.shareButton, ...styles.twitterButton}}
                >
                  <span style={styles.icon}>𝕏</span>
                  <div>
                    <div style={styles.buttonTitle}>Share on X</div>
                    <div style={styles.buttonSubtitle}>Twitter community</div>
                  </div>
                </button>

                {/* WhatsApp Share */}
                <button
                  onClick={() => shareJob('WhatsApp')}
                  style={{...styles.shareButton, ...styles.whatsappButton}}
                >
                  <span style={styles.icon}>💬</span>
                  <div>
                    <div style={styles.buttonTitle}>Share on WhatsApp</div>
                    <div style={styles.buttonSubtitle}>Direct messaging</div>
                  </div>
                </button>

                {/* Email Share */}
                <button
                  onClick={() => shareJob('Email')}
                  style={{...styles.shareButton, ...styles.emailButton}}
                >
                  <span style={styles.icon}>✉️</span>
                  <div>
                    <div style={styles.buttonTitle}>Share via Email</div>
                    <div style={styles.buttonSubtitle}>Send to contacts</div>
                  </div>
                </button>

                {/* Copy Link */}
                <button
                  onClick={copyLink}
                  style={{...styles.shareButton, ...styles.linkButton}}
                >
                  <span style={styles.icon}>🔗</span>
                  <div>
                    <div style={styles.buttonTitle}>
                      {copied ? '✓ Copied!' : 'Copy Link'}
                    </div>
                    <div style={styles.buttonSubtitle}>Share anywhere</div>
                  </div>
                </button>
              </div>

              {/* Share Counter */}
              <div style={styles.shareCounter}>
                <span style={styles.counterIcon}>👥</span>
                <span style={styles.counterText}>
                  {shareCount} {shareCount === 1 ? 'person' : 'people'} invited
                </span>
              </div>

              <p style={styles.shareReward}>
                💡 Tip: Sharing job opportunities with your network helps them grow and may unlock rewards!
              </p>
            </div>

            {/* Similar Jobs Section */}
            <div style={styles.similarCard}>
              <h2 style={styles.cardTitle}>Similar Opportunities</h2>
              <p style={styles.similarText}>
                While you wait for a response, explore similar roles that match your profile.
              </p>
              <button
                onClick={() => navigate('/job-matches')}
                style={styles.exploreButton}
              >
                Explore More Jobs →
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            onClick={() => navigate('/jobs')}
            style={{...styles.primaryButton, ...styles.secondaryButton}}
          >
            Browse More Jobs
          </button>
          <button
            onClick={() => navigate('/my-portfolio')}
            style={styles.primaryButton}
          >
            Optimize Your Profile
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    borderTop: '4px solid #667eea',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
    color: '#dc2626',
  },
  celebration: {
    textAlign: 'center',
    marginBottom: '3rem',
    animation: 'slideIn 0.6s ease-out',
  },
  confetti: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  successTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  successMessage: {
    fontSize: '1.125rem',
    color: 'rgba(255,255,255,0.9)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  shareCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  similarCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  cardTitle: {
    fontSize: '1.375rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '1rem',
  },
  shareTitle: {
    fontSize: '1.375rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.5rem',
  },
  shareDescription: {
    color: '#6b7280',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  jobSummary: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '0.5rem',
    objectFit: 'cover',
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.25rem',
  },
  company: {
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  tag: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    background: '#e5e7eb',
    margin: '1rem 0',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f3f4f6',
  },
  statusLabel: {
    fontWeight: '600',
    color: '#6b7280',
  },
  statusValue: {
    color: '#374151',
  },
  actionList: {
    listStyle: 'none',
    padding: 0,
  },
  actionItem: {
    padding: '0.75rem 0',
    color: '#374151',
    fontSize: '0.95rem',
  },
  shareButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  shareButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
    textAlign: 'left',
  },
  linkedinButton: {
    background: '#0a66c2',
    color: 'white',
  },
  twitterButton: {
    background: '#000000',
    color: 'white',
  },
  whatsappButton: {
    background: '#25d366',
    color: 'white',
  },
  emailButton: {
    background: '#ea4335',
    color: 'white',
  },
  linkButton: {
    background: '#667eea',
    color: 'white',
  },
  icon: {
    fontSize: '1.5rem',
  },
  buttonTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
  },
  buttonSubtitle: {
    fontSize: '0.8rem',
    opacity: 0.9,
  },
  shareCounter: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#f0fdf4',
    borderRadius: '0.75rem',
    textAlign: 'center',
    border: '1px solid #dcfce7',
  },
  counterIcon: {
    fontSize: '1.5rem',
    marginRight: '0.5rem',
  },
  counterText: {
    color: '#166534',
    fontWeight: '600',
  },
  shareReward: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  similarText: {
    color: '#6b7280',
    marginBottom: '1rem',
  },
  exploreButton: {
    width: '100%',
    padding: '1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  primaryButton: {
    flex: 1,
    minWidth: '200px',
    padding: '1rem 2rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  secondaryButton: {
    background: 'transparent',
    border: '2px solid white',
    color: 'white',
  },
};
