import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingCart, Search, ClipboardList } from 'lucide-react';
import { useCart } from '@/store/cartStore';
import { useLanguage } from '@/store/languageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { t } = useLanguage();

  const tabs = [
    { path: '/browse', label: t('nav.browse'), icon: Search },
    { path: '/assistant', label: t('nav.askAi'), icon: Sparkles },
    { path: '/cart', label: t('nav.cart'), icon: ShoppingCart },
    { path: '/order-status', label: t('nav.orders'), icon: ClipboardList },
  ];

  const hiddenRoutes = ['/', '/login', '/signup', '/welcome', '/confirmation'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around md:h-20">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 px-4 py-2 active:scale-95 transition-transform"
            >
              <div className="relative">
                <Icon className={cn('h-6 w-6 transition-colors md:h-7 md:w-7', active ? 'text-primary' : 'text-muted-foreground')} />
                {tab.path === '/cart' && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1.3, 1] }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute -right-2.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span className={cn('text-[10px] font-semibold md:text-xs', active ? 'text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
              {active && (
                <motion.div layoutId="bottomNavIndicator" className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
