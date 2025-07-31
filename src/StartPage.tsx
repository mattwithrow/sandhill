// StartPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToAbout = () => {
    navigate('/about');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login'); // You can change this to a signup route when available
  };

  return (
    <div className="start-page">
      <div className="start-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect with the right people to build what matters.
            </h1>
            <p className="hero-subtitle">
              You care about mission, not just metrics. You want to create with people who show up, follow through, and give a damn.
            </p>
            <button className="btn btn-primary hero-cta" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </section>

        {/* Platform Description Section */}
        <section className="platform-section">
          <div className="section-container">
            <div className="eyebrow">A platform built for people with purpose.</div>
            <h2 className="section-title">
              We believe that when vision meets execution—and when values align—amazing things happen. Our platform brings together:
            </h2>
            <div className="platform-description">
              <div className="platform-item">
                <h3>Idea Owners</h3>
                <p>People with a mission, a goal, or a spark worth pursuing</p>
              </div>
              <div className="platform-item">
                <h3>Builders & Creators</h3>
                <p>Skilled individuals ready to collaborate and help shape what's next</p>
              </div>
            </div>
            <p className="platform-summary">
              We help you find each other. We make it easy to start. And we give you the tools to build something real.
            </p>
          </div>
        </section>

        {/* Two Column Section */}
        <section className="two-column-section">
          <div className="column-container">
            {/* Left Column */}
            <div className="column left-column">
              <h2 className="column-title">
                You bring the idea. We help you find the right hands to build it.
              </h2>
              <ul className="feature-list">
                <li>Post your mission, challenge, or early-stage concept</li>
                <li>Share your values, goals, and what kind of support you're looking for</li>
                <li>Attract builders who genuinely care about the same things</li>
                <li>Get moving—whether you're starting a nonprofit, app, brand, or campaign</li>
              </ul>
            </div>

            {/* Right Column */}
            <div className="column right-column">
              <h2 className="column-title">
                You're not just looking for work—you're looking for meaningful work.
              </h2>
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
        <section className="cta-section">
          <div className="section-container">
            <h2 className="section-title">Ready to build what matters?</h2>
            <p className="cta-text">
              Join a community of people who care about making a difference, not just making a profit.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={handleSignUp}>
                Get Started
              </button>
              <button className="btn btn-secondary" onClick={handleNavigateToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StartPage;