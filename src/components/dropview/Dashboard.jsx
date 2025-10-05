import { useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.jsx';
import { 
  Package, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Gift,
  Calendar,
  Star,
  Users,
  Share2,
  X,
  Sparkles,
  Settings,
  User,
  LogOut,
  Menu,
  Home,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AuthContext } from '../../Context/AuthContext';
import { referralService } from '../../services/referralService';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isNewUser, setIsNewUser } = useContext(AuthContext);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Fetch referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const data = await referralService.getReferralInfo();
        setReferralData(data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
        setShareMessage('Failed to load referral data. Please refresh the page.');
      }
    };

    if (user) {
      fetchReferralData();
    }
  }, [user]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show confetti and welcome modal for new users
  useEffect(() => {
    if (isNewUser && user) {
      // Start confetti immediately
      setShowConfetti(true);
      // Show modal after a short delay to let confetti be visible first
      setTimeout(() => setShowWelcomeModal(true), 500);
      // Stop confetti after 8 seconds (longer duration)
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [isNewUser, user]);

  const handleCloseWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
    setIsNewUser(false); // Reset new user flag
  }, [setIsNewUser]);

  // Handle share referral link
  const handleShareReferral = async () => {
    if (!referralData) {
      setShareMessage('Referral data not loaded. Please refresh the page.');
      return;
    }
    
    setShareLoading(true);
    setShareMessage('');
    
    try {
      const result = await referralService.shareReferralLink(referralData.referralLink, user?.name);
      
      if (result && result.success) {
        if (result.method === 'clipboard') {
          setShareMessage('Referral link copied to clipboard!');
        }
        // No message for native share as it's self-explanatory
      } else {
        setShareMessage('Failed to share. Please try again.');
      }
    } catch (error) {
      console.error('Error sharing referral:', error);
      setShareMessage('Failed to share. Please try again.');
    } finally {
      setShareLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showWelcomeModal) {
        handleCloseWelcomeModal();
      }
    };

    if (showWelcomeModal) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showWelcomeModal, handleCloseWelcomeModal]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const MobileMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30"
    >
      <div className="px-4 py-4 space-y-3">
        <Button 
          onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
          variant="outline"
          className="w-full justify-start border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button 
          onClick={() => { navigate('/community'); setMobileMenuOpen(false); }}
          variant="outline"
          className="w-full justify-start border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10"
        >
          <Users className="mr-2 h-4 w-4" />
          Community
        </Button>
        <button
          onClick={() => { setSidebarOpen(true); setMobileMenuOpen(false); }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <Settings className="h-5 w-5 text-[#A7DADC]" />
          <span className="text-[#2d2d2d]">Settings</span>
        </button>
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Beta Pioneer
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const Sidebar = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"
    >
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-xl text-[#2d2d2d]">Settings</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-[#2d2d2d]">{user?.name}</h3>
              <p className="text-sm text-[#2d2d2d]/70">{user?.email}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Beta Pioneer
          </Badge>
        </div>

        {/* Settings Menu */}
        <div className="space-y-2">
          <button 
            onClick={() => {
              setSidebarOpen(false);
              navigate('/settings/profile');
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <User className="h-5 w-5 text-[#A7DADC]" />
            <span className="text-[#2d2d2d]">Profile Information</span>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button>
          
          {/* <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Bell className="h-5 w-5 text-[#A7DADC]" />
            <span className="text-[#2d2d2d]">Notifications</span>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button> */}
          
          {/* <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Shield className="h-5 w-5 text-[#A7DADC]" />
            <span className="text-[#2d2d2d]">Privacy & Security</span>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button> */}
          
          {/* <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Settings className="h-5 w-5 text-[#A7DADC]" />
            <span className="text-[#2d2d2d]">Preferences</span>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button> */}
          
          {/* <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <HelpCircle className="h-5 w-5 text-[#A7DADC]" />
            <span className="text-[#2d2d2d]">Help & Support</span>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button> */}
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <button 
            onClick={() => {
              setSidebarOpen(false);
              // Use AuthContext logout
              window.location.href = '/login';
              localStorage.removeItem('token');
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <span className="text-red-600">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={400}
            colors={['#FFD1DC', '#A7DADC', '#FFB6C1', '#87CEEB', '#FFA07A', '#98FB98', '#FF69B4', '#00CED1']}
            gravity={0.3}
            wind={0.1}
          />
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseWelcomeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#A7DADC]/20 to-[#FFD1DC]/20 rounded-full translate-y-12 -translate-x-12" />
            
            {/* Close button */}
            <button
              onClick={handleCloseWelcomeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
              aria-label="Close welcome modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="font-display text-3xl text-[#2d2d2d] mb-2">
                  Welcome to DropView! 🎉
                </h2>
                <p className="text-[#2d2d2d]/70 text-lg">
                  Hi {user?.name}! You're now part of our exclusive community.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700">Your profile is all set up</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Gift className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-blue-700">Your first drop is coming soon</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm text-purple-700">You're a Beta Pioneer!</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-[#2d2d2d]/60">
                  We'll send you free products to try and review. Your honest feedback helps brands improve and other users make better decisions.
                </p>
                <Button
                  onClick={handleCloseWelcomeModal}
                  className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
                >
                  Let's Get Started!
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-[#2d2d2d]">
                  DropView
                </h1>
                <p className="text-sm text-[#2d2d2d]/70 hidden sm:block">
                  {user?.name}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10 px-6 py-2 rounded-full transition-all duration-300"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button 
                onClick={() => navigate('/community')}
                variant="outline"
                className="border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10 px-6 py-2 rounded-full transition-all duration-300"
              >
                Community
              </Button>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-full text-[#2d2d2d]/60 hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Beta Pioneer
              </Badge>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                Beta
              </Badge>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-[#2d2d2d]/60 hover:bg-gray-100 transition-colors"
                title="Menu"
                data-mobile-menu
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && <MobileMenu />}
          </AnimatePresence>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Coming Soon Section - NEW TOP SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl text-[#2d2d2d] mb-6">Coming Soon</h2>
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-[#FFD1DC]/10 to-[#A7DADC]/10">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] rounded-2xl flex items-center justify-center shadow-lg">
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="font-display text-2xl text-[#2d2d2d] mb-3">
                Your first Drop is coming soon. Stay tuned!
              </h3>
              <p className="text-[#2d2d2d]/70 max-w-md mx-auto">
                We're already in talks with brands to get you exclusive products.
              </p>
            </div>
          </Card>
        </motion.div>
        
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl text-[#2d2d2d] mb-6">Your DropView Journey</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Profile Created",
                description: "Account setup complete",
                icon: <CheckCircle className="h-6 w-6" />,
                completed: !!user,
                status: "complete"
              },
              {
                title: "Drop Received",
                description: user?.hasActiveDrop ? "Product in your hands" : "Product on the way",
                icon: <Package className="h-6 w-6" />,
                completed: user?.hasActiveDrop,
                status: user?.hasActiveDrop ? "complete" : "pending"
              },
              {
                title: "Review Submitted",
                description: user?.hasReviewed ? "Thank you for your feedback!" : "Share your experience",
                icon: <MessageSquare className="h-6 w-6" />,
                completed: user?.hasReviewed,
                status: user?.hasReviewed ? "complete" : user?.hasActiveDrop ? "active" : "upcoming"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.status === 'complete' 
                    ? 'border-green-200 bg-green-50' 
                    : step.status === 'active'
                    ? 'border-[#A7DADC] bg-[#A7DADC]/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    step.status === 'complete' 
                      ? 'bg-green-500 text-white' 
                      : step.status === 'active'
                      ? 'bg-[#A7DADC] text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2d2d2d]">{step.title}</h3>
                    <p className="text-sm text-[#2d2d2d]/70">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Be Part of the Launch - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl text-[#2d2d2d] mb-6">Be Part of the Launch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white rounded-xl">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#A7DADC]/20 w-fit mx-auto mb-4 group-hover:bg-[#A7DADC]/30 transition-colors">
                  <Users className="h-6 w-6 text-[#A7DADC]" />
                </div>
                <h3 className="font-display text-lg text-[#2d2d2d] mb-2">Community</h3>
                <p className="text-sm text-[#2d2d2d]/70 mb-4">
                  Connect with other reviewers and share experiences
                </p>
                <Button 
                  onClick={() => navigate('/community')}
                  variant="outline" 
                  className="w-full group-hover:bg-[#A7DADC]/10 border-[#A7DADC]/30 hover:border-[#A7DADC] transition-all"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Visit Community
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white rounded-xl">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#A7DADC]/20 w-fit mx-auto mb-4 group-hover:bg-[#A7DADC]/30 transition-colors">
                  <Users className="h-6 w-6 text-[#A7DADC]" />
                </div>
                <h3 className="font-display text-lg text-[#2d2d2d] mb-2">Invite Friends</h3>
                <p className="text-sm text-[#2d2d2d]/70 mb-2">
                  The more testers we have, the faster brands sign up.
                </p>
                {referralData && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-[#A7DADC]/20 to-[#FFD1DC]/20 rounded-lg border border-[#A7DADC]/30">
                    <p className="text-sm font-semibold text-[#2d2d2d] text-center">
                      {referralData.referralsCount} friend{referralData.referralsCount !== 1 ? 's' : ''} joined so far! 🎉
                    </p>
                  </div>
                )}
                <Button 
                  onClick={handleShareReferral}
                  disabled={shareLoading || !referralData}
                  variant="outline" 
                  className="w-full group-hover:bg-[#A7DADC]/10 border-[#A7DADC]/30 hover:border-[#A7DADC] transition-all disabled:opacity-50"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {shareLoading ? 'Sharing...' : 'Share Invite'}
                </Button>
                {shareMessage && (
                  <p className="mt-2 text-xs text-green-600">{shareMessage}</p>
                )}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Current Drop */}
        {user?.hasActiveDrop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl text-[#2d2d2d] mb-4">Your Current Drop</h2>
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzU1NzQwNjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Your current drop product"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-display text-xl mb-1">Renewal Skincare Set</h3>
                  <p className="text-sm opacity-90">Premium anti-aging collection</p>
                </div>
              </div>
              
              <div className="p-6">
                {!user?.hasReviewed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">Ready for review</span>
                    </div>
                    <p className="text-[#2d2d2d]/70 mb-4">
                      You've had time to try this product. Share your honest experience to be eligible for your next drop.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">What makes a good review?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Share how you used the product</li>
                        <li>• Mention what you liked and didn't like</li>
                        <li>• Be honest about your experience</li>
                        <li>• Include specific details that would help others</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/review')}
                      className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Write Your Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Review submitted</span>
                    </div>
                    <p className="text-[#2d2d2d]/70 mb-4">
                      Thank you for your honest feedback! You're now eligible for your next drop.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">What's next?</h4>
                      <p className="text-sm text-green-700">
                        We're reviewing your feedback and matching you with your next product. You'll receive an email when your next drop is ready.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl text-[#2d2d2d] mb-6">What to Expect</h2>
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="timeline" className="border-b border-gray-100">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#A7DADC]/20">
                      <Calendar className="h-5 w-5 text-[#A7DADC]" />
                    </div>
                    <span className="font-display text-lg text-[#2d2d2d]">Review Timeline</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-3 text-sm text-[#2d2d2d]/70 ml-11">
                    <p>• Try your product for at least 1 week</p>
                    <p>• Submit your review within 30 days</p>
                    <p>• Choose between text or video review</p>
                    <p>• Be eligible for your next drop after reviewing</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="guidelines" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#FFD1DC]/20">
                      <Star className="h-5 w-5 text-[#FFD1DC]" />
                    </div>
                    <span className="font-display text-lg text-[#2d2d2d]">Review Guidelines</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-3 text-sm text-[#2d2d2d]/70 ml-11">
                    <p>• Be honest and authentic in your feedback</p>
                    <p>• Include both positives and areas for improvement</p>
                    <p>• Help other users make informed decisions</p>
                    <p>• Follow community guidelines for respectful reviews</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </motion.div>


        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="p-6 bg-gradient-to-r from-[#FFD1DC]/10 to-[#A7DADC]/10 border-0">
            <h3 className="font-display text-xl text-[#2d2d2d] mb-4 text-center">
              Join Our Growing Community
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2d2d2d] mb-1">2,500+</div>
                <div className="text-sm text-[#2d2d2d]/70">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2d2d2d] mb-1">15K+</div>
                <div className="text-sm text-[#2d2d2d]/70">Products Reviewed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2d2d2d] mb-1">150+</div>
                <div className="text-sm text-[#2d2d2d]/70">Brand Partners</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar />}
      </AnimatePresence>
    </div>
  );
}