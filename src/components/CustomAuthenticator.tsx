import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import CustomSignIn from './CustomSignIn';
import CustomSignUp from './CustomSignUp';

interface CustomAuthenticatorProps {
  children: React.ReactNode;
}

const CustomAuthenticator: React.FC<CustomAuthenticatorProps> = ({ children }) => {
  const { authStatus } = useAuthenticator();
  const [isSignUp, setIsSignUp] = useState(false);

  // If user is authenticated, render the children
  if (authStatus === 'authenticated') {
    return <>{children}</>;
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Welcome to Sandhill</h1>
          <p>Connect with the right people to build what matters.</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(true)}
          >
            Create Account
          </button>
        </div>

        {isSignUp ? <CustomSignUp /> : <CustomSignIn />}

        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              className="link-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomAuthenticator; 