import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import logoAmapola from '@/assets/logo-amapola.png';
import { cn } from '@/lib/utils';

type LoginMethod = 'email' | 'phone';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (method === 'email' && !email.trim()) return;
    if (method === 'phone' && !phone.trim()) return;
    if (!password) return;

    setLoading(true);
    try {
      const credentials = method === 'email'
        ? { email: email.trim(), password }
        : { phone: phone.trim(), password };

      const { error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      } else {
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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Method toggle */}
        <div className="flex rounded-xl bg-muted p-1 mb-5">
          {(['email', 'phone'] as LoginMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={cn(
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
                method === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              {m === 'email' ? 'Email' : 'Phone'}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-5">
          {method === 'email' ? (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                type="email"
                className="h-14 rounded-xl text-base pl-14 border border-border focus:border-primary"
                autoFocus
              />
            </div>
          ) : (
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9()\-\s+]/g, ''))}
                placeholder="+1 (555) 123-4567"
                type="tel"
                inputMode="numeric"
                className="h-14 rounded-xl text-base pl-14 border border-border focus:border-primary"
                autoFocus
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              className="h-14 rounded-xl text-base pl-14 pr-14 border border-border focus:border-primary"
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
          onClick={handleLogin}
          disabled={loading}
          className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform"
        >
          {loading ? 'Signing in…' : (
            <span className="flex items-center gap-2">Sign In <ArrowRight className="h-5 w-5" /></span>
          )}
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
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

export default Login;
