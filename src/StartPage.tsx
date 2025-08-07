// StartPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import EarlyCollaboratorsModal from './components/EarlyCollaboratorsModal';

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator();
  const isAuthenticated = authStatus === 'authenticated';
  const [showModal, setShowModal] = useState(false);

  // Show modal after a short delay for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);



  const handleNavigateToAbout = () => {
    navigate('/about');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login?signup=true');
  };

  return (
    <>
      <div className="start-page">
        <div className="container">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                Connect with the right<br />
                people to build what<br />
                <span className="gradient-text">matters.</span>
              </h1>
              <p className="hero-subtitle">
                You care about mission, not just metrics. You want to create with people who show up, follow through, and give a damn.
              </p>
              {!isAuthenticated ? (
                              <div className="cta-buttons">
                <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
              ) : (
                              <div className="cta-buttons">
                <button className="btn btn-primary btn-large" onClick={() => navigate('/ideas')}>
                  Browse Ideas
                </button>
                              <button className="btn btn-outline btn-large" onClick={() => navigate('/experts')}>
                Find Experts
                </button>
              </div>
              )}
              <div className="scroll-indicator float">
                <span className="scroll-text">Scroll to explore</span>
                <div className="scroll-arrow">↓</div>
              </div>
            </div>
          </section>

          {/* Platform Description Section */}
          <section className="section">
            <div className="content-card">
                          <div className="section-header">
              <div className="eyebrow">A platform built for people with purpose.</div>
                             <h2 className="section-title">
                 When vision meets execution and when values align, amazing things happen. Our platform brings together:
               </h2>
            </div>
              <div className="grid-2">
                <div className="feature-card">
                  <h3>Idea Owners</h3>
                  <p>People with a mission, a goal, or a spark worth pursuing</p>
                </div>
                <div className="feature-card">
                  <h3>Experts & Creators</h3>
                  <p>Skilled individuals ready to collaborate and help shape what's next</p>
                </div>
              </div>
              
            </div>
          </section>

          {/* Two Column Section */}
          <section className="section">
            <div className="grid-2">
                          {/* Left Column */}
            <div className="feature-card">
              <div className="section-header text-left">
                <h2 className="section-title">
                  You bring the idea. We help you find the right hands to build it.
                </h2>
              </div>
                <ul className="feature-list">
                  <li>Post your mission, challenge, or early-stage concept</li>
                  <li>Share your values, goals, and what kind of support you're looking for</li>
                  <li>Attract experts who genuinely care about the same things</li>
                  <li>Get moving—whether you're starting a nonprofit, app, brand, or campaign</li>
                </ul>
              </div>

                          {/* Right Column */}
            <div className="feature-card">
              <div className="section-header text-left">
                <h2 className="section-title">
                  You're not just looking for work—you're looking for meaningful work.
                </h2>
              </div>
                <ul className="feature-list">
                  <li>Explore projects that align with your values and interests</li>
                  <li>Connect with founders, thinkers, and dreamers at the earliest stage</li>
                  <li>Offer your skills—design, code, strategy, operations, marketing, and more</li>
                  <li>Choose to support missions that inspire you</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="cta-section fade-in">
                      <div className="section-header">
            <h2 className="section-title">
              {isAuthenticated ? 'Ready to start building?' : 'Ready to build what matters?'}
            </h2>
          </div>
            <p className="cta-text">
              {isAuthenticated 
                ? 'Explore ideas, connect with experts, and start creating something meaningful.'
                : 'Join a community of people who care about making a difference, not just making a profit.'
              }
            </p>
            {!isAuthenticated ? (
                          <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                Sign Up
              </button>
              <button className="btn btn-outline btn-large" onClick={handleNavigateToLogin}>
                Log In
              </button>
            </div>
            ) : (
                          <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/my-account')}>
                My Account
              </button>
              <button className="btn btn-outline btn-large" onClick={() => navigate('/ideas')}>
                Browse Ideas
              </button>
            </div>
            )}
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-number">1,000+</span>
                <span className="trust-label">Experts joined</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">500+</span>
                <span className="trust-label">Projects launched</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">98%</span>
                <span className="trust-label">Success rate</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Early Collaborators Modal - Rendered outside main container */}
      <EarlyCollaboratorsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default StartPage;