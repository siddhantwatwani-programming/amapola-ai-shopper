import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Sparkles, MapPin, Clock, AlertTriangle, CalendarDays, RotateCcw, UtensilsCrossed, TrendingUp, Package, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import StoreSwitcher from '@/components/StoreSwitcher';
import PickupScheduler from '@/components/PickupScheduler';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, addItem } = useCart();
  const { selectedStore, isAvailable } = useStore();
  const { customer } = useCustomer();
  const { isRestaurant, qtyStep } = useMode();
  const { scheduleLabel, dynamicLabel, pickupWarning } = usePickup();
  const { orders } = useOrderHistory();
  const navigate = useNavigate();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  const unavailableItems = items.filter(i => !isAvailable(i.product.id));
  const availableItems = items.filter(i => isAvailable(i.product.id));

  // Intelligent cart messages
  const smartMessages = useMemo(() => {
    const msgs: { icon: typeof TrendingUp; text: string; style: string }[] = [];

    if (isRestaurant && totalItems > 15) {
      msgs.push({ icon: Package, text: `Bulk order detected — pickup time adjusted to ${dynamicLabel}`, style: 'bg-secondary/50 text-secondary-foreground' });
    }

    if (totalItems > 8 && !isRestaurant) {
      msgs.push({ icon: TrendingUp, text: `Large order — estimated pickup in ${dynamicLabel}`, style: 'bg-muted text-muted-foreground' });
    }

    // Check for commonly paired items
    const cats = new Set(items.map(i => i.product.category));
    if (cats.has('deli') && !cats.has('bakery')) {
      msgs.push({ icon: Zap, text: 'Tip: Add tortillas — commonly ordered with deli items', style: 'bg-accent/10 text-accent' });
    }
    if (cats.has('meat') && !cats.has('produce')) {
      msgs.push({ icon: Zap, text: 'Don\'t forget produce — perfect with your meat selection', style: 'bg-accent/10 text-accent' });
    }

    // Reorder suggestion
    if (orders.length > 0 && items.length > 0) {
      const lastOrder = orders[0];
      const overlap = items.filter(i => lastOrder.items.some(li => li.product.id === i.product.id));
      if (overlap.length >= 2) {
        msgs.push({ icon: RotateCcw, text: `This order looks similar to ${lastOrder.id} — repeat pattern detected`, style: 'bg-primary/5 text-primary' });
      }
    }

    return msgs;
  }, [items, totalItems, isRestaurant, dynamicLabel, orders]);

  // Reorder handler
  const handleReorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    order.items.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) addItem(product);
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col pb-28">
        <PageHeader title="Cart" />
        <div className="flex flex-col items-center justify-center px-6 pt-12 text-center">
          <span className="mb-5 text-7xl">🛒</span>
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Your cart is empty</h2>
          <p className="text-base text-muted-foreground md:text-lg">Browse our store and add some items!</p>
          <Button size="lg" onClick={() => navigate('/browse')} className="mt-8 h-14 rounded-2xl px-10 text-lg font-bold active:scale-95 transition-transform">
            Start Shopping
          </Button>
        </div>
        {orders.length > 0 && (
          <div className="px-4 mt-8">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Reorder a Previous Order
            </h3>
            <div className="space-y-2">
              {orders.map(order => (
                <button key={order.id} onClick={() => handleReorder(order.id)}
                  className="w-full rounded-2xl border-2 border-border bg-card p-4 text-left active:scale-[0.98] transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-foreground">{order.id}</span>
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.items.map(i => `${i.product.name} ×${i.quantity}`).join(', ')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</span>
                    <span className="text-xs text-primary font-semibold">Tap to reorder</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

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

  const namePrefix = customer?.firstName ? `${customer.firstName}, your` : 'Your';
  const modeLabel = isRestaurant ? 'bulk' : '';
  const aiSummary = summaryParts.length > 0
    ? `${namePrefix} ${modeLabel} order from ${selectedStore.name} includes ${summaryParts.join(', ')}${isRestaurant ? ' — great for your business!' : ' — looks like a great haul!'} 🛍️`
    : 'Add some items to get started!';

  return (
    <div className="flex flex-col pb-28">
      <PageHeader title="Cart" subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}${isRestaurant ? ' · Bulk' : ''}`} />

      {/* Mode + schedule info */}
      <div className="mx-4 mb-2 flex gap-2">
        {isRestaurant && (
          <div className="flex items-center gap-1.5 rounded-xl bg-secondary/50 px-3 py-1.5 text-xs font-bold text-secondary-foreground">
            <UtensilsCrossed className="h-3 w-3" />
            Restaurant Order
          </div>
        )}
        <button onClick={() => setSchedulerOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/10 transition-colors">
          <CalendarDays className="h-3 w-3" />
          {scheduleLabel}
        </button>
      </div>

      {/* Dynamic pickup timing bar */}
      <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1 md:text-base">
          Pickup at <span className="font-bold text-foreground">Amapola — {selectedStore.name}</span>
        </span>
        <span className="flex items-center gap-1.5 text-sm text-accent font-bold md:text-base">
          <Clock className="h-4 w-4" />{dynamicLabel}
        </span>
      </div>

      {/* Pickup warning */}
      {pickupWarning && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-2xl bg-secondary/30 border border-secondary p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground" />
          <p className="text-xs font-semibold text-secondary-foreground">{pickupWarning}</p>
        </div>
      )}

      {unavailableItems.length > 0 && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-2xl bg-destructive/5 border border-destructive/20 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-bold text-destructive">{unavailableItems.length} item{unavailableItems.length > 1 ? 's' : ''} not available at {selectedStore.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{unavailableItems.map(i => i.product.name).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Smart inline messages */}
      {smartMessages.map((msg, i) => {
        const Icon = msg.icon;
        return (
          <div key={i} className={`mx-4 mb-2 flex items-center gap-2 rounded-xl px-4 py-2.5 ${msg.style}`}>
            <Icon className="h-4 w-4 shrink-0" />
            <p className="text-xs font-semibold">{msg.text}</p>
          </div>
        );
      })}

      <div className="mx-4 mb-4 flex items-start gap-2 rounded-2xl bg-primary/5 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-foreground md:text-base">{aiSummary}</p>
      </div>

      <div className="space-y-2 px-4">
        {items.map(({ product, quantity }) => {
          const avail = isAvailable(product.id);
          return (
            <motion.div key={product.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className={`flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 ${!avail ? 'opacity-50' : ''}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden text-3xl md:h-16 md:w-16">
                {product.image ? (
                  <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  product.emoji
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-base font-bold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${(product.price * quantity).toFixed(2)}
                  {!avail && <span className="ml-1 text-destructive font-semibold">· Not at {selectedStore.name}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQuantity(product.id, Math.max(0, quantity - qtyStep))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-base font-bold text-foreground">{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + qtyStep)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform">
                  <Plus className="h-4 w-4" />
                </button>
                <button onClick={() => removeItem(product.id)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-destructive active:scale-90 transition-transform">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mx-4 mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-5 py-4">
          <span className="text-base font-semibold text-muted-foreground">Subtotal</span>
          <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
        </div>
        <Button size="lg" onClick={() => navigate('/confirmation')} className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg active:scale-[0.97] transition-transform md:h-20 md:text-2xl">
          Confirm Pickup Order
        </Button>
        <Button variant="outline" size="lg" onClick={() => setSwitcherOpen(true)} className="h-14 w-full rounded-2xl text-lg font-semibold border-2 active:scale-[0.97] transition-transform">
          Change Store
        </Button>
      </div>

      <StoreSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
      <PickupScheduler open={schedulerOpen} onOpenChange={setSchedulerOpen} />
    </div>
  );
};

export default Cart;
