import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore, stores, type StoreLocation } from '@/store/storeContext';
import { cn } from '@/lib/utils';
import logoAmapola from '@/assets/logo-amapola.avif';

const Welcome = () => {
  const navigate = useNavigate();
  const { selectedStore, setSelectedStore } = useStore();
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (store: StoreLocation) => {
    setSelectedStore(store);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigate('/browse'), 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-md mx-auto flex-col"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.img
            src={logoAmapola}
            alt="Amapola Market"
            className="h-24 w-auto object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mb-1">
          Your neighborhood grocery store
        </p>

        {/* Location header */}
        <div className="flex items-center gap-1.5 justify-center mb-6">
          <Navigation className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">Finding nearest store…</span>
        </div>

        {/* Store Cards */}
        <div className="space-y-3 mb-6">
          {stores.map((store, i) => {
            const isSelected = selectedStore.id === store.id;
            const isNearest = i === 2; // Boyle Heights
            return (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => handleSelect(store)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground">
                        Amapola — {store.name}
                      </h3>
                      {isNearest && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                          Nearest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{store.address}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {store.distance}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Ready in {store.pickupTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      store.status === 'Open' ? 'bg-accent/15 text-accent' :
                      store.status === 'Busy' ? 'bg-secondary text-secondary-foreground' :
                      'bg-destructive/10 text-destructive'
                    )}>
                      {store.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected store info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-2xl bg-muted/60 px-5 py-4 text-sm text-muted-foreground text-center"
        >
          Pickup at <span className="font-semibold text-foreground">Amapola — {selectedStore.name}</span>
          <br />
          Ready in <span className="font-semibold text-foreground">{selectedStore.pickupTime}</span> · Fresh produce, deli & bakery 🛒
        </motion.div>

        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={confirmed}
          className="h-14 w-full rounded-2xl text-lg font-semibold shadow-lg"
        >
          {confirmed ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Opening store…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </span>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default Welcome;
