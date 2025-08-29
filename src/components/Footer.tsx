import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-title">Sandhill</h3>
              <p className="footer-tagline">
                Connect with the right people to build what matters.
              </p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <Link to="/legal/terms-of-service" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/cookie-policy" className="footer-link">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/community-guidelines" className="footer-link">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/legal/disclaimer" className="footer-link">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link to="/ventures" className="footer-link">
                  Browse Ventures
                </Link>
              </li>
              <li>
                <Link to="/experts" className="footer-link">
                  Find Experts
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Sandhill. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
