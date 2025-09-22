import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import profileService from "../../services/profileService";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Heart, 
  Shirt, 
  Palette, 
  Headphones, 
  Dumbbell, 
  Lamp,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    phone: "",
    // Address
    street: "",
    city: "",
    zip: "",
    // Demographics
    ageRange: "",
    maritalStatus: "",
    stylePreference: "",
    genderIdentity: "",
    familySize: "",
    occupation: "",
    purchasePriorities: "",
    // Product Preferences
    productPreferences: [],
    tryFrequency: ""
  });

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

  const toggleProductPreference = (prefId) => {
    setFormData(prev => ({
      ...prev,
      productPreferences: prev.productPreferences.includes(prefId)
        ? prev.productPreferences.filter(p => p !== prefId)
        : [...prev.productPreferences, prefId]
    }));
  };

  // Load user profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setInitialLoading(true);
        const profileData = await profileService.getProfile();
        
        setFormData({
          name: profileData.name || "",
          email: profileData.username || "",
          phone: profileData.phone || "",
          street: profileData.address?.street || "",
          city: profileData.address?.city || "",
          zip: profileData.address?.zip || "",
          ageRange: profileData.ageRange || "",
          maritalStatus: profileData.maritalStatus || "",
          stylePreference: profileData.stylePreference || "",
          genderIdentity: profileData.genderIdentity || "",
          familySize: profileData.familySize || "",
          occupation: profileData.occupation || "",
          purchasePriorities: profileData.purchasePriorities || "",
          productPreferences: profileData.productPreferences || [],
          tryFrequency: profileData.tryFrequency || ""
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await profileService.updateProfile(formData);
      
      // Update the user context with new data
      if (response.user) {
        // Update the user in context (you might need to add an updateUser method to AuthContext)
        // For now, we'll just show success message
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="h-6 w-6 text-white" />
          </div>
          <p className="text-[#2d2d2d]/70">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
              className="border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-xl text-[#2d2d2d]">Profile Settings</h1>
              <p className="text-sm text-[#2d2d2d]/70">Manage your personal information and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Message Display */}
        {message.text && (
          <div className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
        {/* Basic Information */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg text-[#2d2d2d]">Basic Information</h2>
              <p className="text-sm text-[#2d2d2d]/70">Your personal details and contact information</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-[#A7DADC]" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-[#A7DADC]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-[#A7DADC]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-[#A7DADC]"
                />
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
              </div>

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
              </div>
            </div>
          </form>
        </Card>

        {/* Address Information */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg text-[#2d2d2d]">Shipping Address</h2>
              <p className="text-sm text-[#2d2d2d]/70">Where we'll send your product drops</p>
            </div>
          </div>

          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-[#A7DADC]"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
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
        </Card>

        {/* Demographics */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg text-[#2d2d2d]">Demographics</h2>
              <p className="text-sm text-[#2d2d2d]/70">Help us understand your household and lifestyle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <Label className="block mb-2">Gender Identity</Label>
              <Select value={formData.genderIdentity} onValueChange={(value) => setFormData(prev => ({ ...prev, genderIdentity: value }))}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                  <SelectValue placeholder="How do you identify?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
            </div>

            <div>
              <Label className="block mb-2">Occupation / Status</Label>
              <Select value={formData.occupation} onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                  <SelectValue placeholder="Select your occupation or status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="working-professional">Working Professional</SelectItem>
                  <SelectItem value="business-owner">Business Owner</SelectItem>
                  <SelectItem value="homemaker">Homemaker</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Product Preferences */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg text-[#2d2d2d]">Product Preferences</h2>
              <p className="text-sm text-[#2d2d2d]/70">Tell us what products you're interested in</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="block mb-4">
                Product Categories
                <span className="text-sm font-normal text-gray-500 block mt-1">(Select all that apply)</span>
              </Label>
              <div className="space-y-3">
                {productCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block mb-2">Style Preference</Label>
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
              </div>

              <div>
                <Label className="block mb-2">Purchase Priorities</Label>
                <Select value={formData.purchasePriorities} onValueChange={(value) => setFormData(prev => ({ ...prev, purchasePriorities: value }))}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                    <SelectValue placeholder="What matters most to you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-value">Price / value for money</SelectItem>
                    <SelectItem value="quality-reliability">Quality & reliability</SelectItem>
                    <SelectItem value="trend-style">Trend / style factor</SelectItem>
                    <SelectItem value="brand-reputation">Brand reputation</SelectItem>
                    <SelectItem value="sustainability-ethics">Sustainability & ethics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2">Try Frequency</Label>
                <Select value={formData.tryFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, tryFrequency: value }))}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-[#A7DADC]">
                    <SelectValue placeholder="How often do you try new products?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly - I love discovering new products</SelectItem>
                    <SelectItem value="monthly">Monthly - I try new things regularly</SelectItem>
                    <SelectItem value="quarterly">Every few months - I'm selective but open</SelectItem>
                    <SelectItem value="rarely">Rarely - I stick to what I know works</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 px-8 py-3"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}


