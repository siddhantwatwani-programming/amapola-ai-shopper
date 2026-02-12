import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Sparkles, MapPin, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const { selectedStore, isAvailable } = useStore();
  const navigate = useNavigate();

  const unavailableItems = items.filter(i => !isAvailable(i.product.id));
  const availableItems = items.filter(i => isAvailable(i.product.id));

  if (items.length === 0) {
    return (
      <div className="flex flex-col pb-28">
        <PageHeader title="Cart" />
        <div className="flex flex-col items-center justify-center px-6 pt-20 text-center">
          <span className="mb-5 text-7xl">🛒</span>
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Your cart is empty</h2>
          <p className="text-base text-muted-foreground md:text-lg">Browse our store and add some items!</p>
          <Button
            size="lg"
            onClick={() => navigate('/browse')}
            className="mt-8 h-14 rounded-2xl px-10 text-lg font-bold active:scale-95 transition-transform"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  // AI summary
  const categoryNames = [...new Set(availableItems.map(i => i.product.category))];
  const summaryParts: string[] = [];
  if (categoryNames.includes('produce')) summaryParts.push('fresh produce');
  if (categoryNames.includes('deli')) summaryParts.push('deli favorites');
  if (categoryNames.includes('bakery')) summaryParts.push('bakery items');
  if (categoryNames.includes('dairy')) summaryParts.push('dairy essentials');
  if (categoryNames.includes('pantry')) summaryParts.push('pantry staples');
  if (categoryNames.includes('meat')) summaryParts.push('meat & seafood');
  if (categoryNames.includes('frozen')) summaryParts.push('frozen goods');
  if (categoryNames.includes('beverages')) summaryParts.push('beverages');
  if (categoryNames.includes('snacks')) summaryParts.push('snacks & sweets');
  const aiSummary = summaryParts.length > 0
    ? `Your order from ${selectedStore.name} includes ${summaryParts.join(', ')} — looks like a great haul! 🛍️`
    : 'Add some items to get started!';

  return (
    <div className="flex flex-col pb-28">
      <PageHeader title="Cart" subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`} />

      {/* Store info bar */}
      <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1 md:text-base">
          Pickup at <span className="font-bold text-foreground">Amapola — {selectedStore.name}</span>
        </span>
        <span className="flex items-center gap-1.5 text-sm text-accent font-bold md:text-base">
          <Clock className="h-4 w-4" />
          {selectedStore.pickupTime}
        </span>
      </div>

      {/* Unavailable warning */}
      {unavailableItems.length > 0 && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-2xl bg-destructive/5 border border-destructive/20 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-bold text-destructive">
              {unavailableItems.length} item{unavailableItems.length > 1 ? 's' : ''} not available at {selectedStore.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {unavailableItems.map(i => i.product.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* AI Summary */}
      <div className="mx-4 mb-4 flex items-start gap-2 rounded-2xl bg-primary/5 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-foreground md:text-base">{aiSummary}</p>
      </div>

      {/* Items */}
      <div className="space-y-2 px-4">
        {items.map(({ product, quantity }) => {
          const avail = isAvailable(product.id);
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 ${!avail ? 'opacity-50' : ''}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl md:h-16 md:w-16">
                {product.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-base font-bold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${(product.price * quantity).toFixed(2)}
                  {!avail && <span className="ml-1 text-destructive font-semibold">· Not at {selectedStore.name}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-base font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-destructive active:scale-90 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total + Checkout */}
      <div className="mx-4 mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-5 py-4">
          <span className="text-base font-semibold text-muted-foreground">Subtotal</span>
          <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/confirmation')}
          className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg active:scale-[0.97] transition-transform md:h-20 md:text-2xl"
        >
          Confirm Pickup Order
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/')}
          className="h-14 w-full rounded-2xl text-lg font-semibold border-2 active:scale-[0.97] transition-transform"
        >
          Change Store
        </Button>
      </div>
    </div>
  );
};

export default Cart;
