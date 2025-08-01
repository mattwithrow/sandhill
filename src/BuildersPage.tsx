// BuildersPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuildersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login'); // You can change this to a signup route when available
  };

  return (
    <div className="builders-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Meet Amazing<br />
              <span className="gradient-text">Builders</span>
            </h1>
            <p className="hero-subtitle">
              Connect with skilled professionals who are passionate about making a difference and building meaningful projects.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                🚀 Post Your Idea
              </button>
            </div>
            <div className="scroll-indicator float">
              <span className="scroll-text">Scroll to explore</span>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
        </section>

        {/* Featured Builders Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">👥 Featured Builders</div>
              <h2 className="section-title">
                Skilled professionals ready to help bring your ideas to life
              </h2>
            </div>
            <div className="grid-3">
              <div className="feature-card">
                <div className="feature-icon">💻</div>
                <h3>Sarah Chen</h3>
                <p>Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture. Passionate about social impact projects.</p>
                <div className="builder-meta">
                  <span className="builder-skills">React, Node.js, AWS</span>
                  <span className="builder-location">San Francisco</span>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Marcus Rodriguez</h3>
                <p>Product designer specializing in user experience and accessibility. Has helped launch 15+ successful products.</p>
                <div className="builder-meta">
                  <span className="builder-skills">UX/UI, Figma, Accessibility</span>
                  <span className="builder-location">Remote</span>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Priya Patel</h3>
                <p>Marketing strategist with expertise in growth hacking and community building. Loves working with mission-driven startups.</p>
                <div className="builder-meta">
                  <span className="builder-skills">Growth, Community, Analytics</span>
                  <span className="builder-location">New York</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Categories Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">🔧 Skills & Categories</div>
              <h2 className="section-title">
                Find builders with the skills you need
              </h2>
            </div>
            <div className="grid-3">
              <div className="feature-card">
                <div className="feature-icon">💻</div>
                <h3>Development</h3>
                <p>Frontend, backend, mobile, and full-stack developers ready to build your technical solutions.</p>
                <ul className="skill-list">
                  <li>React, Vue, Angular</li>
                  <li>Node.js, Python, Ruby</li>
                  <li>iOS, Android, Flutter</li>
                </ul>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Design</h3>
                <p>UX/UI designers, graphic designers, and creative professionals to bring your vision to life.</p>
                <ul className="skill-list">
                  <li>UX/UI Design</li>
                  <li>Brand Identity</li>
                  <li>Prototyping</li>
                </ul>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Business</h3>
                <p>Marketing, operations, and strategy experts to help grow and scale your project.</p>
                <ul className="skill-list">
                  <li>Marketing Strategy</li>
                  <li>Operations</li>
                  <li>Business Development</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section fade-in">
          <div className="section-header">
            <div className="feature-icon">⭐</div>
            <h2 className="section-title">Ready to find your team?</h2>
          </div>
          <p className="cta-text">
            Post your idea and connect with builders who share your vision and values.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={handleSignUp}>
              🚀 Sign Up
            </button>
            <button className="btn btn-outline btn-large" onClick={handleNavigateToLogin}>
              🔑 Log In
            </button>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">1,000+</span>
              <span className="trust-label">Builders available</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">50+</span>
              <span className="trust-label">Skills categories</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">95%</span>
              <span className="trust-label">Response rate</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuildersPage; 