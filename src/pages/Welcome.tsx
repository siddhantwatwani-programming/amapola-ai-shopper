import { motion } from 'framer-motion';
import { MapPin, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-primary/10"
        >
          <span className="text-6xl">🌺</span>
        </motion.div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Amapola Market
        </h1>
        <p className="mb-1 text-base text-muted-foreground">
          Your neighborhood grocery store
        </p>

        <div className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>123 Main St, Los Angeles, CA</span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-2xl bg-muted/60 px-5 py-4 text-sm text-muted-foreground"
        >
          Fresh produce, baked goods, and deli favorites — ready for pickup! 🛒
        </motion.div>

        <Button
          size="lg"
          onClick={() => navigate('/browse')}
          className="h-14 w-full rounded-2xl text-lg font-semibold shadow-lg"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Start Shopping
        </Button>
      </motion.div>
    </div>
  );
};

export default Welcome;
