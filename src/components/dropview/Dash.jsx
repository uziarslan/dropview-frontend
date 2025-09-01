import { motion } from 'framer-motion';
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
  Lightbulb,
  Share2,
  ExternalLink,
  Lock
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Dash() {
  const userProgress = {
    signedUp: true,
    hasActiveDrop: true,
    hasReviewed: true,
  };

  const userProfile = {
    name: "John Doe",
  };

  const onStartReview = () => {
    alert("Starting review with dummy data!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-[#2d2d2d]">
                  DropView
                </h1>
                <p className="text-sm text-[#2d2d2d]/70">
                  {userProfile.name || 'Beta Tester'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Beta Pioneer
              </Badge>
              <p className="text-xs text-[#2d2d2d]/60">
                Early access badge — will unlock perks when first drops launch
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Your DropView Journey - UPDATED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl text-[#2d2d2d] mb-6">Your DropView Journey</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Profile Created",
                description: "Account setup complete",
                icon: <CheckCircle className="h-6 w-6" />,
                completed: userProgress.signedUp,
                status: "complete"
              },
              {
                title: "Drop Received",
                description: userProgress.hasActiveDrop ? "Product in your hands" : "Drop Received",
                subtext: userProgress.hasActiveDrop ? null : "🔒 Unlocked when the first products go live.",
                icon: userProgress.hasActiveDrop ? <Package className="h-6 w-6" /> : <Lock className="h-6 w-6" />,
                completed: userProgress.hasActiveDrop,
                status: userProgress.hasActiveDrop ? "complete" : "locked"
              },
              {
                title: "Review Submitted",
                description: userProgress.hasReviewed ? "Thank you for your feedback!" : "Review Submitted",
                subtext: userProgress.hasReviewed ? null : "🔒 Be the first to share your voice.",
                icon: userProgress.hasReviewed ? <MessageSquare className="h-6 w-6" /> : <Lock className="h-6 w-6" />,
                completed: userProgress.hasReviewed,
                status: userProgress.hasReviewed ? "complete" : "locked"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.status === 'complete' 
                    ? 'border-green-200 bg-green-50' 
                    : step.status === 'active'
                    ? 'border-[#A7DADC] bg-[#A7DADC]/10'
                    : step.status === 'locked'
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    step.status === 'complete' 
                      ? 'bg-green-500 text-white' 
                      : step.status === 'active'
                      ? 'bg-[#A7DADC] text-white'
                      : step.status === 'locked'
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#2d2d2d]">{step.title}</h3>
                    <p className="text-sm text-[#2d2d2d]/70">{step.description}</p>
                    {step.subtext && (
                      <p className="text-xs text-[#2d2d2d]/50 mt-1">{step.subtext}</p>
                    )}
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
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white rounded-xl">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#FFD1DC]/20 w-fit mx-auto mb-4 group-hover:bg-[#FFD1DC]/30 transition-colors">
                  <Lightbulb className="h-6 w-6 text-[#FFD1DC]" />
                </div>
                <h3 className="font-display text-lg text-[#2d2d2d] mb-2">Suggest a Brand</h3>
                <p className="text-sm text-[#2d2d2d]/70 mb-4">
                  Which brand do you want us to onboard first?
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-[#FFD1DC]/10 border-[#FFD1DC]/30 hover:border-[#FFD1DC] transition-all"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Submit Suggestion
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white rounded-xl">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#A7DADC]/20 w-fit mx-auto mb-4 group-hover:bg-[#A7DADC]/30 transition-colors">
                  <Users className="h-6 w-6 text-[#A7DADC]" />
                </div>
                <h3 className="font-display text-lg text-[#2d2d2d] mb-2">Invite Friends</h3>
                <p className="text-sm text-[#2d2d2d]/70 mb-4">
                  The more testers we have, the faster brands sign up.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-[#A7DADC]/10 border-[#A7DADC]/30 hover:border-[#A7DADC] transition-all"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Invite
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white rounded-xl">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#F8F1E9] w-fit mx-auto mb-4 group-hover:bg-[#F8F1E9]/80 transition-colors">
                  <MessageSquare className="h-6 w-6 text-[#2d2d2d]" />
                </div>
                <h3 className="font-display text-lg text-[#2d2d2d] mb-2">Give Feedback</h3>
                <p className="text-sm text-[#2d2d2d]/70 mb-4">
                  Tell us how to make DropView better.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-[#F8F1E9]/50 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* What to Expect - SIMPLIFIED ACCORDION */}
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

        {/* Current Drop - Only shown if user has active drop */}
        {userProgress.hasActiveDrop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl text-[#2d2d2d] mb-4">Your Current Drop</h2>
            <Card className="overflow-hidden shadow-lg border-0 rounded-xl">
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
                {!userProgress.hasReviewed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">Ready for review</span>
                    </div>
                    <p className="text-[#2d2d2d]/70 mb-4">
                      You've had time to try this product. Share your honest experience to be eligible for your next drop.
                    </p>
                    
                    <Button 
                      onClick={onStartReview}
                      className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 transition-all"
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

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="text-center py-8 border-t border-gray-100">
            <div className="flex justify-center gap-8 text-sm text-[#2d2d2d]/60">
              <a href="/about" className="hover:text-[#2d2d2d] transition-colors">About</a>
              <a href="/terms" className="hover:text-[#2d2d2d] transition-colors">Terms</a>
              <a href="/contact" className="hover:text-[#2d2d2d] transition-colors">Contact</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}