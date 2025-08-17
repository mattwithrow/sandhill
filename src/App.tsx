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
import VenturesPage from "./VenturesPage";
import ExpertsPage from "./ExpertsPage";
import MyAccountPage from "./MyAccountPage";
import PublicProfilePage from "./PublicProfilePage";
import MessagingPage from "./MessagingPage";
import AdminCleanup from "./components/AdminCleanup";
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
        <Route path="/profile/:username" element={<PublicProfilePage />} />
        <Route path="/my-account" element={
          <ProtectedRoute>
            <MyAccountPage />
          </ProtectedRoute>
        } />
        <Route path="/ventures" element={
          <ProtectedRoute>
            <VenturesPage />
          </ProtectedRoute>
        } />
        <Route path="/experts" element={
          <ProtectedRoute>
            <ExpertsPage />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagingPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/cleanup" element={
          <ProtectedRoute>
            <AdminCleanup />
          </ProtectedRoute>
        } />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
