import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Clock, Navigation, CheckCircle2, Zap, Users, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore, stores, type StoreLocation } from '@/store/storeContext';
import { cn } from '@/lib/utils';
import logoAmapola from '@/assets/logo-amapola.avif';

const Welcome = () => {
  const navigate = useNavigate();
  const { selectedStore, setSelectedStore } = useStore();
  const [confirmed, setConfirmed] = useState(false);
  const [showStores, setShowStores] = useState(false);

  const handleSelect = (store: StoreLocation) => {
    setSelectedStore(store);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigate('/browse'), 350);
  };

  const statusIcon = (status: string) => {
    if (status === 'Open') return <Zap className="h-3.5 w-3.5" />;
    if (status === 'Busy') return <Users className="h-3.5 w-3.5" />;
    return <Timer className="h-3.5 w-3.5" />;
  };

  // Kiosk entry (full-screen, no scroll)
  if (!showStores) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex w-full max-w-lg flex-col items-center text-center"
        >
          <motion.img
            src={logoAmapola}
            alt="Amapola Market"
            className="h-32 w-auto object-contain mb-6 md:h-40"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
          />

          <h1 className="text-3xl font-bold text-foreground mb-2 md:text-4xl">
            Welcome to Amapola
          </h1>
          <p className="text-lg text-muted-foreground mb-10 md:text-xl">
            Your neighborhood market, now on screen
          </p>

          <div className="w-full space-y-4 max-w-sm">
            <Button
              size="lg"
              onClick={() => setShowStores(true)}
              className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg active:scale-[0.97] transition-transform md:h-20 md:text-2xl"
            >
              <ShoppingBag className="mr-3 h-6 w-6 md:h-7 md:w-7" />
              Order for Pickup
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowStores(true)}
              className="h-14 w-full rounded-2xl text-lg font-semibold border-2 active:scale-[0.97] transition-transform md:h-16 md:text-xl"
            >
              <MapPin className="mr-3 h-5 w-5 md:h-6 md:w-6" />
              Find Nearest Store
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Touch to begin · No account needed
          </p>
        </motion.div>
      </div>
    );
  }

  // Store selector (map-driven feel)
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <img src={logoAmapola} alt="Amapola" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-1.5 text-accent">
            <Navigation className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Locating stores…</span>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="relative bg-muted/30 border-b border-border">
        <div className="max-w-lg mx-auto px-5 py-6">
          <div className="rounded-2xl bg-muted/50 border border-border p-6 flex items-center justify-center min-h-[140px] md:min-h-[200px]">
            <div className="text-center">
              <div className="flex justify-center gap-6 mb-3">
                {stores.map((store, i) => (
                  <motion.button
                    key={store.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                    onClick={() => handleSelect(store)}
                    className={cn(
                      'flex flex-col items-center gap-1 transition-all',
                      selectedStore.id === store.id ? 'scale-110' : 'opacity-60'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors md:h-12 md:w-12',
                      selectedStore.id === store.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 bg-card text-muted-foreground'
                    )}>
                      <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className={cn(
                      'text-[11px] font-semibold md:text-xs',
                      selectedStore.id === store.id ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {store.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Tap a pin to select</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store cards */}
      <div className="flex-1 px-5 py-4 max-w-lg mx-auto w-full">
        <div className="space-y-3 mb-5">
          {stores.map((store, i) => {
            const isSelected = selectedStore.id === store.id;
            const isNearest = i === 2;
            return (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => handleSelect(store)}
                className={cn(
                  'w-full rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98]',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-base font-bold text-foreground md:text-lg">
                        Amapola — {store.name}
                      </h3>
                      {isNearest && (
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                          Nearest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{store.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {store.distance}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Ready in {store.pickupTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isSelected && (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    )}
                    <span className={cn(
                      'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      store.status === 'Open' ? 'bg-accent/15 text-accent' :
                      store.status === 'Busy' ? 'bg-secondary text-secondary-foreground' :
                      'bg-destructive/10 text-destructive'
                    )}>
                      {statusIcon(store.status)}
                      {store.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected store summary */}
        <motion.div
          key={selectedStore.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-5 rounded-2xl bg-muted/60 px-5 py-4 text-center"
        >
          <p className="text-base font-semibold text-foreground md:text-lg">
            Amapola — {selectedStore.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Ready in <span className="font-bold text-foreground">{selectedStore.pickupTime}</span> · Pickup at front counter or kiosk
          </p>
        </motion.div>

        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={confirmed}
          className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg active:scale-[0.97] transition-transform md:h-20 md:text-2xl"
        >
          {confirmed ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              Opening store…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Start Shopping
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
