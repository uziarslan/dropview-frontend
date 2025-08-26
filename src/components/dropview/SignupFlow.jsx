import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, ArrowRight, Mail, User, MapPin, Users, Info, Phone, Shirt, Palette, Headphones, Dumbbell, Lamp, Lock } from 'lucide-react';
import { AuthContext } from '../../Context/AuthContext';

export function SignupFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    username: '',
    password: '',
    name: '',
    phone: '',
    // Step 2: Address
    street: '',
    city: '',
    zip: '',
    // Step 3: Demographics
    ageRange: '',
    maritalStatus: '',
    stylePreference: '',
    genderIdentity: '',
    familySize: '',
    // Step 4: Product Preferences
    productPreferences: [],
    tryFrequency: ''
  });

  const { register } = useContext(AuthContext)

  const productCategories = [
    { 
      id: 'clothing', 
      label: 'Clothing & Fashion', 
      description: 'apparel, shoes, accessories',
      icon: <Shirt className="h-5 w-5" />
    },
    { 
      id: 'beauty', 
      label: 'Beauty & Skincare', 
      description: 'makeup, grooming, personal care',
      icon: <Palette className="h-5 w-5" />
    },
    { 
      id: 'electronics', 
      label: 'Electronics & Gadgets', 
      description: 'headphones, accessories',
      icon: <Headphones className="h-5 w-5" />
    },
    { 
      id: 'health', 
      label: 'Health & Fitness', 
      description: 'supplements, gym gear, sportswear',
      icon: <Dumbbell className="h-5 w-5" />
    },
    { 
      id: 'home', 
      label: 'Home & Lifestyle', 
      description: 'room décor, small appliances, accessories',
      icon: <Lamp className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error)
        console.error(error.response.data);
    }
  }

  const toggleProductPreference = (prefId) => {
    setFormData(prev => ({
      ...prev,
      productPreferences: prev.productPreferences.includes(prefId)
        ? prev.productPreferences.filter(p => p !== prefId)
        : [...prev.productPreferences, prefId]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.username && formData.password && formData.name && formData.phone;
      case 2:
        return formData.street && formData.city && formData.zip;
      case 3:
        return formData.ageRange && formData.maritalStatus && formData.stylePreference && formData.genderIdentity && formData.familySize;
      case 4:
        return formData.productPreferences.length > 0 && formData.tryFrequency;
      default:
        return false;
    }
  };

  const progress = (step / 4) * 100;
  const getProgressLabel = () => {
    switch (step) {
      case 1: return '25%';
      case 2: return '50%';
      case 3: return '75%';
      case 4: return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl text-[#2d2d2d] mb-2">Join DropView</h1>
          <p className="text-[#2d2d2d]/70">Help us match you with the perfect products</p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#2d2d2d]/70">Step {step} of 4</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#A7DADC]">{getProgressLabel()}</span>
              <span className="text-xs text-[#2d2d2d]/60">complete</span>
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-100" />
            <div 
              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="p-6 shadow-lg border-0 bg-white">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info with Phone */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-xl text-[#2d2d2d] mb-2">
                      Let's get to know you
                    </h2>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>We need your basic information to create your account and communicate with you about drops.</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#A7DADC]" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white border-gray-200 focus:border-[#A7DADC]"
                      />
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">We'll use this to personalize your experience</p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-[#A7DADC]" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-white border-gray-200 focus:border-[#A7DADC]"
                      />
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">For drop notifications and account updates</p>
                    </div>

                    <div>
                      <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-[#A7DADC]" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-white border-gray-200 focus:border-[#A7DADC]"
                      />
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">At least 8 characters recommended</p>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-[#A7DADC]" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-white border-gray-200 focus:border-[#A7DADC]"
                      />
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">For important delivery updates (we won't spam!)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex-1 bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-xl text-[#2d2d2d] mb-2">
                      Where should we send your drops?
                    </h2>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>We need your shipping address to send you free products. Your information is always secure and private.</p>
                    </div>
                    <p className="text-sm text-[#2d2d2d]/70 mt-3">Don't worry, we only ship within Pakistan for now! 📦</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="street" className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-[#A7DADC]" />
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street, Apt 4B"
                        value={formData.street}
                        onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                        className="bg-white border-gray-200 focus:border-[#A7DADC]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="block mb-2">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="bg-white border-gray-200 focus:border-[#A7DADC]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip" className="block mb-2">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          placeholder="94105"
                          value={formData.zip}
                          onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                          className="bg-white border-gray-200 focus:border-[#A7DADC]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex-1 bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Demographics */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-xl text-[#2d2d2d] mb-2">
                      Help us understand your household
                    </h2>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>This information helps us send products that are right for your household size and demographic.</p>
                    </div>
                    <p className="text-sm text-[#2d2d2d]/70 mt-3">We're almost there! Just a few more questions 🎯</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="block mb-2">Age Range</Label>
                      <Select value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="Select your age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-19">15–19</SelectItem>
                          <SelectItem value="20-24">20–24</SelectItem>
                          <SelectItem value="25-29">25–29</SelectItem>
                          <SelectItem value="30-34">30–34</SelectItem>
                          <SelectItem value="35-39">35–39</SelectItem>
                          <SelectItem value="40+">40+</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">Helps us match age-appropriate products</p>
                    </div>

                    <div>
                      <Label className="block mb-2">Marital Status</Label>
                      <Select value={formData.maritalStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, maritalStatus: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="Select your marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married-no-kids">Married (no kids)</SelectItem>
                          <SelectItem value="married-with-kids">Married (with kids)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">Helps us match family-appropriate products</p>
                    </div>

                    <div>
                      <Label className="block mb-2">Which of these styles feels most like you?</Label>
                      <Select value={formData.stylePreference} onValueChange={(value) => setFormData(prev => ({ ...prev, stylePreference: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="Select your style preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trendy">Trendy</SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="unique">Unique</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">Helps us curate products that match your aesthetic</p>
                    </div>

                    <div>
                      <Label className="block mb-2">Gender Identity</Label>
                      <Select value={formData.genderIdentity} onValueChange={(value) => setFormData(prev => ({ ...prev, genderIdentity: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="How do you identify?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="woman">Woman</SelectItem>
                          <SelectItem value="man">Man</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">Optional, but helps with targeted product matching</p>
                    </div>

                    <div>
                      <Label className="block mb-2">Family Size</Label>
                      <Select value={formData.familySize} onValueChange={(value) => setFormData(prev => ({ ...prev, familySize: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="How many people live in your household?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Just me (1 person)</SelectItem>
                          <SelectItem value="2">2 people</SelectItem>
                          <SelectItem value="3">3 people</SelectItem>
                          <SelectItem value="4">4 people</SelectItem>
                          <SelectItem value="5+">5+ people</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">This helps us understand your household needs better</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex-1 bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Product Preferences with Icons */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-xl text-[#2d2d2d] mb-2">
                      What products interest you most?
                    </h2>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>Select the categories you're most likely to shop for online. This helps us match you with relevant product drops.</p>
                    </div>
                    <p className="text-sm text-[#2d2d2d]/70 mt-3">Pick everything that excites you — no limits! ✨</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="block mb-4">
                        Which of the following product categories are you most likely to shop for online? 
                        <span className="text-sm font-normal text-gray-500 block mt-1">(Select all that apply)</span>
                      </Label>
                      <div className="space-y-3">
                        {productCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => toggleProductPreference(category.id)}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:shadow-md ${
                              formData.productPreferences.includes(category.id)
                                ? 'border-[#A7DADC] bg-gradient-to-r from-[#A7DADC]/10 to-[#FFD1DC]/10 shadow-sm'
                                : 'border-gray-200 hover:border-[#A7DADC]/50 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg transition-colors ${
                                formData.productPreferences.includes(category.id)
                                  ? 'bg-[#A7DADC] text-white'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-[#A7DADC]/20 group-hover:text-[#A7DADC]'
                              }`}>
                                {category.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-[#2d2d2d] mb-1">{category.label}</h4>
                                <p className="text-sm text-[#2d2d2d]/60">{category.description}</p>
                              </div>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                formData.productPreferences.includes(category.id)
                                  ? 'border-[#A7DADC] bg-[#A7DADC]'
                                  : 'border-gray-300 group-hover:border-[#A7DADC]/50'
                              }`}>
                                {formData.productPreferences.includes(category.id) && (
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="block mb-2">How often do you try new products?</Label>
                      <Select value={formData.tryFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, tryFrequency: value }))}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly - I love discovering new products</SelectItem>
                          <SelectItem value="monthly">Monthly - I try new things regularly</SelectItem>
                          <SelectItem value="quarterly">Every few months - I'm selective but open</SelectItem>
                          <SelectItem value="rarely">Rarely - I stick to what I know works</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#2d2d2d]/60 mt-1">This helps us time your drops perfectly</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepValid()}
                      className="flex-1 bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 disabled:opacity-50"
                    >
                      Complete Signup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-[#2d2d2d]/60">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Always free
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              No spam
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Secure & private
            </div>
          </div>
          <p className="text-xs text-[#2d2d2d]/50">
            Your information is secure and will only be used to match you with relevant products
          </p>
          <div className="pt-4 text-sm">
            <span className="text-[#2d2d2d]/60">Already have an account? </span>
            <button onClick={() => navigate('/login')} className="text-[#2d2d2d] underline underline-offset-4">
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}