import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff9f5 0%, #fffaf0 50%, #fef5f1 100%)',
      padding: 0,
      paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
    },
    heroSection: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '5rem 1rem',
      textAlign: 'center',
    },
    mainTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1rem',
    },
    mainSubtitle: {
      fontSize: '1.25rem',
      color: '#8b6239',
      marginBottom: '2rem',
    },
    grid2Col: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '3rem',
    },
    card: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.15)',
      padding: '2rem',
      borderLeft: '4px solid #ff6b35',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
    },
    emoji: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1rem',
    },
    cardText: {
      color: '#6b7280',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    link: {
      display: 'inline-block',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
    },
    linkHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
    },
    featuresSection: {
      marginTop: '5rem',
    },
    featuresTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '3rem',
    },
    grid3Col: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
    },
    featureCard: {
      background: 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.1)',
      textAlign: 'center',
      borderTop: '3px solid #ff6b35',
      transition: 'all 0.3s ease',
    },
    featureCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(255, 107, 53, 0.2)',
    },
    featureEmoji: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    featureCardTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      marginBottom: '0.5rem',
      color: '#ff6b35',
    },
    featureCardText: {
      color: '#6b7280',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredFeature, setHoveredFeature] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.mainTitle}>
          Welcome to FaithJobs 🟠
        </h1>
        <p style={styles.mainSubtitle}>
          Connect with teaching and lecturing opportunities across Nigeria's education sector
        </p>
        
        <div style={styles.grid2Col}>
          {/* Job Seekers Card */}
          <div 
            style={{...styles.card, ...(hoveredCard === 'seeker' ? styles.cardHover : {})}}
            onMouseEnter={() => setHoveredCard('seeker')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.emoji}>👨‍🏫</div>
            <h2 style={styles.cardTitle}>For Teachers & Lecturers</h2>
            <p style={styles.cardText}>
              Find your perfect teaching role at primary schools, secondary schools, polytechnics, and universities.
            </p>
            <Link
              to="/signup/jobseeker"
              style={{
                ...styles.link,
                ...(hoveredButton === 'seeker' ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHoveredButton('seeker')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Join as Job Seeker
            </Link>
          </div>

          {/* Recruiters Card */}
          <div 
            style={{...styles.card, ...(hoveredCard === 'recruiter' ? styles.cardHover : {})}}
            onMouseEnter={() => setHoveredCard('recruiter')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.emoji}>🏫</div>
            <h2 style={styles.cardTitle}>For Schools & Institutions</h2>
            <p style={styles.cardText}>
              Find qualified teachers and lecturers. Scan verified profiles with our subscription plans.
            </p>
            <Link
              to="/signup/recruiter"
              style={{
                ...styles.link,
                ...(hoveredButton === 'recruiter' ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHoveredButton('recruiter')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Join as Recruiter
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h3 style={styles.featuresTitle}>Why Choose FaithJobs?</h3>
          <div style={styles.grid3Col}>
            <div 
              style={{...styles.featureCard, ...(hoveredFeature === 'rating' ? styles.featureCardHover : {})}}
              onMouseEnter={() => setHoveredFeature('rating')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={styles.featureEmoji}>⭐</div>
              <h4 style={styles.featureCardTitle}>Star Rating System</h4>
              <p style={styles.featureCardText}>Get rated based on your credentials, experience, and qualifications.</p>
            </div>
            <div 
              style={{...styles.featureCard, ...(hoveredFeature === 'verified' ? styles.featureCardHover : {})}}
              onMouseEnter={() => setHoveredFeature('verified')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={styles.featureEmoji}>🔒</div>
              <h4 style={styles.featureCardTitle}>Verified Profiles</h4>
              <p style={styles.featureCardText}>All profiles are verified with credentials and ID uploads for trust.</p>
            </div>
            <div 
              style={{...styles.featureCard, ...(hoveredFeature === 'coverage' ? styles.featureCardHover : {})}}
              onMouseEnter={() => setHoveredFeature('coverage')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={styles.featureEmoji}>🌍</div>
              <h4 style={styles.featureCardTitle}>Nationwide Coverage</h4>
              <p style={styles.featureCardText}>Access opportunities across all 36 states + FCT Abuja.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
