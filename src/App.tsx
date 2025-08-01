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
import IdeasPage from "./IdeasPage";
import BuildersPage from "./BuildersPage";
import MyAccountPage from "./MyAccountPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/my-account" element={
          <ProtectedRoute>
            <MyAccountPage />
          </ProtectedRoute>
        } />
        <Route path="/ideas" element={
          <ProtectedRoute>
            <IdeasPage />
          </ProtectedRoute>
        } />
        <Route path="/builders" element={
          <ProtectedRoute>
            <BuildersPage />
          </ProtectedRoute>
        } />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
