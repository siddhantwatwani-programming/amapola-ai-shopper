import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findAiResponse, getProductById, productPairings } from '@/data/products';
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
  followUpPrompts?: { label: string; query: string }[];
}

const AiAssistant = () => {
  const { selectedStore } = useStore();
  const { customer } = useCustomer();
  const { isRestaurant, mode } = useMode();
  const { scheduleLabel, dynamicLabel, pickupWarning } = usePickup();
  const { orders } = useOrderHistory();
  const { items: cartItems, totalItems: cartTotal, addItem } = useCart();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [responseCount, setResponseCount] = useState(0);
  // Track topics discussed this session for context continuity
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  // Track last recommended product IDs to avoid repeating
  const [lastRecommendedIds, setLastRecommendedIds] = useState<string[]>([]);

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

  // Generate follow-up prompts based on cart contents
  const generateFollowUps = useCallback((recommendedIds: string[]): { label: string; query: string }[] => {
    const prompts: { label: string; query: string }[] = [];
    const cartProductIds = cartItems.map(i => i.product.id);
    const allRelevantIds = [...cartProductIds, ...recommendedIds];

    // Find pairings for recently added/recommended items
    for (const id of allRelevantIds) {
      const pairing = productPairings[id];
      if (pairing) {
        const missingItems = pairing.ids.filter(pid => !cartProductIds.includes(pid));
        if (missingItems.length > 0) {
          const product = getProductById(id);
          if (product) {
            prompts.push({
              label: `🔗 What goes with ${product.name}?`,
              query: `what goes with ${product.name}`,
            });
            break; // Only one pairing prompt
          }
        }
      }
    }

    // Suggest based on what's NOT in cart yet from session topics
    if (sessionTopics.length > 0 && !sessionTopics.includes('dessert')) {
      prompts.push({ label: '🍰 Add dessert?', query: 'dessert' });
    }
    if (sessionTopics.length > 0 && !sessionTopics.includes('drink')) {
      prompts.push({ label: '🥤 Add drinks?', query: 'drinks' });
    }

    // Bulk suggestion for restaurant
    if (isRestaurant && cartTotal > 5) {
      prompts.push({ label: '📊 Optimize my bulk order', query: 'optimize bulk order' });
    }

    return prompts.slice(0, 3);
  }, [cartItems, sessionTopics, isRestaurant, cartTotal]);

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
    setSessionTopics([]);
    setLastRecommendedIds([]);
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

    // Track topic
    const lowerQ = q.toLowerCase();
    setSessionTopics(prev => [...prev, lowerQ]);

    // Handle "what goes with X" queries — pairing-based follow-ups
    const goesWithMatch = lowerQ.match(/what goes with (.+)/);
    if (goesWithMatch) {
      const itemName = goesWithMatch[1];
      const matchedProduct = cartItems.find(i => i.product.name.toLowerCase().includes(itemName)) ??
        [...lastRecommendedIds].map(id => getProductById(id)).find(p => p?.name.toLowerCase().includes(itemName));

      if (matchedProduct) {
        const product = 'product' in matchedProduct ? (matchedProduct as any).product : matchedProduct;
        const pairing = productPairings[product.id];
        if (pairing) {
          const pairingProducts = pairing.ids.map(id => getProductById(id)).filter(Boolean);
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: `${name ? `${name}, ` : ''}great choice with ${product.name}! ${pairing.reason}.\n\n${isRestaurant ? '📦 All available in bulk quantities.' : 'These are the items our regulars always grab together.'}`,
            productIds: pairing.ids,
            followUpPrompts: generateFollowUps(pairing.ids),
          };
          setLastRecommendedIds(pairing.ids);
          setMessages(prev => [...prev, userMsg, aiMsg]);
          setInput('');
          return;
        }
      }
    }

    // Handle "optimize bulk order" 
    if (lowerQ.includes('optimize') && lowerQ.includes('bulk')) {
      const cartCats = [...new Set(cartItems.map(i => i.product.category))];
      const suggestions: string[] = [];
      if (!cartCats.includes('bakery')) suggestions.push('tortillas (flour or corn)');
      if (!cartCats.includes('produce')) suggestions.push('fresh produce (cilantro, limes, onions)');
      if (!cartCats.includes('beverages')) suggestions.push('beverages for your customers');
      if (!cartCats.includes('pantry')) suggestions.push('pantry staples (rice, beans, chiles)');

      const missingIds: string[] = [];
      if (!cartCats.includes('bakery')) missingIds.push('b3', 'b5');
      if (!cartCats.includes('produce')) missingIds.push('p3', 'p5', 'p8');
      if (!cartCats.includes('beverages')) missingIds.push('bv1', 'bv3');
      if (!cartCats.includes('pantry')) missingIds.push('pa1', 'pa2');

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${name ? `${name}, ` : ''}analyzing your ${cartTotal}-item bulk order...\n\n${suggestions.length > 0 ? `I notice you're missing: ${suggestions.join(', ')}.\n\nFor a complete restaurant restock, I'd recommend adding these:` : 'Your order looks comprehensive! Here are a few items that pair well with what you have:'}\n\n${isRestaurant ? '📦 All quantities can be adjusted in bulk increments of 5.' : ''}`,
        productIds: missingIds.slice(0, 6),
        followUpPrompts: [
          { label: '✅ Looks good, checkout', query: 'I\'m done ordering' },
          { label: '🕐 Best pickup time?', query: 'when should I pick up' },
        ],
      };
      setLastRecommendedIds(missingIds);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // Handle pickup timing question
    if (lowerQ.includes('pick up') || lowerQ.includes('pickup') || lowerQ.includes('when should')) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${name ? `${name}, ` : ''}based on your current order (${cartTotal} items${isRestaurant ? ', bulk' : ''}):\n\n⏱️ Estimated pickup: ${dynamicLabel} at ${selectedStore.name}\n${pickupWarning ? `\n⚠️ ${pickupWarning}` : ''}\n\n${isRestaurant && cartTotal > 15 ? 'For large bulk orders, I recommend scheduling early morning pickup — less wait time and everything is freshly prepared.' : 'The earlier you order, the faster we can have it ready!'}`,
        followUpPrompts: [
          { label: '📅 Schedule for later', query: 'schedule pickup' },
          { label: '✅ Ready to checkout', query: 'I\'m done ordering' },
        ],
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // Handle "done ordering"
    if (lowerQ.includes('done') || lowerQ.includes('checkout') || lowerQ.includes('that\'s all')) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${name ? `${name}, ` : ''}your order looks great! 🎉\n\n🛒 ${cartTotal} items · Pickup in ${dynamicLabel}\n📍 ${selectedStore.name}\n\nHead to your cart to confirm the order. ${isRestaurant ? 'All bulk quantities are set.' : ''}\n\n¡Gracias por comprar en Amapola! 🌺`,
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // Handle reorder query
    if (lowerQ.includes('reorder') && orders.length > 0) {
      const lastOrder = orders[0];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${name ? `${name}, ` : ''}your last order (${lastOrder.id}) from ${lastOrder.storeName} was ${lastOrder.date}:\n\n${lastOrder.items.map(i => `• ${i.product.name} ×${i.quantity}`).join('\n')}\n\nTotal: $${lastOrder.total.toFixed(2)}\n\n${isRestaurant ? 'This looks like a regular business restock. I recommend repeating it.' : 'Want me to add these to your cart?'} Tap the items below to add them!`,
        productIds: lastOrder.items.map(i => i.product.id),
        followUpPrompts: [
          { label: '➕ Add all to cart', query: 'add reorder to cart' },
          { label: '✏️ Modify order', query: 'I want to change some items' },
        ],
      };
      setLastRecommendedIds(lastOrder.items.map(i => i.product.id));
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // Handle "add reorder to cart"
    if (lowerQ.includes('add reorder') && orders.length > 0) {
      const lastOrder = orders[0];
      lastOrder.items.forEach(({ product, quantity }) => {
        for (let i = 0; i < quantity; i++) addItem(product);
      });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Done! I've added all ${lastOrder.items.length} items from order ${lastOrder.id} to your cart. ${isRestaurant ? 'Quantities set to match your last business order.' : ''}\n\n🛒 Your cart now has ${cartTotal + lastOrder.items.reduce((s, i) => s + i.quantity, 0)} items.`,
        followUpPrompts: [
          { label: '🛒 Go to cart', query: 'I\'m done ordering' },
          { label: '➕ Add more items', query: 'what else should I add' },
        ],
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // Standard AI response
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

    // Session-aware context: reference previous topics
    let sessionNote = '';
    if (newCount >= 2 && sessionTopics.length > 1) {
      const prevTopics = sessionTopics.slice(0, -1);
      const relatedTopic = prevTopics.find(t =>
        (t.includes('taco') && lowerQ.includes('drink')) ||
        (t.includes('meat') && lowerQ.includes('tortilla')) ||
        (t.includes('breakfast') && lowerQ.includes('drink'))
      );
      if (relatedTopic) {
        sessionNote = `\n\n💡 Since you were also looking at ${relatedTopic} earlier, these pair perfectly together.`;
      }
    }

    // Cart-aware suggestions
    if (cartTotal > 0 && newCount >= 2) {
      const cartCats = [...new Set(cartItems.map(i => i.product.category))];
      const recommended = aiRes.productIds.filter(id => {
        const p = getProductById(id);
        return p && !cartCats.includes(p.category) && !cartItems.some(ci => ci.product.id === id);
      });
      if (recommended.length > 0) {
        sessionNote += `\n\n🛒 Based on your cart, I'd especially recommend the items you don't have yet.`;
      }
    }

    if (pickupWarning && newCount >= 2) {
      sessionNote += `\n\n⏰ ${pickupWarning}`;
    }

    // Generate contextual follow-ups
    const followUps = generateFollowUps(aiRes.productIds);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiRes.message + storeNote + bulkNote + personalNote + sessionNote,
      productIds: aiRes.productIds,
      followUpPrompts: followUps.length > 0 ? followUps : undefined,
    };

    setLastRecommendedIds(aiRes.productIds);
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  // Find the last message's follow-up prompts
  const lastAiMessage = [...messages].reverse().find(m => m.role === 'ai');
  const activeFollowUps = lastAiMessage?.followUpPrompts;

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

        {/* Initial quick prompts */}
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

        {/* Contextual follow-up prompts after AI responses */}
        {messages.length > 1 && activeFollowUps && activeFollowUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="flex flex-wrap gap-2 mt-2 mb-2"
          >
            <Lightbulb className="h-4 w-4 text-muted-foreground mt-1.5" />
            {activeFollowUps.map(fp => (
              <button key={fp.query} onClick={() => send(fp.query)}
                className="rounded-full border-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary active:scale-95 transition-all">
                {fp.label}
              </button>
            ))}
          </motion.div>
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
