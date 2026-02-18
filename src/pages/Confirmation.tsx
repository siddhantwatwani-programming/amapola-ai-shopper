import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, QrCode, MapPin, Clock, User, Phone, CalendarDays, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { useLanguage } from '@/store/languageContext';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.png';
import { fireConfetti } from '@/hooks/useConfetti';

const Confirmation = () => {
  const { items, clearCart, totalPrice, totalItems } = useCart();
  const { selectedStore } = useStore();
  const { customer, clearCustomer } = useCustomer();
  const { isRestaurant, mode } = useMode();
  const { scheduleLabel, schedule, dynamicLabel } = usePickup();
  const { addOrder } = useOrderHistory();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const orderNumber = useMemo(() => `AMP-${Math.floor(1000 + Math.random() * 9000)}`, []);

  useEffect(() => { fireConfetti(); }, []);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-md flex-col items-center text-center">

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }} className="mb-3">
          <img src={logoAmapola} alt="Amapola Market" className="h-14 w-auto object-contain md:h-16" />
        </motion.div>

        <CheckCircle2 className="mb-3 h-14 w-14 text-accent md:h-16 md:w-16" />

        <h1 className="mb-1.5 text-2xl font-bold text-foreground md:text-3xl">{t('confirm.orderPlaced')}</h1>

        {isRestaurant && (
          <div className="mb-2 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            <UtensilsCrossed className="h-3 w-3" />
            {t('confirm.restaurantBulk')}
          </div>
        )}

        <p className="mb-1 text-base text-muted-foreground">{t('confirm.readyForPickup')}</p>

        <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-accent">
          <Clock className="h-4 w-4" />
          {schedule.type === 'now' ? `${t('confirm.readyIn')} ${dynamicLabel}` : scheduleLabel}
        </div>
        {schedule.type !== 'now' && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {schedule.date && schedule.time ? `${schedule.date} at ${schedule.time}` : scheduleLabel}
          </div>
        )}

        <div className="mb-4 w-full rounded-2xl border-2 border-border bg-card p-4 text-left">
          {customer?.firstName && (
            <div className="mb-3 pb-3 border-b border-border">
              <p className="text-lg font-bold text-primary mb-1">
                {t('confirm.askFor')} {customer.firstName} {t('confirm.atPickupCounter')}
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

          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Amapola — {selectedStore.name}</p>
              <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">{t('confirm.orderNumber')}</span>
              <span className="text-base font-bold text-foreground">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">{t('confirm.total')} ({totalItems} {totalItems !== 1 ? t('browse.items') : t('browse.item')})</span>
              <span className="text-base font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            {isRestaurant && (
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">{t('confirm.orderType')}</span>
                <span className="text-sm font-bold text-secondary-foreground">{t('confirm.restaurantBulk')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 md:h-44 md:w-44">
          <QrCode className="h-16 w-16 text-muted-foreground/50" />
        </div>

        <div className="mb-3 rounded-2xl bg-muted/60 px-5 py-3.5 text-sm text-muted-foreground">
          📍 {t('confirm.showScreen')} <span className="font-bold text-foreground">{t('confirm.frontCounter')}</span> {t('confirm.or')} <span className="font-bold text-foreground">{t('confirm.inStoreKiosk')}</span> {t('confirm.whenYouArrive')}
        </div>
        <p className="mb-5 text-xs text-muted-foreground">{selectedStore.address} · {selectedStore.distance} {t('confirm.away')}</p>

        <Button size="lg" onClick={() => navigate('/order-status')} className="h-14 w-full rounded-2xl text-lg font-bold active:scale-[0.97] transition-transform md:h-16 md:text-xl">
          {t('confirm.trackMyOrder')}
        </Button>
        <Button variant="outline" size="lg" onClick={handleDone} className="mt-2 h-12 w-full rounded-2xl text-base font-semibold border-2">
          {t('confirm.done')}
        </Button>
      </motion.div>
    </div>
  );
};

export default Confirmation;
