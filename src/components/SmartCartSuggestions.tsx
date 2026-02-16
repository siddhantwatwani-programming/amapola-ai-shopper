import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { productPairings, getProductById, products, type Product } from '@/data/products';

const SmartCartSuggestions = () => {
  const { items, addItem } = useCart();
  const { isAvailable } = useStore();

  const suggestions = useMemo((): Product[] => {
    if (items.length === 0) return [];

    const cartIds = new Set(items.map(i => i.product.id));
    const cartCats = new Set(items.map(i => i.product.category));
    const scored = new Map<string, number>();

    // Score based on pairings
    items.forEach(({ product }) => {
      const pairing = productPairings[product.id];
      if (pairing) {
        pairing.ids.forEach(id => {
          if (!cartIds.has(id) && isAvailable(id)) {
            scored.set(id, (scored.get(id) ?? 0) + 3);
          }
        });
      }
    });

    // Score based on missing categories
    const allCats = ['produce', 'bakery', 'deli', 'beverages', 'snacks', 'dairy'] as const;
    const missingCats = allCats.filter(c => !cartCats.has(c));
    missingCats.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat && !cartIds.has(p.id) && isAvailable(p.id));
      catProducts.slice(0, 2).forEach(p => {
        scored.set(p.id, (scored.get(p.id) ?? 0) + 1);
      });
    });

    return Array.from(scored.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => getProductById(id)!)
      .filter(Boolean);
  }, [items, isAvailable]);

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-3 mb-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">You might also need</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <AnimatePresence>
          {suggestions.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card p-2 min-w-[180px]"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-muted overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg">{product.emoji}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                <p className="text-[10px] text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addItem(product)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground active:scale-90 transition-transform"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartCartSuggestions;
