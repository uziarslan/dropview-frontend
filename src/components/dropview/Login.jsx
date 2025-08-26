import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Mail, Lock, Gift, Info } from 'lucide-react';
import { AuthContext } from '../../Context/AuthContext';

export function Login({ onLogin }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.username || !formData.password) return;
    
    try {
      login(formData);
      navigate("/dashboard");
    }catch (error) {
      if (error.response && error.response.data && error.response.data.error)
        console.error(error.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
            <Gift className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl text-[#2d2d2d]">DropView</span>
        </div>
      </header>

      <section className="max-w-md mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 border-0 shadow-lg">
            <h1 className="font-display text-2xl text-[#2d2d2d] mb-z">Welcome back</h1>
            <p className="text-sm text-[#2d2d2d]/70">
              Sign in to manage your drops, track review progress, and update your preferences.
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Your email helps us keep your product drops and account secure.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2d2d2d]/60" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username:e.target.value})}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2d2d2d]/60" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password:e.target.value})}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="pt-4 text-sm text-center">
              <span className="text-[#2d2d2d]/60">New to DropView? </span>
              <button onClick={() => navigate('/signup')} className="text-[#2d2d2d] underline underline-offset-4">
                Create an account
              </button>
            </div>
          </Card>
        </motion.div>
      </section>

      <div className="text-center -mt-6 space-y-2">
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
          We only use your details to match you with relevant product drops
        </p>
      </div>
    </div>
  );
}
