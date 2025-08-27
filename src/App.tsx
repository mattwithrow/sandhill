import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { UnreadMessagesProvider } from "./contexts/UnreadMessagesContext";

// Lazy load pages for better performance
const AboutPage = lazy(() => import("./AboutPage"));
const StartPage = lazy(() => import("./StartPage"));
const AuthHomePage = lazy(() => import("./AuthHomePage"));
const VenturesPage = lazy(() => import("./VenturesPage"));
const ExpertsPage = lazy(() => import("./ExpertsPage"));
const MyAccountPage = lazy(() => import("./MyAccountPage"));
const PublicProfilePage = lazy(() => import("./PublicProfilePage"));
const MessagingPage = lazy(() => import("./MessagingPage"));
const AdminCleanup = lazy(() => import("./components/AdminCleanup"));

//const client = generateClient<Schema>();

// Loading component for lazy-loaded pages
const PageLoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <UnreadMessagesProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageLoadingSpinner />}>
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
            </Suspense>
          </Layout>
        </BrowserRouter>
      </UnreadMessagesProvider>
    </ErrorBoundary>
  );
}

export default App;
