import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findAiResponse, getProductById } from '@/data/products';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { useCart } from '@/store/cartStore';
import ProductCard from '@/components/ProductCard';
import PageHeader from '@/components/PageHeader';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  productIds?: string[];
}

const AiAssistant = () => {
  const { selectedStore } = useStore();
  const { customer } = useCustomer();
  const { isRestaurant, mode } = useMode();
  const { scheduleLabel, dynamicLabel, pickupWarning } = usePickup();
  const { orders } = useOrderHistory();
  const { items: cartItems, totalItems: cartTotal } = useCart();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [responseCount, setResponseCount] = useState(0);

  const name = customer?.firstName ?? '';

  const quickPrompts = isRestaurant
    ? [
        { label: '📦 Weekly restock', query: 'restock' },
        { label: '🌮 Taco supplies bulk', query: 'taco' },
        { label: '🫔 Tamale prep', query: 'tamales' },
        { label: '⭐ Popular bulk', query: 'popular' },
        { label: '💰 Best value', query: 'budget' },
      ]
    : [
        { label: '🌮 Taco Night', query: 'taco night' },
        { label: '🫔 Tamales', query: 'tamales' },
        { label: '⭐ Popular', query: 'popular' },
        { label: '🔥 Carne Asada', query: 'carne asada' },
        { label: '💰 Budget', query: 'budget' },
      ];

  // Build session context string for AI awareness
  const buildSessionContext = useCallback(() => {
    const parts: string[] = [];

    // Cart awareness
    if (cartTotal > 0) {
      const cartCategories = [...new Set(cartItems.map(i => i.product.category))];
      parts.push(`You have ${cartTotal} items in cart (${cartCategories.join(', ')})`);
    }

    // Pickup timing
    parts.push(`Pickup: ${dynamicLabel} at ${selectedStore.name}`);

    if (pickupWarning) parts.push(`⚠️ ${pickupWarning}`);

    // Restaurant context
    if (isRestaurant && cartTotal > 15) {
      parts.push('This is a large bulk order — I\'ll suggest accordingly.');
    }

    return parts.join(' · ');
  }, [cartTotal, cartItems, dynamicLabel, selectedStore.name, pickupWarning, isRestaurant]);

  useEffect(() => {
    const greeting = name ? `${name}, welcome` : 'Welcome';
    const modeNote = isRestaurant
      ? `\n\nI see you're ordering for your business. I'll suggest bulk quantities and restaurant-ready items.`
      : '';
    const reorderNote = orders.length > 0
      ? `\n\n🔄 I noticed you have ${orders.length} past order${orders.length > 1 ? 's' : ''}. Ask me to "reorder" anytime!`
      : '';
    const cartNote = cartTotal > 0
      ? `\n\n🛒 You already have ${cartTotal} items in your cart. I'll keep that in mind.`
      : '';

    setMessages([{
      id: 'welcome',
      role: 'ai',
      text: `${greeting} to Amapola — ${selectedStore.name} 🌺\n\nI'm your market assistant. I know every aisle, every specialty, and what's fresh right now.\n\nPickup: ${scheduleLabel} · Ready in ${dynamicLabel}.${modeNote}${reorderNote}${cartNote}\n\nTell me what you're cooking or tap a suggestion below.`,
    }]);
    setResponseCount(0);
  }, [selectedStore, customer, isRestaurant, scheduleLabel]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (query?: string) => {
    const q = (query ?? input).trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q };
    const newCount = responseCount + 1;
    setResponseCount(newCount);

    // Handle reorder query
    if (q.toLowerCase().includes('reorder') && orders.length > 0) {
      const lastOrder = orders[0];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${name ? `${name}, ` : ''}your last order (${lastOrder.id}) from ${lastOrder.storeName} was ${lastOrder.date}:\n\n${lastOrder.items.map(i => `• ${i.product.name} ×${i.quantity}`).join('\n')}\n\nTotal: $${lastOrder.total.toFixed(2)}\n\n${isRestaurant ? 'This looks like a regular business restock. I recommend repeating it.' : 'Want me to add these to your cart?'} Tap the items below to add them!`,
        productIds: lastOrder.items.map(i => i.product.id),
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    const aiRes = findAiResponse(q);

    let storeNote = '';
    const unavailableInResponse = aiRes.productIds.filter(id => selectedStore.unavailable.includes(id));
    if (unavailableInResponse.length > 0) {
      const names = unavailableInResponse.map(id => getProductById(id)?.name).filter(Boolean).join(', ');
      storeNote = `\n\n⚠️ Heads up${name ? `, ${name}` : ''}: ${names} may not be available at ${selectedStore.name} right now.`;
    }

    const specialtiesInResponse = aiRes.productIds.filter(id => selectedStore.specialties.includes(id));
    if (specialtiesInResponse.length > 0) {
      const names = specialtiesInResponse.map(id => getProductById(id)?.name).filter(Boolean).join(', ');
      storeNote += `\n\n⭐ ${selectedStore.name} specialty: ${names}`;
    }

    const bulkNote = isRestaurant ? `\n\n📦 Restaurant tip: Tap + to add in bulk increments of 5.` : '';
    const personalNote = name ? `\n\n📍 ${name}, your order from ${selectedStore.name} will be ready in ${dynamicLabel}.` : `\n\n📍 Estimated pickup: ${dynamicLabel}`;

    // Session-aware context notes (evolve with conversation)
    let sessionNote = '';
    if (newCount >= 3 && cartTotal > 0) {
      sessionNote = `\n\n💡 ${buildSessionContext()}`;
    }
    if (newCount >= 2 && isRestaurant && cartTotal > 10) {
      sessionNote += `\n\n📊 Bulk order tip: Consider scheduling pickup for later to ensure everything is prepared.`;
    }

    // Pickup warning injection
    if (pickupWarning) {
      sessionNote += `\n\n⏰ ${pickupWarning}`;
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiRes.message + storeNote + bulkNote + personalNote + sessionNote,
      productIds: aiRes.productIds,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col pb-28">
      <PageHeader title="Market Assistant" subtitle={`${isRestaurant ? 'Bulk ordering' : 'Shopping'} at ${selectedStore.name}`} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-5 py-3 text-base text-primary-foreground whitespace-pre-line font-medium">{msg.text}</div>
              ) : (
                <div className="space-y-3">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-5 py-3 text-base text-foreground whitespace-pre-line">{msg.text}</div>
                  {msg.productIds && (
                    <div className="space-y-2 pl-1">
                      {msg.productIds.map(id => {
                        const product = getProductById(id);
                        return product ? <ProductCard key={id} product={product} compact /> : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {quickPrompts.map(qp => (
              <button key={qp.query} onClick={() => send(qp.query)}
                className="rounded-full border-2 border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground active:scale-95 active:border-primary transition-all">
                {qp.label}
              </button>
            ))}
            {orders.length > 0 && (
              <button onClick={() => send('reorder')}
                className="rounded-full border-2 border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary active:scale-95 transition-all flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reorder last
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="flex gap-3">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={isRestaurant ? 'What does your kitchen need?' : 'What are you cooking today?'}
            className="h-13 flex-1 rounded-xl border-muted bg-muted/50 text-base md:text-lg px-4" />
          <Button size="icon" onClick={() => send()} className="h-13 w-13 shrink-0 rounded-xl active:scale-95 transition-transform">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
