import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.png';
import splashBg from '@/assets/splash-bg.jpg';

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-background">
      {/* Background image */}
      <img
        src={splashBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-16 w-full">
        <motion.img
          src={logoAmapola}
          alt="Amapola Market"
          className="h-24 w-auto object-contain md:h-36 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        />
        <motion.p
          className="mt-3 text-lg font-semibold text-white/90 md:text-xl drop-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your neighborhood market
        </motion.p>
        <motion.div
          className="mt-8 w-full max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/login', { replace: true })}
            className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Splash;
