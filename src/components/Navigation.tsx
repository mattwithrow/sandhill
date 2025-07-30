import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, LogIn, User } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Start', path: '/start', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Dashboard', path: '/auth_home', icon: User, requiresAuth: true },
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
            const IconComponent = item.icon;
            
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
                  <IconComponent size={18} />
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
                <LogIn size={16} />
                Sign In
              </Link>
              <Link to="/start" className="btn btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth_home" className="btn btn-secondary">
                <User size={16} />
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
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              
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
                    <IconComponent size={20} />
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
                  <LogIn size={16} />
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
                  <User size={16} />
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