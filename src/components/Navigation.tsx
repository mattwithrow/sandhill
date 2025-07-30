import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Start', path: '/start' },
    { name: 'About', path: '/about' },
    { name: 'Dashboard', path: '/auth_home', requiresAuth: true },
  ];

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  // Check if user is authenticated (you can integrate with Amplify auth here)
  const isAuthenticated = false; // Replace with actual auth check

  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        {/* Logo/Brand */}
        <Link to="/" className="nav-brand">
          <span>Sandhill</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-menu">
          {navItems.map((item) => {
            // Hide auth-required items if not authenticated
            if (item.requiresAuth && !isAuthenticated) {
              return null;
            }

            return (
              <li key={item.name} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/start" className="btn btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth_home" className="btn btn-secondary">
                Dashboard
              </Link>
              <button className="btn btn-ghost" onClick={() => {/* Add logout logic */}}>
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            {navItems.map((item) => {
              // Hide auth-required items if not authenticated
              if (item.requiresAuth && !isAuthenticated) {
                return null;
              }

              return (
                <li key={item.name} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Actions */}
          <div className="nav-actions">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-secondary"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/start" 
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/auth_home" 
                  className="btn btn-secondary"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => {
                    /* Add logout logic */
                    closeMobileMenu();
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;