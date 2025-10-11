import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowRight, Package, MessageSquare, CheckCircle, Gift, Users, Star, Menu, X } from 'lucide-react';
import { AuthContext } from '../../Context/AuthContext';
import { 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
} from '@mui/material';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const NavigationButtons = () => (
    <>
      {user ? (
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleNavigation('/community')}
            variant="outline"
            className="border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10 px-6 py-2 rounded-full transition-all duration-300"
          >
            Community
          </Button>
          <Button 
            onClick={() => handleNavigation('/dashboard')}
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Dashboard
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => handleNavigation('/login')}
            variant="outline"
            className="border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10 px-6 py-2 rounded-full transition-all duration-300"
          >
            Login
          </Button>
          <Button 
            onClick={() => handleNavigation('/signup')}
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>
      )}
    </>
  );

  // Drawer animation variants for framer-motion
  const drawerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 40 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } }
  };

  const MobileDrawer = () => (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1300,
              width: 280,
              background: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                    <Gift className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-display text-lg text-[#2d2d2d]">DropView</span>
                </div>
                <IconButton onClick={handleDrawerToggle}>
                  <X className="h-5 w-5 text-[#2d2d2d]" />
                </IconButton>
              </div>
              
              <List>
                {user ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigation('/dashboard')}
                        sx={{
                          borderRadius: '12px',
                          marginBottom: '8px',
                          background: 'linear-gradient(135deg, #FFD1DC 0%, #A7DADC 100%)',
                          color: '#2d2d2d',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ListItemText 
                          primary="Dashboard" 
                          primaryTypographyProps={{
                            style: { fontWeight: 600, fontSize: '16px' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigation('/community')}
                        sx={{
                          borderRadius: '12px',
                          marginBottom: '8px',
                          border: '2px solid #A7DADC',
                          color: '#2d2d2d',
                          '&:hover': {
                            backgroundColor: 'rgba(167, 218, 220, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ListItemText 
                          primary="Community" 
                          primaryTypographyProps={{
                            style: { fontWeight: 600, fontSize: '16px' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigation('/community')}
                        sx={{
                          borderRadius: '12px',
                          marginBottom: '8px',
                          border: '2px solid #A7DADC',
                          color: '#2d2d2d',
                          '&:hover': {
                            backgroundColor: 'rgba(167, 218, 220, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ListItemText 
                          primary="Community" 
                          primaryTypographyProps={{
                            style: { fontWeight: 600, fontSize: '16px' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigation('/login')}
                        sx={{
                          borderRadius: '12px',
                          marginBottom: '8px',
                          border: '2px solid #A7DADC',
                          color: '#2d2d2d',
                          '&:hover': {
                            backgroundColor: 'rgba(167, 218, 220, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ListItemText 
                          primary="Login" 
                          primaryTypographyProps={{
                            style: { fontWeight: 600, fontSize: '16px' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigation('/signup')}
                        sx={{
                          borderRadius: '12px',
                          marginBottom: '8px',
                          background: 'linear-gradient(135deg, #FFD1DC 0%, #A7DADC 100%)',
                          color: '#2d2d2d',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ListItemText 
                          primary="Sign Up" 
                          primaryTypographyProps={{
                            style: { fontWeight: 600, fontSize: '16px' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                )}
              </List>
            </div>
          </motion.div>
          {/* Transparent Overlay for closing drawer when clicking outside */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'transparent',
              zIndex: 1299,
              pointerEvents: 'auto'
            }}
            onClick={handleDrawerToggle}
          />
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
            <Gift className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl text-[#2d2d2d]">DropView</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationButtons />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <IconButton onClick={handleDrawerToggle}>
            <Menu className="h-6 w-6 text-[#2d2d2d]" />
          </IconButton>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-6xl text-[#2d2d2d] mb-6 leading-tight">
            Get Free Products.<br />
            Share Honest Reviews.<br />
            <span className="text-transparent bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] bg-clip-text">
              Shape the Future of Brands.
            </span>
          </h1>
          
          <p className="text-xl text-[#2d2d2d]/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join a community of authentic reviewers who get exclusive access to new products in exchange for honest feedback.
          </p>

          <Button 
            onClick={() => navigate(user ? '/dashboard' : '/signup')}
            size="lg" 
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {user ? 'Go to Dashboard' : 'Join a Drop Now'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 mb-20">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-[#2d2d2d]/70">4.8/5 satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#A7DADC]" />
              <span className="text-sm text-[#2d2d2d]/70">2,500+ active members</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#A7DADC]" />
              <span className="text-sm text-[#2d2d2d]/70">150+ brand partners</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works - Process Diagram */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl text-[#2d2d2d] mb-4">
            How DropView Works
          </h2>
          <p className="text-lg text-[#2d2d2d]/70 max-w-2xl mx-auto">
            A simple 5-step journey to earn free products and share your authentic experience with brands that value your feedback
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Signup",
                description: "Create your profile and answer a few quick questions to help us understand your interests.",
                icon: <Users className="h-8 w-8" />,
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02", 
                title: "Earn",
                description: "Create your profile and answer a few quick questions to help us understand your interests.",
                icon: <Star className="h-8 w-8" />,
                color: "from-yellow-500 to-yellow-600"
              },
              {
                step: "03",
                title: "Receive Products",
                description: "Get free products delivered to your door to try and review.",
                icon: <Package className="h-8 w-8" />,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "04",
                title: "Give Reviews",
                description: "Share your honest experience through detailed reviews.",
                icon: <MessageSquare className="h-8 w-8" />,
                color: "from-green-500 to-green-600"
              },
              {
                step: "05",
                title: "Get More Free Drops",
                description: "Continue receiving more products as you share authentic feedback.",
                icon: <Gift className="h-8 w-8" />,
                color: "from-pink-500 to-pink-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-medium text-[#A7DADC] mb-2 tracking-wider">STEP {item.step}</div>
                  <h3 className="font-display text-lg text-[#2d2d2d] mb-3">{item.title}</h3>
                  <p className="text-[#2d2d2d]/70 text-sm leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-gradient-to-br from-[#FFD1DC]/10 to-[#A7DADC]/10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-[#2d2d2d] mb-6">
              Why Brands Choose DropView
            </h2>
            <p className="text-lg text-[#2d2d2d]/70 mb-12 max-w-3xl mx-auto">
              We connect brands with real people who provide authentic, detailed feedback that helps improve products and build trust with future customers.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Authentic Reviews",
                  description: "Real people, real experiences, real feedback",
                  icon: <CheckCircle className="h-6 w-6" />
                },
                {
                  title: "Detailed Insights",
                  description: "Both text and video reviews for comprehensive feedback", 
                  icon: <MessageSquare className="h-6 w-6" />
                },
                {
                  title: "Quality Community",
                  description: "Carefully curated reviewers who care about honesty",
                  icon: <Users className="h-6 w-6" />
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#A7DADC]/20 flex items-center justify-center mx-auto mb-4 text-[#A7DADC]">
                    {benefit.icon}
                  </div>
                  <h3 className="font-display text-xl text-[#2d2d2d] mb-2">{benefit.title}</h3>
                  <p className="text-[#2d2d2d]/70 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="font-display text-4xl text-[#2d2d2d] mb-4">
            Community
          </h2>
          <h3 className="font-display text-2xl text-[#2d2d2d]/80 mb-6">
            Where Smart Shopping Begins
          </h3>
          <p className="text-lg text-[#2d2d2d]/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ask before buying, share experiences, help others shop smarter. Join thousands of authentic reviewers making informed decisions together.
          </p>
          
          <Button 
            onClick={() => handleNavigation('/community')}
            size="lg"
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Visit Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-[#2d2d2d] mb-4">
            What Our Community Says
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah M.",
              review: "I love trying new skincare products before they hit the market. The brands really listen to our feedback!",
              rating: 5
            },
            {
              name: "Mike K.",
              review: "Been part of DropView for 6 months. The product quality is amazing and the process is so simple.",
              rating: 5
            },
            {
              name: "Emma L.",
              review: "Finally found a platform where my honest opinions actually matter. The video reviews are fun to make too!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#2d2d2d]/70 mb-4 italic">"{testimonial.review}"</p>
              <p className="font-medium text-[#2d2d2d]">– {testimonial.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-[#FFD1DC]/10 to-[#A7DADC]/10 rounded-3xl p-12"
        >
          <h2 className="font-display text-3xl md:text-4xl text-[#2d2d2d] mb-4">
            Ready to Join DropView?
          </h2>
          <p className="text-lg text-[#2d2d2d]/70 mb-8">
            Start receiving free products and sharing your authentic reviews today
          </p>
          
          <Button 
            onClick={() => navigate(user ? '/dashboard' : '/signup')}
            size="lg"
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {user ? 'Go to Dashboard' : 'Join a Drop Now'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#2d2d2d]/60">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Always free
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No commitments
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Real products
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2d2d] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <Gift className="h-3 w-3 text-white" />
            </div>
            <span className="font-display text-xl">DropView</span>
          </div>
          <p className="text-white/70">
            Connecting authentic reviewers with innovative brands
          </p>
        </div>
      </footer>
    </div>
  );
}