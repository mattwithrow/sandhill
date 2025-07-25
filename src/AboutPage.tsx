// AboutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>About Page About</h1>
      <h1>More detailed information goes here.</h1> 
      <h1>Company contact info goes here.</h1> 
      <button onClick={handleNavigateToLogin}>Go to Login Page</button>
    </div>
  );
};

export default AboutPage;