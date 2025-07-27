// LoginPage.tsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import AuthHomePage from './AuthHomePage';

const LoginPage: React.FC = () => {
  //const navigate = useNavigate();

  /*
  const handleNavigateToAbout = () => {
    navigate('/about');
  };
  const handleNavigateToAuthHome = () => {
    navigate('/auth_home');
  };
  */




  return (

    <React.StrictMode>
      <Authenticator>
        <AuthHomePage />
      </Authenticator>
    </React.StrictMode>

  );
};

export default LoginPage;