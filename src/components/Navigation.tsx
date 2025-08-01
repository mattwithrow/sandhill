import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface NavItem {
  name: string;
  path: string;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { authStatus, signOut } = useAuthenticator();

  // Check if user is authenticated using Amplify auth
  const isAuthenticated = authStatus === 'authenticated';

  // Version A: Unauthenticated navigation
  const unauthenticatedNavItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  // Version B: Authenticated navigation
  const authenticatedNavItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Builders', path: '/builders', requiresAuth: true },
    { name: 'Ideas', path: '/ideas', requiresAuth: true },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : unauthenticatedNavItems;

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                Log In
              </Link>
              <Link to="/start" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/my-account" className="btn btn-secondary">
                My Account
              </Link>
              <button className="btn btn-ghost" onClick={handleSignOut}>
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
                  Log In
                </Link>
                <Link 
                  to="/start" 
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-account" className="btn btn-secondary">
                  My Account
                </Link>
                <button 
                  className="btn btn-ghost" 
                  onClick={handleSignOut}
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