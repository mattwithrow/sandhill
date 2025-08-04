import React, { useState, useEffect } from 'react';
import { signIn, resetPassword } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

const CustomSignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const { authStatus, user } = useAuthenticator();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ 
        username: formData.usernameOrEmail, 
        password: formData.password 
      });
      setSignInSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetEmail(formData.usernameOrEmail);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLoading(true);

    try {
      await resetPassword({ username: resetEmail });
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error sending reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setResetSuccess(false);
    setError('');
  };

  // Check if user is already authenticated
  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  // Handle successful sign-in
  useEffect(() => {
    if (signInSuccess) {
      // Small delay to show success state before redirect
      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [signInSuccess, navigate]);

  if (signInSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Sign In Successful!</h2>
          <div className="success-message">
            <p>✅ Welcome back!</p>
            <p>Redirecting you to the homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Reset Password</h2>
          {!resetSuccess ? (
            <>
              <p className="auth-text">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="resetEmail">Email *</label>
                  <input
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button 
                  type="submit" 
                  disabled={resetLoading}
                  className="btn btn-primary btn-full"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="success-message">
                <p>✅ Reset link sent!</p>
                <p>Check your email for instructions to reset your password.</p>
                <div className="password-requirements">
                  <p className="requirements-title">When creating your new password, remember it must contain:</p>
                  <ul className="requirements-list">
                    <li className="requirement-met">At least 8 characters</li>
                    <li className="requirement-met">One uppercase letter</li>
                    <li className="requirement-met">One lowercase letter</li>
                    <li className="requirement-met">One number</li>
                    <li className="requirement-met">One special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          <div className="auth-footer">
            <button
              type="button"
              className="link-button"
              onClick={handleBackToSignIn}
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Email *</label>
            <input
              type="email"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            <div className="form-helper">
              <button
                type="button"
                className="link-button"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomSignIn; 