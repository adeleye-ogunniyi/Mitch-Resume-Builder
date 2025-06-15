import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './contexts/ResumeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/Toaster';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Builder from './pages/Builder';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <div className="min-h-screen bg-slate-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                }
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute requireAuth>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;