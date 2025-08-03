import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const CustomSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState('');

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user with email as username
      const { isSignUpComplete, userId: newUserId } = await signUp({
        username: formData.email, // Use email as the username for login
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
          },
        },
      });

      if (!isSignUpComplete && newUserId) {
        setUserId(newUserId);
        setShowVerification(true);
      } else if (isSignUpComplete && newUserId) {
        // Create user profile with the username
        await client.models.UserProfile.create({
          userId: newUserId,
          username: formData.username,
          userType: 'both', // Default value
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          projectDetails: '',
        });

        // Sign in the user with email
        await signIn({ username: formData.email, password: formData.password });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: formData.email,
        confirmationCode: verificationCode,
      });

      if (isSignUpComplete) {
        // Create user profile with the username
        await client.models.UserProfile.create({
          userId,
          username: formData.username,
          userType: 'both', // Default value
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          projectDetails: '',
        });

        // Sign in the user with email
        await signIn({ username: formData.email, password: formData.password });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Verify Your Email</h2>
          <p className="auth-text">
            We've sent a verification code to <strong>{formData.email}</strong>. 
            Please check your email and enter the code below.
          </p>
          <form onSubmit={handleVerification} className="auth-form">
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code *</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder="Enter verification code"
                className="form-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary btn-full"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Choose a username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
              placeholder="Create a password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomSignUp; 