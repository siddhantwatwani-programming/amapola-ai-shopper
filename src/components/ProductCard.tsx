import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { addItem } = useCart();

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
        <Button
          size="icon"
          onClick={() => addItem(product)}
          className="h-9 w-9 shrink-0 rounded-xl"
        >
          <Plus className="h-4 w-4" />
        </Button>
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
      <div className="flex h-28 items-center justify-center bg-muted/50 text-5xl">
        {product.emoji}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold leading-tight text-foreground">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
          <Button
            size="icon"
            onClick={() => addItem(product)}
            className="h-9 w-9 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
