import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  ArrowLeft, 
  Users, 
  Gift, 
  Copy, 
  Share2, 
  Crown, 
  Star,
  MessageCircle,
  Mail,
  Smartphone,
  ExternalLink,
  CheckCircle,
  Trophy,
  Zap
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function ReferralFlow({ onBack }) {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const referralCode = "DROP-ALEX-2024";
  const referralLink = `https://dropview.app/join/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = "🎁 I just got my first DropView package and it's amazing! Join me and get your first drop FREE. Limited spots available!";

  const shareOptions = [
    {
      id: 'text',
      name: 'Text Message',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'bg-green-100 text-green-700 border-green-200',
      action: () => window.open(`sms:?body=${encodeURIComponent(shareMessage + ' ' + referralLink)}`)
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      action: () => window.open(`mailto:?subject=Get your first DropView drop FREE!&body=${encodeURIComponent(shareMessage + '\n\n' + referralLink)}`)
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: <Share2 className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Get your first DropView drop FREE!',
            text: shareMessage,
            url: referralLink
          });
        }
      }
    }
  ];

  const mockFriends = [
    { name: 'Sarah Kim', status: 'pending', avatar: 'SK' },
    { name: 'Mike Chen', status: 'joined', avatar: 'MC' },
    { name: 'Emma Wilson', status: 'pending', avatar: 'EW' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/20 via-white to-[#A7DADC]/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#FFD1DC]/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-[#FFD1DC]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Crown className="h-3 w-3 mr-1" />
              Premium Referrals Unlocked
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-3xl text-[#2d2d2d] mb-4">
            Invite Friends & Earn Together
          </h1>
          <p className="text-lg text-[#2d2d2d]/70 max-w-2xl mx-auto">
            Your friends are missing out! Share DropView and you both get exclusive premium drops when they join.
          </p>
        </motion.div>

        {/* FOMO Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg text-red-800 mb-1">Limited Time Offer</h3>
                <p className="text-sm text-red-700">
                  Only <strong>127 spots left</strong> for January drops. Your friends need to join soon!
                </p>
              </div>
            </div>
            <div className="text-xs text-red-600 mt-2 text-center">⏰ Metric: FOMO Conversion Rate</div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Sharing */}
          <div className="space-y-6">
            {/* Share Your Link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="font-display text-xl text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-[#A7DADC]" />
                  Share Your Referral Link
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="bg-gray-50 border-[#FFD1DC]/30"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="px-4 border-[#A7DADC]/30 hover:bg-[#A7DADC]/10"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Link copied to clipboard!
                    </motion.div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-[#2d2d2d] mb-3">Quick Share Options</h3>
                  <div className="grid gap-3">
                    {shareOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] ${option.color}`}
                      >
                        {option.icon}
                        <span className="font-medium">{option.name}</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-blue-600 mt-4">📱 Metric: Share Method Preference</div>
              </Card>
            </motion.div>

            {/* Rewards Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-r from-[#FFD1DC]/10 to-[#A7DADC]/10">
                <h2 className="font-display text-xl text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-600" />
                  What You Both Get
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#2d2d2d]">Premium Drop Access</div>
                      <div className="text-sm text-[#2d2d2d]/70">Exclusive high-value products</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#2d2d2d]">Bonus Points</div>
                      <div className="text-sm text-[#2d2d2d]/70">500 points each when they join</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#2d2d2d]">VIP Status</div>
                      <div className="text-sm text-[#2d2d2d]/70">Early access to new categories</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats & Community */}
          <div className="space-y-6">
            {/* Your Referral Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="font-display text-xl text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Your Referral Progress
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#FFD1DC]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#2d2d2d] mb-1">3</div>
                    <div className="text-sm text-[#2d2d2d]/70">Friends Invited</div>
                    <div className="text-xs text-blue-600 mt-1">📊 Metric: Invites Sent</div>
                  </div>
                  <div className="text-center p-4 bg-[#A7DADC]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#2d2d2d] mb-1">1</div>
                    <div className="text-sm text-[#2d2d2d]/70">Successfully Joined</div>
                    <div className="text-xs text-green-600 mt-1">✅ Metric: Conversion Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-[#2d2d2d]">Friend Activity</h3>
                  {mockFriends.map((friend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#FFD1DC]/20 text-[#2d2d2d] text-xs">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[#2d2d2d]">{friend.name}</span>
                      </div>
                      <Badge
                        className={
                          friend.status === 'joined'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }
                      >
                        {friend.status === 'joined' ? '✅ Joined' : '⏳ Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="font-display text-xl text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#A7DADC]" />
                  What Friends Are Saying
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-xs">JS</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-blue-800">Jessica S.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-blue-700">
                      "Thanks for the invite! Got my first drop yesterday and it's incredible. The curation is spot-on!"
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-green-200 text-green-700 text-xs">DL</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-green-800">David L.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      "Best discovery platform ever! Already invited 5 more friends. We're all obsessed! 🤩"
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-purple-600 mt-4">💬 Metric: Social Proof Engagement</div>
              </Card>
            </motion.div>

            {/* Community Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1753161021236-76b0bdffb39f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwc2hhcmluZyUyMHNvY2lhbCUyMG1lZGlhfGVufDF8fHx8MTc1NTc0MDc2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Friends sharing social media"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD1DC]/80 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="text-lg font-display mb-1">Join 1,247+ Happy Members</div>
                    <div className="text-sm opacity-90">Building the future of product discovery together</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Card className="p-6 bg-gradient-to-r from-[#FFD1DC]/20 to-[#A7DADC]/20 border-0">
            <h3 className="font-display text-xl text-[#2d2d2d] mb-2">Ready to Share the Love?</h3>
            <p className="text-[#2d2d2d]/70 mb-4">
              The more friends you invite, the more exclusive drops you both unlock!
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Link Copied!' : 'Copy Referral Link'}
              </Button>
            </div>
            <div className="text-xs text-orange-600 mt-4">🚀 Metric: Referral Rate & Viral Coefficient</div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}