import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingCart, Search, RotateCcw } from 'lucide-react';
import { useCart } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/browse', label: 'Browse', icon: Search },
  { path: '/assistant', label: 'Ask AI', icon: Sparkles },
  { path: '/cart', label: 'Cart', icon: ShoppingCart },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  if (location.pathname === '/' || location.pathname === '/confirmation') return null;

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
              className="relative flex flex-col items-center gap-1 px-6 py-2 active:scale-95 transition-transform"
            >
              <div className="relative">
                <Icon className={cn('h-7 w-7 transition-colors md:h-8 md:w-8', active ? 'text-primary' : 'text-muted-foreground')} />
                {tab.path === '/cart' && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span className={cn('text-xs font-semibold md:text-sm', active ? 'text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
              {active && (
                <motion.div layoutId="bottomNavIndicator" className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
