import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/legal/terms-of-service" className="footer-link">
              Terms of Service
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/legal/privacy-policy" className="footer-link">
              Privacy Policy
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/legal/cookie-policy" className="footer-link">
              Cookie Policy
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/legal/community-guidelines" className="footer-link">
              Community Guidelines
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/legal/disclaimer" className="footer-link">
              Disclaimer
            </Link>
          </div>
          <div className="footer-copyright">
            <p>&copy; {currentYear} Sandhill. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
