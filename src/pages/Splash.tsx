import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoAmapola from '@/assets/logo-amapola.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), 2400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <motion.img
        src={logoAmapola}
        alt="Amapola Market"
        className="h-28 w-auto object-contain md:h-40"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      />
      <motion.p
        className="mt-4 text-lg font-semibold text-muted-foreground md:text-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Your neighborhood market
      </motion.p>
      <motion.div
        className="mt-8 h-1 w-16 rounded-full bg-primary/30 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.7, duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
};

export default Splash;
