import { motion } from 'framer-motion';
import { Plus, Minus, Package, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/data/products';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useMode } from '@/store/modeContext';
import { useFavorites } from '@/store/favoritesStore';
import { useMarketSignal } from '@/hooks/useMarketSignals';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const navigate = useNavigate();
  const { items, addItem, updateQuantity } = useCart();
  const { isAvailable } = useStore();
  const { isRestaurant, qtyStep } = useMode();
  const { isFavorite, toggleFavorite } = useFavorites();
  const signal = useMarketSignal(product);
  const cartItem = items.find(i => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const available = isAvailable(product.id);
  const fav = isFavorite(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qtyStep; i++) addItem(product);
  };
  const handleInc = () => updateQuantity(product.id, qty + qtyStep);
  const handleDec = () => updateQuantity(product.id, Math.max(0, qty - qtyStep));

  const goToDetail = () => navigate(`/product/${product.id}`);

  if (compact) {
    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        onClick={goToDetail}
        className={cn('flex items-center gap-3 rounded-md border border-border bg-card p-2.5 cursor-pointer', !available && 'opacity-50')}>
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted md:h-16 md:w-16">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl">{product.emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-bold text-foreground md:text-sm">{product.name}</p>
          <p className="text-[11px] text-muted-foreground md:text-xs">
            ${product.price.toFixed(2)}
            {isRestaurant && <span className="ml-1 text-secondary-foreground font-semibold">· Bulk</span>}
          </p>
        </div>
        <div className="flex w-[110px] shrink-0 items-center justify-end">
          {available ? (
            qty === 0 ? (
              <Button size="icon" onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="h-8 w-8 shrink-0 rounded-md active:scale-95 transition-transform">
                <Plus className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-0.5">
                <button onClick={(e) => { e.stopPropagation(); handleDec(); }} className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground active:scale-90 transition-transform">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-foreground">{qty}</span>
                <button onClick={(e) => { e.stopPropagation(); handleInc(); }} className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground active:scale-90 transition-transform">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          ) : (
            <span className="text-[10px] text-destructive font-semibold">Unavailable</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout="position" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={available ? { scale: 0.97 } : undefined}
      onClick={goToDetail}
      className={cn('flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm cursor-pointer', !available && 'opacity-50')}>
      <div className="relative w-full overflow-hidden bg-muted/40" style={{ paddingBottom: '100%' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">{product.emoji}</span>
        )}
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm active:scale-90 transition-transform"
        >
          <Heart className={cn('h-3.5 w-3.5', fav ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
        </button>
        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
          {signal.text && (
            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold leading-tight backdrop-blur-sm ${signal.style}`}>{signal.text}</span>
          )}
          {isRestaurant && available && (
            <span className="rounded-md bg-secondary/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-secondary-foreground flex items-center gap-0.5 leading-tight">
              <Package className="h-2.5 w-2.5" />Bulk
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col p-2 md:p-2.5" style={{ minHeight: '100px' }}>
        <h3 className="text-xs font-bold leading-tight text-foreground line-clamp-2 md:text-sm">{product.name}</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-1.5 h-10">
          <div>
            <span className="text-base font-bold text-foreground md:text-lg">${product.price.toFixed(2)}</span>
            {isRestaurant && <span className="block text-[9px] text-muted-foreground">per unit · +{qtyStep}</span>}
          </div>
          <div className="flex items-center justify-end">
            {available ? (
              qty === 0 ? (
                <Button size="icon" onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="h-8 w-8 rounded-md active:scale-90 transition-transform">
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); handleDec(); }} className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground active:scale-90 transition-transform">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-foreground">{qty}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleInc(); }} className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground active:scale-90 transition-transform">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            ) : (
              <span className="text-[10px] text-destructive font-semibold">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
