// AboutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateToStart = () => {
    navigate('/start');
  };

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">About Sandhill</h1>
          <p className="hero-subtitle">
            Connecting good people doing good work
          </p>
        </section>

        {/* Who We Are Section */}
        <section className="content-section">
          <div className="section-container">
            <h2 className="section-title">Who We Are</h2>
            <div className="content-grid">
              <div className="content-block">
                <p>
                  Over the years, we've worked with amazing people—and also burned out trying to build with the wrong ones. 
                  We kept thinking: What if there were a smarter way to find the right collaborators? Not just based on skills, 
                  but on energy, intention, and mission.
                </p>
                <p>
                  This was born from that idea: that good people doing good work shouldn't have to build in isolation. 
                  With the right collaboration, momentum follows.
                </p>
                <p className="highlight-text">
                  This is the tool we wish we had when we started.
                </p>
              </div>
              <div className="image-grid">
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <span className="placeholder-icon">👥</span>
                    <p>Team Collaboration</p>
                  </div>
                </div>
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <span className="placeholder-icon">💡</span>
                    <p>Innovation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="content-section">
          <div className="section-container">
            <h2 className="section-title">Our Mission</h2>
            <div className="content-block">
              <p>
                We believe that when people with shared values and complementary skills come together, good things happen. 
                We built this to amplify those connections—to help projects get off the ground, teams form with clarity, 
                and impact grow.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="content-section">
          <div className="section-container">
            <h2 className="section-title">Why You Might Want to Join</h2>
            <div className="content-block">
              <p>
                Everyone has ideas. Some are sparks of creativity, others are deeply personal missions. 
                But no matter the scale, ideas don't grow in isolation. They grow with people.
              </p>
              <p>
                Here, we believe that if your idea can improve life, even in a small way, it's worth building. 
                And if you're someone who wants to help bring those ideas to life, you're just as important.
              </p>
              <p>
                This isn't another "networking" platform filled with buzzwords and bravado. It's a place for doers. 
                A place where you can connect with people who share your values, complement your skills, 
                and want to create something meaningful.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Grid Section */}
        <div className="bottom-grid">
          {/* Call to Action Section */}
          <section className="cta-section">
            <div className="section-container">
              <h2 className="section-title">Ready to Build with Purpose?</h2>
              <p className="cta-text">
                Create an account, see what we're about, and find your next collaborator, project, or mission.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-primary" onClick={handleNavigateToStart}>
                  Sign Up
                </button>
                <button className="btn btn-secondary" onClick={handleNavigateToLogin}>
                  Sign In
                </button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact-section">
            <div className="section-container">
              <h2 className="section-title">Get in Touch</h2>
              <div className="contact-content">
                <p>
                  Have questions about Sandhill? Want to learn more about how we can help you find the right collaborators?
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Email:</strong>
                    <a href="mailto:hello@sandhill.com">hello@sandhill.com</a>
                  </div>
                                  <div className="contact-item">
                  <strong>LinkedIn:</strong>
                  <a href="https://linkedin.com/company/sandhill" target="_blank" rel="noopener noreferrer">
                    @sandhill
                  </a>
                </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;