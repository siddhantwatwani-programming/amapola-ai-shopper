import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, ChevronDown, CalendarDays, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoAmapola from '@/assets/logo-amapola.avif';
import { useStore } from '@/store/storeContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useCart } from '@/store/cartStore';
import { useCustomer } from '@/store/customerContext';
import StoreSwitcher from '@/components/StoreSwitcher';
import PickupScheduler from '@/components/PickupScheduler';
interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader = ({ title, subtitle, children, onBack }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  const { isRestaurant } = useMode();
  const { scheduleLabel, dynamicLabel } = usePickup();
  const { clearCart } = useCart();
  const { clearCustomer } = useCustomer();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  const handleLogoReset = () => {
    clearCart();
    clearCustomer();
    navigate('/');
  };
  return (
    <>
      <div className="sticky top-0 z-20 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {onBack ? (
              <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-95 transition-transform">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <motion.img src={logoAmapola} alt="Amapola Market" className="h-8 w-auto object-contain md:h-10 cursor-pointer active:scale-95 transition-transform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} onClick={handleLogoReset} />
            )}
            {title && (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground leading-tight md:text-2xl">{title}</h1>
                  {isRestaurant && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground flex items-center gap-1">
                      <UtensilsCrossed className="h-2.5 w-2.5" />
                      BULK
                    </span>
                  )}
                </div>
                {subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
              </div>
            )}
          </div>
          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
        {/* Store + schedule bar */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setSwitcherOpen(true)}
            className="flex flex-1 items-center gap-2 text-xs text-muted-foreground md:text-sm rounded-xl bg-muted/40 px-3 py-2 active:bg-muted transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{selectedStore.name}</span>
            <span className="flex items-center gap-1 font-medium text-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {dynamicLabel}
            </span>
            <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
          <button
            onClick={() => setSchedulerOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary rounded-xl bg-primary/5 px-3 py-2 active:bg-primary/10 transition-colors shrink-0"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {scheduleLabel}
          </button>
        </div>
      </div>

      <StoreSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
      <PickupScheduler open={schedulerOpen} onOpenChange={setSchedulerOpen} />
    </>
  );
};

export default PageHeader;
