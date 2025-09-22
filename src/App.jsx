import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// DropView screens
import { LandingPage } from './components/dropview/LandingPage';
import { SignupFlow } from './components/dropview/SignupFlow';
import { Dashboard } from './components/dropview/Dashboard';
import { ReviewFlow } from './components/dropview/ReviewFlow';
import { Community } from './components/dropview/Community';
import { Login } from './components/dropview/Login';
import { AuthContext } from './Context/AuthContext';
import ProfileSettings from './components/dropview/ProfileSettings.jsx';
import Notifications from './components/dropview/Notifications.jsx';

export default function App() {
  const { user, isLoading } = useContext(AuthContext);

  const isAuthed = !!user;

  const handleReviewComplete = () => { };
  
  if (isLoading) return

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
                  <Login />
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
                <SignupFlow />
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
                  <Dashboard />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          {/* Profile Settings - Protected */}
          <Route 
            path="/settings/profile" 
            element={
              isAuthed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileSettings />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Notifications - Protected */}
          <Route 
            path="/settings/notifications" 
            element={
              isAuthed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Notifications />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Community - Public (gated actions inside) */}
          <Route
            path="/community"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Community />
              </motion.div>
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