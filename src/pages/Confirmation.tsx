import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, QrCode, MapPin, Clock, User, Phone, CalendarDays, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.avif';

const Confirmation = () => {
  const { items, clearCart, totalPrice, totalItems } = useCart();
  const { selectedStore } = useStore();
  const { customer, clearCustomer } = useCustomer();
  const { isRestaurant, mode } = useMode();
  const { scheduleLabel, schedule } = usePickup();
  const { addOrder } = useOrderHistory();
  const navigate = useNavigate();

  const orderNumber = useMemo(() => `AMP-${Math.floor(1000 + Math.random() * 9000)}`, []);

  // Save order to history on mount
  useMemo(() => {
    if (items.length > 0) {
      addOrder({
        id: orderNumber,
        date: 'Just now',
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        total: totalPrice,
        mode,
      });
    }
  }, []);

  const handleDone = () => {
    clearCart();
    clearCustomer();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-md flex-col items-center text-center">

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }} className="mb-5">
          <img src={logoAmapola} alt="Amapola Market" className="h-24 w-auto object-contain md:h-28" />
        </motion.div>

        <CheckCircle2 className="mb-4 h-16 w-16 text-accent md:h-20 md:w-20" />

        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Order Placed!</h1>

        {/* Mode badge */}
        {isRestaurant && (
          <div className="mb-2 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            <UtensilsCrossed className="h-3 w-3" />
            Restaurant / Bulk Order
          </div>
        )}

        <p className="mb-1 text-lg text-muted-foreground">Your groceries will be ready for pickup.</p>

        {/* Schedule info */}
        <div className="mb-2 flex items-center gap-2 text-base font-bold text-accent">
          <Clock className="h-4 w-4" />
          {schedule.type === 'now' ? `Ready in ${selectedStore.pickupTime}` : scheduleLabel}
        </div>
        {schedule.type !== 'now' && (
          <div className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {schedule.date && schedule.time ? `${schedule.date} at ${schedule.time}` : scheduleLabel}
          </div>
        )}

        {/* Customer & Store info */}
        <div className="mb-6 w-full rounded-2xl border-2 border-border bg-card p-5 text-left">
          {customer?.firstName && (
            <div className="mb-4 pb-4 border-b border-border">
              <p className="text-lg font-bold text-primary mb-1">
                Ask for {customer.firstName} at the pickup counter
              </p>
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />{customer.firstName}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />{customer.phone}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Amapola — {selectedStore.name}</p>
              <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Order Number</span>
              <span className="text-xl font-bold text-foreground">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Total ({totalItems} items)</span>
              <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            {isRestaurant && (
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Order Type</span>
                <span className="text-sm font-bold text-secondary-foreground">Restaurant / Bulk</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 md:h-52 md:w-52">
          <QrCode className="h-20 w-20 text-muted-foreground/50" />
        </div>

        <div className="mb-4 rounded-2xl bg-muted/60 px-6 py-5 text-base text-muted-foreground">
          📍 Show this screen at the <span className="font-bold text-foreground">front counter</span> or <span className="font-bold text-foreground">in-store kiosk</span> when you arrive.
        </div>
        <p className="mb-8 text-sm text-muted-foreground">{selectedStore.address} · {selectedStore.distance} away</p>

        <Button size="lg" onClick={handleDone} className="h-16 w-full rounded-2xl text-xl font-bold active:scale-[0.97] transition-transform md:h-20 md:text-2xl">
          Done
        </Button>
      </motion.div>
    </div>
  );
};

export default Confirmation;
