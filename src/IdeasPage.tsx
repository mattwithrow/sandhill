// IdeasPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const IdeasPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login?signup=true');
  };

  return (
    <div className="ideas-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing<br />
              <span className="gradient-text">Ideas</span>
            </h1>
            <p className="hero-subtitle">
              Explore innovative projects and missions that are looking for the right people to bring them to life.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                Join as Builder
              </button>
            </div>
            <div className="scroll-indicator float">
              <span className="scroll-text">Scroll to explore</span>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
        </section>

        {/* Featured Ideas Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">Featured Ideas</div>
              <h2 className="section-title">
                Projects that need your skills and passion
              </h2>
            </div>
            <div className="grid-3">
              <div className="feature-card">
                <h3>Sustainable Food Platform</h3>
                <p>Connecting local farmers with urban consumers to reduce food waste and support sustainable agriculture.</p>
                <div className="idea-meta">
                  <span className="idea-category">Social Impact</span>
                  <span className="idea-location">Remote</span>
                </div>
              </div>
              <div className="feature-card">
                <h3>Education Access App</h3>
                <p>Making quality education accessible to underserved communities through mobile learning technology.</p>
                <div className="idea-meta">
                  <span className="idea-category">Education</span>
                  <span className="idea-location">Remote</span>
                </div>
              </div>
              <div className="feature-card">
                <h3>Mental Health Support</h3>
                <p>Creating a peer-to-peer mental health support network for young professionals.</p>
                <div className="idea-meta">
                  <span className="idea-category">Healthcare</span>
                  <span className="idea-location">Remote</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">How It Works</div>
              <h2 className="section-title">
                Find the perfect project to contribute to
              </h2>
            </div>
            <div className="grid-3">
              <div className="feature-card">
                <h3>Browse Ideas</h3>
                <p>Explore projects that match your skills, interests, and values. Filter by category, location, and commitment level.</p>
              </div>
              <div className="feature-card">
                <h3>Connect & Discuss</h3>
                <p>Reach out to idea owners, ask questions, and discuss how you can contribute to their vision.</p>
              </div>
              <div className="feature-card">
                <h3>Start Building</h3>
                <p>Join the team and start making a difference. Your skills can help turn ideas into reality.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section fade-in">
                      <div className="section-header">
              <h2 className="section-title">Ready to find your next project?</h2>
            </div>
          <p className="cta-text">
            Join our community of builders and help bring amazing ideas to life.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={handleSignUp}>
              Sign Up
            </button>
            <button className="btn btn-outline btn-large" onClick={handleNavigateToLogin}>
              🔑 Log In
            </button>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">Ideas posted</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">1,000+</span>
              <span className="trust-label">Builders joined</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">200+</span>
              <span className="trust-label">Projects launched</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IdeasPage; 