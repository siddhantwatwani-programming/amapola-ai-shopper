import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import logoAmapola from '@/assets/logo-amapola.avif';
import { useStore } from '@/store/storeContext';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader = ({ title, subtitle, children, onBack }: PageHeaderProps) => {
  const { selectedStore } = useStore();

  return (
    <div className="sticky top-0 z-20 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <motion.img
              src={logoAmapola}
              alt="Amapola Market"
              className="h-8 w-auto object-contain md:h-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {title && (
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight md:text-2xl">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
            </div>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      {/* Store bar */}
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground md:text-sm">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {selectedStore.name}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Clock className="h-3.5 w-3.5" />
          Ready in {selectedStore.pickupTime}
        </span>
      </div>
    </div>
  );
};

export default PageHeader;
