import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ResultsPage } from './pages/ResultsPage';
import { FixResumePage } from './pages/FixResumePage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { JobMatcherPage } from './pages/JobMatcherPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';
import { ResumeHistoryPage } from './pages/ResumeHistoryPage';
import { VersionComparisonPage } from './pages/VersionComparisonPage';

import { ErrorBoundary } from './components/ErrorBoundary';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analyzer" element={<AnalyzerPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/fix" element={<FixResumePage />} />
                  <Route path="/builder" element={<ResumeBuilderPage />} />
                  <Route path="/matcher" element={<JobMatcherPage />} />
                  <Route path="/guidance" element={<CareerGuidancePage />} />
                  <Route path="/history" element={<ResumeHistoryPage />} />
                  <Route path="/compare/:id" element={<VersionComparisonPage />} />
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
