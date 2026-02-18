import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.png';
import splashBg from '@/assets/splash-bg.jpg';
import { useLanguage } from '@/store/languageContext';

const Splash = () => {
  const navigate = useNavigate();
  const { setLang, t } = useLanguage();

  const handleStart = (lang: 'en' | 'es') => {
    setLang(lang);
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-background">
      <img src={splashBg} alt="" className="absolute inset-0 h-full w-full object-cover blur-sm scale-105" />
      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 w-full">
        <motion.img
          src={logoAmapola}
          alt="Amapola Market"
          className="h-28 w-auto object-contain md:h-40 drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-xs px-6 pb-12 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Button
          size="lg"
          onClick={() => handleStart('en')}
          className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleStart('es')}
          className="h-14 w-full rounded-2xl text-lg font-bold border-2 bg-white/80 backdrop-blur-sm active:scale-[0.97] transition-transform"
        >
          Comenzar <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Splash;
