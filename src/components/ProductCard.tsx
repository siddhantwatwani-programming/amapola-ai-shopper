import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

// Deterministic badge based on product id
const badges = ['Fresh today', 'Available today', 'Popular', 'Staff pick'] as const;
function getBadge(id: string): string {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return badges[hash % badges.length];
}

const badgeColors: Record<string, string> = {
  'Fresh today': 'bg-accent/15 text-accent',
  'Available today': 'bg-primary/10 text-primary',
  'Popular': 'bg-secondary text-secondary-foreground',
  'Staff pick': 'bg-accent/15 text-accent',
};

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const badge = useMemo(() => getBadge(product.id), [product.id]);

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
        </div>
        {qty === 0 ? (
          <Button
            size="icon"
            onClick={() => addItem(product)}
            className="h-9 w-9 shrink-0 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(product.id, qty - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground active:bg-muted/80"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-foreground">{qty}</span>
            <button
              onClick={() => updateQuantity(product.id, qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground active:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="relative flex h-28 items-center justify-center bg-muted/50 text-5xl">
        {product.emoji}
        <span className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColors[badge]}`}>
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold leading-tight text-foreground">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
          <AnimatePresence mode="wait">
            {qty === 0 ? (
              <motion.div key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <Button
                  size="icon"
                  onClick={() => addItem(product)}
                  className="h-9 w-9 rounded-xl active:scale-95 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-0.5"
              >
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground active:bg-muted/80 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-foreground">{qty}</span>
                <button
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground active:bg-primary/90 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
