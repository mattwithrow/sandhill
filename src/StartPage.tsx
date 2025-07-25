// StartPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToAbout = () => {
    navigate('/about');
  };
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <div style={{position:"absolute", float: "right", top:0, right:30}}>
        <button onClick={handleNavigateToAbout}>Go to About Page</button>
      </div>

      <h1>Start Page. Company Name and Initial Statement go here.</h1>
      <h1>Info on what it's all about goes here...</h1> 
      <button onClick={handleNavigateToLogin}>Go to Login Page</button>
    </div>

  );
};

export default StartPage;