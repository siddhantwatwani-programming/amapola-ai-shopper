import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import logoAmapola from '@/assets/logo-amapola.png';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || password.length < 6) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid email and password (min 6 characters)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: firstName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
      } else if (data.user && !data.session) {
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link. Please verify your email to sign in.',
        });
        navigate('/login');
      } else {
        // Auto-confirmed, update profile
        if (data.user) {
          await supabase.from('profiles').update({
            first_name: firstName.trim() || null,
            phone: phone.trim() || null,
          }).eq('user_id', data.user.id);
        }
        navigate('/welcome', { replace: true });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logoAmapola} alt="Amapola" className="h-20 w-auto object-contain mb-3 md:h-24" />
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join Amapola Market</p>
        </div>

        <div className="space-y-3 mb-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="h-14 rounded-xl text-base pl-12 border border-border focus:border-primary"
              autoFocus
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9()\-\s+]/g, ''))}
              placeholder="Phone number"
              type="tel"
              inputMode="numeric"
              className="h-14 rounded-xl text-base pl-12 border border-border focus:border-primary"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              className="h-14 rounded-xl text-base pl-12 border border-border focus:border-primary"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              type={showPassword ? 'text' : 'password'}
              className="h-14 rounded-xl text-base pl-12 pr-12 border border-border focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleSignup}
          disabled={loading}
          className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform"
        >
          {loading ? 'Creating account…' : (
            <span className="flex items-center gap-2">Create Account <ArrowRight className="h-5 w-5" /></span>
          )}
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>

        <button
          onClick={() => navigate('/welcome')}
          className="mt-3 w-full text-center text-sm font-medium text-muted-foreground active:text-foreground transition-colors"
        >
          Continue as guest
        </button>
      </motion.div>
    </div>
  );
};

export default Signup;
