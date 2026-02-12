import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, QrCode, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.avif';

const Confirmation = () => {
  const { clearCart, totalPrice, totalItems } = useCart();
  const { selectedStore } = useStore();
  const navigate = useNavigate();

  const orderNumber = useMemo(() => `AMP-${Math.floor(1000 + Math.random() * 9000)}`, []);

  useEffect(() => {
    return () => {};
  }, []);

  const handleDone = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-4"
        >
          <img src={logoAmapola} alt="Amapola Market" className="h-20 w-auto object-contain" />
        </motion.div>

        <CheckCircle2 className="mb-3 h-14 w-14 text-accent" />

        <h1 className="mb-1 text-2xl font-bold text-foreground">Order Placed!</h1>
        <p className="mb-1 text-muted-foreground">Your groceries will be ready for pickup.</p>
        <p className="mb-5 text-sm font-medium text-accent flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Estimated ready in {selectedStore.pickupTime}
        </p>

        {/* Store info */}
        <div className="mb-5 w-full rounded-2xl border border-border bg-card p-4 text-left">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Amapola — {selectedStore.name}</p>
              <p className="text-xs text-muted-foreground">{selectedStore.address}</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order Number</span>
              <span className="text-lg font-bold text-foreground">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total ({totalItems} items)</span>
              <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div className="mb-5 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
          <QrCode className="h-16 w-16 text-muted-foreground/50" />
        </div>

        <div className="mb-3 rounded-2xl bg-muted/60 px-5 py-4 text-sm text-muted-foreground">
          📍 Show this screen at the front counter or in-store kiosk when you arrive.
        </div>
        <p className="mb-8 text-xs text-muted-foreground">
          {selectedStore.address} · {selectedStore.distance} away
        </p>

        <Button
          size="lg"
          onClick={handleDone}
          className="h-14 w-full rounded-2xl text-lg font-semibold"
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
};

export default Confirmation;
