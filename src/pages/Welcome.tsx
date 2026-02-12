import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Clock, Navigation, CheckCircle2, Zap, Users, Timer, User, Phone, ArrowRight, Store, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, stores, type StoreLocation } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode, type AppMode } from '@/store/modeContext';
import { cn } from '@/lib/utils';
import logoAmapola from '@/assets/logo-amapola.avif';

type Step = 'entry' | 'mode' | 'store' | 'identify';

const Welcome = () => {
  const navigate = useNavigate();
  const { selectedStore, setSelectedStore } = useStore();
  const { setCustomer } = useCustomer();
  const { mode, setMode } = useMode();
  const [step, setStep] = useState<Step>('entry');
  const [confirmed, setConfirmed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSelect = (store: StoreLocation) => setSelectedStore(store);
  const handleStoreConfirm = () => setStep('identify');

  const handleIdentifyConfirm = () => {
    if (firstName.trim()) {
      setCustomer({ firstName: firstName.trim(), phone: phone.trim() });
    }
    setConfirmed(true);
    setTimeout(() => navigate('/browse'), 350);
  };

  const statusIcon = (status: string) => {
    if (status === 'Open') return <Zap className="h-3.5 w-3.5" />;
    if (status === 'Busy') return <Users className="h-3.5 w-3.5" />;
    return <Timer className="h-3.5 w-3.5" />;
  };

  // --- ENTRY ---
  if (step === 'entry') {
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
            className="h-24 w-auto object-contain mb-4 md:h-32"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
          />
          <h1 className="text-2xl font-bold text-foreground mb-1.5 md:text-3xl">Welcome to Amapola</h1>
          <p className="text-base text-muted-foreground mb-6 md:text-lg">Your neighborhood market, now on screen</p>
          <div className="w-full space-y-3 max-w-sm">
            <Button
              size="lg"
              onClick={() => setStep('mode')}
              className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform md:h-16 md:text-xl"
            >
              <ShoppingBag className="mr-3 h-6 w-6 md:h-7 md:w-7" />
              Order for Pickup
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStep('mode')}
              className="h-12 w-full rounded-2xl text-base font-semibold border-2 active:scale-[0.97] transition-transform md:h-14 md:text-lg"
            >
              <MapPin className="mr-3 h-5 w-5 md:h-6 md:w-6" />
              Find Nearest Store
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Touch to begin · No account needed</p>
        </motion.div>
      </div>
    );
  }

  // --- MODE SELECTION ---
  if (step === 'mode') {
    const modes: { id: AppMode; icon: typeof Store; title: string; desc: string }[] = [
      { id: 'consumer', icon: ShoppingBag, title: 'Personal Shopping', desc: 'Household groceries, everyday quantities' },
      { id: 'restaurant', icon: UtensilsCrossed, title: 'Restaurant / Business', desc: 'Bulk ordering, repeat pickups, wholesale pricing' },
    ];
    return (
      <div className="flex min-h-screen flex-col bg-background">
         <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-5 py-3">
          <div className="flex items-center justify-center max-w-lg mx-auto">
            <img src={logoAmapola} alt="Amapola" className="h-8 w-auto object-contain" />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center md:text-3xl">How are you ordering?</h2>
            <p className="text-sm text-muted-foreground mb-5 text-center">Choose your ordering mode</p>
            <div className="space-y-3">
              {modes.map(m => {
                const Icon = m.icon;
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      'w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]',
                      isActive ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{m.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{m.desc}</p>
                      </div>
                      {isActive && <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <Button
              size="lg"
              onClick={() => setStep('store')}
              className="mt-5 h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- IDENTIFY ---
  if (step === 'identify') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-5 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <img src={logoAmapola} alt="Amapola" className="h-8 w-auto object-contain" />
            <span className="text-xs font-semibold text-muted-foreground">
              {mode === 'restaurant' ? '🏪 Restaurant' : '🛒 Personal'} · {selectedStore.name}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 md:text-3xl">Almost ready!</h2>
              <p className="text-base text-muted-foreground md:text-lg">
                {mode === 'restaurant' ? 'Business name & contact for bulk orders' : 'So we can identify your order at pickup'}
              </p>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  {mode === 'restaurant' ? 'Business / Contact Name' : 'First Name'}
                </label>
                <Input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={mode === 'restaurant' ? 'e.g. Taqueria El Sol' : 'e.g. Maria'}
                  className="h-14 rounded-xl text-lg px-4 border border-border focus:border-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Mobile Number</label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^0-9()-\s+]/g, ''))}
                  placeholder="(555) 123-4567"
                  type="tel"
                  inputMode="numeric"
                  className="h-14 rounded-xl text-lg px-4 border border-border focus:border-primary"
                />
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleIdentifyConfirm}
              disabled={confirmed || !firstName.trim()}
              className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform md:h-16 md:text-xl"
            >
              {confirmed ? (
                <span className="flex items-center gap-2"><CheckCircle2 className="h-6 w-6" />Opening store…</span>
              ) : (
                <span className="flex items-center gap-2">Continue to Order<ArrowRight className="h-6 w-6" /></span>
              )}
            </Button>
            <button onClick={handleIdentifyConfirm} className="mt-4 w-full text-center text-sm font-medium text-muted-foreground active:text-foreground transition-colors">
              Skip for now
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- STORE SELECTOR ---
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-5 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <img src={logoAmapola} alt="Amapola" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-1.5 text-accent">
            <Navigation className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Locating stores…</span>
          </div>
        </div>
      </div>

      <div className="relative bg-muted/30 border-b border-border">
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="rounded-2xl bg-muted/50 border border-border p-4 flex items-center justify-center min-h-[120px] md:min-h-[160px]">
            <div className="text-center">
              <div className="flex justify-center gap-6 mb-3">
                {stores.map((store, i) => (
                  <motion.button key={store.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1, type: 'spring' }} onClick={() => handleSelect(store)}
                    className={cn('flex flex-col items-center gap-1 transition-all', selectedStore.id === store.id ? 'scale-110' : 'opacity-60')}>
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors md:h-12 md:w-12',
                      selectedStore.id === store.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 bg-card text-muted-foreground')}>
                      <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className={cn('text-[11px] font-semibold md:text-xs', selectedStore.id === store.id ? 'text-foreground' : 'text-muted-foreground')}>{store.name}</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Tap a pin to select</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-3 max-w-lg mx-auto w-full">
        <div className="space-y-2.5 mb-4">
          {stores.map((store, i) => {
            const isSelected = selectedStore.id === store.id;
            const isNearest = i === 2;
            return (
              <motion.button key={store.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} onClick={() => handleSelect(store)}
                className={cn('w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]', isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card')}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-base font-bold text-foreground md:text-lg">Amapola — {store.name}</h3>
                      {isNearest && <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">Nearest</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{store.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{store.distance}</span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground"><Clock className="h-3.5 w-3.5" />Ready in {store.pickupTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-primary" />}
                    <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      store.status === 'Open' ? 'bg-accent/15 text-accent' : store.status === 'Busy' ? 'bg-secondary text-secondary-foreground' : 'bg-destructive/10 text-destructive')}>
                      {statusIcon(store.status)}{store.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div key={selectedStore.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-2xl bg-muted/60 px-4 py-3 text-center">
          <p className="text-base font-semibold text-foreground md:text-lg">Amapola — {selectedStore.name}</p>
          <p className="text-sm text-muted-foreground mt-1">Ready in <span className="font-bold text-foreground">{selectedStore.pickupTime}</span> · Pickup at front counter or kiosk</p>
        </motion.div>

        <Button size="lg" onClick={handleStoreConfirm} className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg active:scale-[0.97] transition-transform md:h-16 md:text-xl">
          <span className="flex items-center gap-2"><ShoppingBag className="h-6 w-6" />Continue</span>
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
