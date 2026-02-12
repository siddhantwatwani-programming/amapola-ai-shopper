import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useCustomer } from '@/store/customerContext';
import logoAmapola from '@/assets/logo-amapola.avif';

const IDLE_TIMEOUT = 90_000; // 90 seconds
const WARNING_AT = 60_000;  // show warning at 60s

const IdleOverlay = () => {
  const [idle, setIdle] = useState(false);
  const [warning, setWarning] = useState(false);
  const { clearCart } = useCart();
  const { clearCustomer } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();

  const resetTimers = useCallback(() => {
    setIdle(false);
    setWarning(false);
  }, []);

  useEffect(() => {
    // Don't run on welcome/entry screen
    if (location.pathname === '/') return;

    let warningTimer: ReturnType<typeof setTimeout>;
    let idleTimer: ReturnType<typeof setTimeout>;

    const startTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(idleTimer);
      setWarning(false);
      setIdle(false);

      warningTimer = setTimeout(() => setWarning(true), WARNING_AT);
      idleTimer = setTimeout(() => setIdle(true), IDLE_TIMEOUT);
    };

    const handleActivity = () => startTimers();

    startTimers();

    const events = ['touchstart', 'mousedown', 'keydown', 'scroll'];
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(idleTimer);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [location.pathname]);

  const handleContinue = () => {
    resetTimers();
  };

  const handleReset = () => {
    clearCart();
    clearCustomer();
    navigate('/');
    resetTimers();
  };

  // Full idle → show reset screen
  if (idle && location.pathname !== '/') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 backdrop-blur-lg"
        onClick={handleContinue}
      >
        <motion.img
          src={logoAmapola}
          alt="Amapola Market"
          className="h-28 w-auto object-contain mb-8"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <h2 className="text-2xl font-bold text-foreground mb-2">Session Inactive</h2>
        <p className="text-lg text-muted-foreground mb-8">Tap anywhere to continue</p>
        <div className="flex gap-4">
          <button
            onClick={e => { e.stopPropagation(); handleContinue(); }}
            className="rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground active:scale-95 transition-transform"
          >
            Continue Order
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleReset(); }}
            className="rounded-2xl border-2 border-border bg-card px-8 py-4 text-lg font-bold text-foreground active:scale-95 transition-transform"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {warning && location.pathname !== '/' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-lg rounded-2xl border-2 border-border bg-card/95 p-4 shadow-lg backdrop-blur-md"
          onClick={resetTimers}
        >
          <p className="text-center text-sm font-semibold text-muted-foreground">
            👋 Still there? Tap to keep your session active
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IdleOverlay;
