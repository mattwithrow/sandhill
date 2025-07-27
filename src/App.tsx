//import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
//import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./AboutPage";
import StartPage from "./StartPage";
import LoginPage from "./LoginPage";
import AuthHomePage from "./AuthHomePage";

//const client = generateClient<Schema>();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/auth_home" element={<AuthHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
