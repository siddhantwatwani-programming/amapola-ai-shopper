import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, ShoppingCart, Search } from 'lucide-react';
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

  // Hide on welcome & confirmation
  if (location.pathname === '/' || location.pathname === '/confirmation') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1"
            >
              <div className="relative">
                <Icon className={cn('h-6 w-6 transition-colors', active ? 'text-primary' : 'text-muted-foreground')} />
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
              <span className={cn('text-[10px] font-medium', active ? 'text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Safe area bottom */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
