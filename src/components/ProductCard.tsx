import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Package } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useMode } from '@/store/modeContext';
import { useMarketSignal } from '@/hooks/useMarketSignals';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const { isAvailable } = useStore();
  const { isRestaurant, qtyStep } = useMode();
  const signal = useMarketSignal(product);
  const cartItem = items.find(i => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const available = isAvailable(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qtyStep; i++) addItem(product);
  };
  const handleInc = () => updateQuantity(product.id, qty + qtyStep);
  const handleDec = () => updateQuantity(product.id, Math.max(0, qty - qtyStep));

  if (compact) {
    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={cn('flex items-center gap-3 rounded-2xl border border-border bg-card p-3', !available && 'opacity-50')}>
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted md:h-16 md:w-16">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl">{product.emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-foreground md:text-base">{product.name}</p>
          <p className="text-xs text-muted-foreground md:text-sm">
            ${product.price.toFixed(2)}
            {isRestaurant && <span className="ml-1 text-secondary-foreground font-semibold">· Bulk</span>}
          </p>
        </div>
        {/* Fixed-width interaction zone prevents layout shift */}
        <div className="flex w-[120px] shrink-0 items-center justify-end">
          {available ? (
            qty === 0 ? (
              <Button size="icon" onClick={handleAdd} className="h-11 w-11 shrink-0 rounded-xl active:scale-95 transition-transform">
                <Plus className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button onClick={handleDec} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-7 text-center text-base font-bold text-foreground">{qty}</span>
                <button onClick={handleInc} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground active:scale-90 transition-transform">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )
          ) : (
            <span className="text-xs text-destructive font-semibold">Unavailable</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout="position" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={available ? { scale: 0.97 } : undefined}
      className={cn('flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm', !available && 'opacity-50')}>
      {/* 1:1 square image container */}
      <div className="relative w-full overflow-hidden bg-muted/40" style={{ paddingBottom: '100%' }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">{product.emoji}</span>
        )}
      </div>
      {/* Fixed-height info section prevents card height changes */}
      <div className="flex flex-col p-2.5 md:p-3" style={{ minHeight: '120px' }}>
        {/* Signal + bulk badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5 h-5">
          {signal.text && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold leading-tight ${signal.style}`}>{signal.text}</span>
          )}
          {isRestaurant && available && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground flex items-center gap-0.5 leading-tight">
              <Package className="h-2.5 w-2.5" />Bulk
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2 md:text-base">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 md:text-sm">{product.description}</p>
        {/* Fixed-height bottom row: price + controls */}
        <div className="mt-auto flex items-center justify-between pt-2 h-11">
          <div>
            <span className="text-lg font-bold text-foreground md:text-xl">${product.price.toFixed(2)}</span>
            {isRestaurant && <span className="block text-[10px] text-muted-foreground">per unit · +{qtyStep}</span>}
          </div>
          {/* Fixed-width control zone — no layout shift on state change */}
          <div className="flex w-[110px] items-center justify-end">
            {available ? (
              qty === 0 ? (
                <Button size="icon" onClick={handleAdd} className="h-8 w-8 rounded-md active:scale-90 transition-transform">
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-0.5">
                  <button onClick={handleDec} className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground active:scale-90 transition-transform">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-foreground">{qty}</span>
                  <button onClick={handleInc} className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground active:scale-90 transition-transform">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            ) : (
              <span className="text-xs text-destructive font-semibold px-2">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
