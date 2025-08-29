import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';

const CustomSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    communityGuidelines: false,
    cookiePolicy: false,
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({
      ...prev,
      [name]: checked
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

    // Check if all agreements are accepted
    if (!agreements.termsOfService || !agreements.communityGuidelines || !agreements.cookiePolicy) {
      setError('Please accept all required agreements to continue');
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
        // TODO: Create user profile with the username (database integration pending)
        console.log('User profile creation pending for userId:', newUserId);

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
        // TODO: Create user profile with the username (database integration pending)
        console.log('User profile creation pending for userId:', userId);

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
    );
  }

  return (
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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Create a password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Show" : "Hide"}
              </button>
            </div>
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul className="requirements-list">
                <li className={formData.password.length >= 8 ? 'requirement-met' : 'requirement-unmet'}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                  One number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                  One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "Show" : "Hide"}
              </button>
            </div>
          </div>

          <div className="form-group agreements-section">
            <h3 className="agreements-title">Required Agreements</h3>
            
            <div className="agreement-item">
              <label className="agreement-label">
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={agreements.termsOfService}
                  onChange={handleAgreementChange}
                  required
                  className="agreement-checkbox"
                />
                <span className="agreement-text">
                  I agree to the{' '}
                  <a href="/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="agreement-link">
                    Terms of Service
                  </a>
                  *
                </span>
              </label>
            </div>

            <div className="agreement-item">
              <label className="agreement-label">
                <input
                  type="checkbox"
                  name="communityGuidelines"
                  checked={agreements.communityGuidelines}
                  onChange={handleAgreementChange}
                  required
                  className="agreement-checkbox"
                />
                <span className="agreement-text">
                  I agree to the{' '}
                  <a href="/legal/community-guidelines" target="_blank" rel="noopener noreferrer" className="agreement-link">
                    Community Guidelines
                  </a>
                  *
                </span>
              </label>
            </div>

            <div className="agreement-item">
              <label className="agreement-label">
                <input
                  type="checkbox"
                  name="cookiePolicy"
                  checked={agreements.cookiePolicy}
                  onChange={handleAgreementChange}
                  required
                  className="agreement-checkbox"
                />
                <span className="agreement-text">
                  I agree to the{' '}
                  <a href="/legal/cookie-policy" target="_blank" rel="noopener noreferrer" className="agreement-link">
                    Cookie Policy
                  </a>
                  *
                </span>
              </label>
            </div>
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
  );
};

export default CustomSignUp; 