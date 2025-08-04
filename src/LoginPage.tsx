// LoginPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import CustomAuthenticator from './components/CustomAuthenticator';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator();
  const showSignUp = searchParams.get('signup') === 'true';

  // Redirect authenticated users to My Account page
  useEffect(() => {
    if (authStatus === 'authenticated') {
      console.log('LoginPage: User authenticated, redirecting to My Account');
      navigate('/my-account');
    }
  }, [authStatus, navigate]);

  return (
    <React.StrictMode>
      <CustomAuthenticator defaultSignUp={showSignUp}>
        <div>Loading...</div>
      </CustomAuthenticator>
    </React.StrictMode>
  );
};

export default LoginPage;