// LoginPage.tsx
import React from 'react';
import CustomAuthenticator from './components/CustomAuthenticator';
import AuthHomePage from './AuthHomePage';

const LoginPage: React.FC = () => {
  return (
    <React.StrictMode>
      <CustomAuthenticator>
        <AuthHomePage />
      </CustomAuthenticator>
    </React.StrictMode>
  );
};

export default LoginPage;