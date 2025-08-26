import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// DropView screens
import { LandingPage } from './components/dropview/LandingPage';
import { SignupFlow } from './components/dropview/SignupFlow';
import { Dashboard } from './components/dropview/Dashboard';
import { ReviewFlow } from './components/dropview/ReviewFlow';
import { Login } from './components/dropview/Login';

export default function App() {
  const [userProgress, setUserProgress] = useState({
    signedUp: false,
    hasActiveDrop: false,
    hasReviewed: false,
    loggedIn: false,
  });
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    totalReviews: 0
  });

  const handleProgressUpdate = (updates) => {
    setUserProgress(prev => ({ ...prev, ...updates }));
  };

  const handleSignupComplete = (name, formData) => {
    setUserProfile(prev => ({
      ...prev,
      name,
      email: formData.email,
      phone: formData.phone
    }));
    
    handleProgressUpdate({ signedUp: true, hasActiveDrop: true, loggedIn: true });
  };

  const handleLogin = (email) => {
    setUserProfile(prev => ({
      ...prev,
      email: email || prev.email,
    }));
    handleProgressUpdate({ loggedIn: true });
  };

  const handleReviewComplete = () => {
    setUserProfile(prev => ({
      ...prev,
      totalReviews: prev.totalReviews + 1
    }));
    
    handleProgressUpdate({ hasReviewed: true });
  };

  const isAuthed = userProgress.signedUp || userProgress.loggedIn;

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page - Default route */}
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage />
              </motion.div>
            } 
          />

          {/* Login - redirect to dashboard if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthed ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login onLogin={handleLogin} />
                </motion.div>
              )
            } 
          />
          
          {/* Signup Flow */}
          <Route 
            path="/signup" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupFlow 
                  onComplete={handleSignupComplete}
                />
              </motion.div>
            } 
          />
          
          {/* Dashboard - Protected route (requires auth) */}
          <Route 
            path="/dashboard" 
            element={
              isAuthed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard 
                    userProgress={userProgress}
                    userProfile={userProfile}
                  />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Review Flow - Protected route (requires auth) */}
          <Route 
            path="/review" 
            element={
              isAuthed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewFlow 
                    onComplete={handleReviewComplete}
                    userProfile={userProfile}
                  />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Catch all route - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}