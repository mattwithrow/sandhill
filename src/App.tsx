//import { useEffect, useState } from "react";
//import type { Schema } from "../amplify/data/resource";
//import { useAuthenticator } from '@aws-amplify/ui-react';
//import { generateClient } from "aws-amplify/data";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AboutPage from "./AboutPage";
import StartPage from "./StartPage";
import LoginPage from "./LoginPage";
import AuthHomePage from "./AuthHomePage";

//const client = generateClient<Schema>();

function App() {
  return (
    <BrowserRouter>
      <Layout>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/auth_home" element={<AuthHomePage />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
