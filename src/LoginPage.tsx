// LoginPage.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomAuthenticator from './components/CustomAuthenticator';
import AuthHomePage from './AuthHomePage';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showSignUp = searchParams.get('signup') === 'true';

  return (
    <React.StrictMode>
      <CustomAuthenticator defaultSignUp={showSignUp}>
        <AuthHomePage />
      </CustomAuthenticator>
    </React.StrictMode>
  );
};

export default LoginPage;