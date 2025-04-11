import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import BlogPage from './app/blog/BlogPage';
import BlogPostPage from './app/blog/BlogPostPage';
import BountyPage from './components/BountyPage';
import { CreateBountyForm } from './components/CreateBountyForm';
import { CreateOrganisationForm } from './components/CreateOrganisationForm';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { Navbar } from './components/navbar';
import SettingsPage from './components/SettingsPage';
import { ThemeProvider } from './components/theme-provider';
import WaitlistFormPage from './components/WaitlistFormPage';
import { createTrpcClient, trpc } from './utils/trpc';

export const defaultPage = '/home';
export const LINK_TO_WAITLIST = process.env.REACT_APP_LINK_TO_WAITLIST === 'true'; // Toggle this to control the flow after login

// Existing ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: userData, isLoading } = trpc.auth.getUser.useQuery(
    { token: localStorage.getItem('accessToken') || '' },
    {
      enabled: !!localStorage.getItem('accessToken'),
    }
  );

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
      return;
    }

    if (!isLoading && userData?.isWaitlisted) {
      navigate('/waitlist-form');
    }
  }, [userData, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <>
      <Helmet>
        <title>Zcash Bounties</title>
        <meta
          name="description"
          content="Zcash Bounties is a platform for finding and completing bounties on Zcash."
        />
        <meta property="og:title" content="Zcash Bounties" />
        <meta
          property="og:description"
          content="Zcash Bounties is a platform for finding and completing bounties on Zcash."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://unstoppableprivatemoney.com/linkpreview.png" />
        <meta property="og:url" content="https://unstoppableprivatemoney.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zcash Bounties" />
        <meta
          name="twitter:description"
          content="Zcash Bounties is a platform for finding and completing bounties on Zcash."
        />
        <meta name="twitter:image" content="https://unstoppableprivatemoney.com/linkpreview.png" />
        <link rel="canonical" href="https://unstoppableprivatemoney.com" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground w-full">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            }
          />
          {/* Protect these routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Leave these routes unprotected */}
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24">
                  <LoginPage />
                </div>
              </>
            }
          />
          <Route
            path="/waitlist-form"
            element={
              <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24">
                  <WaitlistFormPage />
                </div>
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24">
                  <BlogPage />
                </div>
              </>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24">
                  <BlogPostPage />
                </div>
              </>
            }
          />
          {/* Add new protected route */}
          <Route
            path="/create-organisation"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8 pt-24">
                  <h1 className="text-2xl font-bold mb-8">Create Organisation</h1>
                  <CreateOrganisationForm />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-bounty"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8 pt-24">
                  <h1 className="text-2xl font-bold mb-8">Create Bounty</h1>
                  <CreateBountyForm />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bounty/:id"
            element={
              <ProtectedRoute>
                <div className="container mx-auto">
                  <BountyPage />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() => createTrpcClient());

  return (
    <TooltipProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <ThemeProvider defaultTheme="system" storageKey="deeptable-theme">
              <Router>
                <SidebarProvider>
                  <AppContent />
                </SidebarProvider>
              </Router>
            </ThemeProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </TooltipProvider>
  );
}

export default App;
