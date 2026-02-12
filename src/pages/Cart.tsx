import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col pb-24">
        <PageHeader title="Cart" />
        <div className="flex flex-col items-center justify-center px-6 pt-16 text-center">
          <span className="mb-4 text-6xl">🛒</span>
          <h2 className="mb-1 text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground">Browse our store and add some items!</p>
        </div>
      </div>
    );
  }

  // Generate a simple AI summary
  const categoryNames = [...new Set(items.map(i => i.product.category))];
  const summaryParts: string[] = [];
  if (categoryNames.includes('produce')) summaryParts.push('fresh produce');
  if (categoryNames.includes('deli')) summaryParts.push('deli favorites');
  if (categoryNames.includes('bakery')) summaryParts.push('bakery items');
  if (categoryNames.includes('dairy')) summaryParts.push('dairy essentials');
  if (categoryNames.includes('pantry')) summaryParts.push('pantry staples');
  if (categoryNames.includes('snacks')) summaryParts.push('snacks & beverages');
  const aiSummary = `Your order includes ${summaryParts.join(', ')} — looks like a great haul! 🛍️`;

  return (
    <div className="flex flex-col pb-24">
      <PageHeader title="Cart" subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`} />

      {/* AI Summary */}
      <div className="mx-4 mb-4 flex items-start gap-2 rounded-2xl bg-primary/5 p-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-foreground">{aiSummary}</p>
      </div>

      {/* Items */}
      <div className="space-y-2 px-4">
        {items.map(({ product, quantity }) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
              {product.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">${(product.price * quantity).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeItem(product.id)}
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div className="mx-4 mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/confirmation')}
          className="h-14 w-full rounded-2xl text-lg font-semibold shadow-lg"
        >
          Place Order for Pickup
        </Button>
      </div>
    </div>
  );
};

export default Cart;
