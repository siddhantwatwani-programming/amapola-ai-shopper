import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Lightbulb, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findAiResponse, getProductById, productPairings, products } from '@/data/products';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import { useMode } from '@/store/modeContext';
import { usePickup } from '@/store/pickupContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { useCart } from '@/store/cartStore';
import { useLanguage } from '@/store/languageContext';
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
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  const { customer } = useCustomer();
  const { isRestaurant, mode, qtyStep } = useMode();
  const { t } = useLanguage();
  const { scheduleLabel, dynamicLabel, pickupWarning } = usePickup();
  const { orders } = useOrderHistory();
  const { items: cartItems, totalItems: cartTotal, addItem } = useCart();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [responseCount, setResponseCount] = useState(0);
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [lastRecommendedIds, setLastRecommendedIds] = useState<string[]>([]);
  // Track categories already explored in session to avoid repetition
  const [exploredCategories, setExploredCategories] = useState<string[]>([]);

  const name = customer?.firstName ?? '';
  const addr = (n: string) => n ? `${n}, ` : '';

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

  // --- Dynamic follow-up engine ---
  // Always returns 2-4 context-aware, session-evolving options. Never empty.
  const generateFollowUps = useCallback((recommendedIds: string[], context?: string): { label: string; query: string }[] => {
    const prompts: { label: string; query: string }[] = [];
    const cartProductIds = cartItems.map(i => i.product.id);
    const allRelevantIds = [...cartProductIds, ...recommendedIds];
    const cartCats = [...new Set(cartItems.map(i => i.product.category))];
    const topicSet = new Set(sessionTopics);

    // 1. Pairing-based follow-up (most contextual)
    for (const id of recommendedIds) {
      const pairing = productPairings[id];
      if (pairing) {
        const missing = pairing.ids.filter(pid => !cartProductIds.includes(pid) && !recommendedIds.includes(pid));
        if (missing.length > 0) {
          const product = getProductById(id);
          if (product) {
            prompts.push({ label: `🔗 Pairs with ${product.name}`, query: `what goes with ${product.name}` });
            break;
          }
        }
      }
    }

    // 2. Category exploration (suggest unexplored categories)
    const allCats = ['bakery', 'deli', 'produce', 'beverages', 'snacks', 'pantry', 'meat', 'dairy'] as const;
    const unexploredCats = allCats.filter(c => !exploredCategories.includes(c) && !cartCats.includes(c as any));
    const catSuggestions: Record<string, { label: string; query: string }> = {
      bakery: { label: '🥖 Fresh from our Bakery', query: 'bakery items' },
      deli: { label: '🥩 Deli counter picks', query: 'deli meats' },
      produce: { label: '🥬 Fresh produce', query: 'fresh produce' },
      beverages: { label: '🥤 Add drinks', query: 'drinks' },
      snacks: { label: '🍿 Snacks & sweets', query: 'snacks' },
      pantry: { label: '🫘 Pantry staples', query: 'pantry essentials' },
      meat: { label: '🐟 Meat & seafood', query: 'seafood' },
      dairy: { label: '🧀 Dairy & cheese', query: 'cheese' },
    };
    if (unexploredCats.length > 0) {
      const nextCat = unexploredCats[0];
      const suggestion = catSuggestions[nextCat];
      if (suggestion && !prompts.some(p => p.query === suggestion.query)) {
        prompts.push(suggestion);
      }
    }

    // 3. Cart-progression prompts (evolve with cart size)
    if (cartTotal === 0) {
      if (!prompts.some(p => p.query.includes('popular'))) {
        prompts.push({ label: '⭐ What\'s popular today?', query: 'popular' });
      }
    } else if (cartTotal > 0 && cartTotal < 5) {
      if (!topicSet.has('dessert') && !cartCats.includes('snacks')) {
        prompts.push({ label: '🍰 Something sweet?', query: 'dessert' });
      }
    } else if (cartTotal >= 5 && cartTotal < 15) {
      prompts.push({ label: '⏱️ Best pickup time?', query: 'when should I pick up' });
    } else if (cartTotal >= 15) {
      if (isRestaurant) {
        prompts.push({ label: '📊 Optimize my bulk order', query: 'optimize bulk order' });
      } else {
        prompts.push({ label: '✅ Ready to checkout', query: 'I\'m done ordering' });
      }
    }

    // 4. Restaurant-specific bulk prompts
    if (isRestaurant && cartTotal > 3 && !prompts.some(p => p.query.includes('optimize'))) {
      prompts.push({ label: '📦 Review bulk quantities', query: 'optimize bulk order' });
    }

    // 5. Reorder prompt if user has history and hasn't used it
    if (orders.length > 0 && !topicSet.has('reorder') && cartTotal < 3) {
      prompts.push({ label: '🔄 Reorder last order', query: 'reorder' });
    }

    // 6. Store specialty prompt
    if (selectedStore.specialties.length > 0 && responseCount < 3 && !topicSet.has('specialty')) {
      const specName = getProductById(selectedStore.specialties[0])?.name;
      if (specName) {
        prompts.push({ label: `⭐ ${selectedStore.name} specialty`, query: `what's special at this store` });
      }
    }

    // 7. Conversation-specific context-aware fallbacks
    if (context === 'done') {
      return [
        { label: '🛒 Go to cart', query: 'take me to cart' },
        { label: '🍰 Wait, add dessert', query: 'dessert' },
        ...(isRestaurant ? [{ label: '📅 Schedule for tomorrow', query: 'schedule pickup' }] : []),
      ].slice(0, 3);
    }
    if (context === 'pickup') {
      return [
        { label: '📅 Schedule for later', query: 'schedule pickup' },
        ...(cartTotal > 0 ? [{ label: '✅ Ready to checkout', query: 'I\'m done ordering' }] : []),
        { label: '➕ Add more items', query: 'what else should I add' },
      ].slice(0, 3);
    }

    // Deduplicate and cap at 4
    const seen = new Set<string>();
    const deduped = prompts.filter(p => {
      if (seen.has(p.query)) return false;
      seen.add(p.query);
      return true;
    });

    // Ensure minimum 2 — add fallback options
    if (deduped.length < 2) {
      const fallbacks = [
        { label: '🌮 What\'s for dinner?', query: 'dinner ideas' },
        { label: '💰 Best deals today', query: 'budget' },
        { label: '⭐ Customer favorites', query: 'popular' },
        { label: '🛒 Review my cart', query: 'what\'s in my cart' },
      ];
      for (const fb of fallbacks) {
        if (!seen.has(fb.query) && !topicSet.has(fb.query)) {
          deduped.push(fb);
          seen.add(fb.query);
          if (deduped.length >= 2) break;
        }
      }
    }

    return deduped.slice(0, 4);
  }, [cartItems, sessionTopics, isRestaurant, cartTotal, exploredCategories, orders, selectedStore, responseCount]);

  // --- Welcome message ---
  useEffect(() => {
    const storeSpecialties = selectedStore.specialties.slice(0, 2).map(id => getProductById(id)?.name).filter(Boolean);
    const specialtyLine = storeSpecialties.length > 0 ? `\n\nToday's ${selectedStore.name} highlights: ${storeSpecialties.join(' and ')}.` : '';
    const modeNote = isRestaurant
      ? `\n\nI see you're ordering for your business — I'll prioritize bulk-ready items and volume pricing.`
      : '';
    const reorderNote = orders.length > 0
      ? `\n\n🔄 Your last order is on file — say "reorder" to repeat it.`
      : '';
    const cartNote = cartTotal > 0
      ? `\n\n🛒 ${cartTotal} items already in your cart. I'll build on that.`
      : '';

    setMessages([{
      id: 'welcome',
      role: 'ai',
      text: `${name ? `${name}, welcome back` : 'Welcome'} to Amapola — ${selectedStore.name}. 🌺\n\nI know this store inside and out. Tell me what you're making and I'll pull everything you need.\n\nPickup: ${scheduleLabel} · Ready in ${dynamicLabel}.${specialtyLine}${modeNote}${reorderNote}${cartNote}`,
      followUpPrompts: undefined, // Initial prompts handled by quickPrompts
    }]);
    setResponseCount(0);
    setSessionTopics([]);
    setLastRecommendedIds([]);
    setExploredCategories([]);
  }, [selectedStore, customer, isRestaurant, scheduleLabel]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // --- "What's in my cart" handler ---
  const handleCartReview = (userMsg: Message): Message => {
    if (cartTotal === 0) {
      return {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}your cart is empty. Let's change that — what are you in the mood for?`,
        followUpPrompts: generateFollowUps([], undefined),
      };
    }
    const cartCats = [...new Set(cartItems.map(i => i.product.category))];
    const cartSummary = cartItems.map(i => `• ${i.product.name} ×${i.quantity}`).join('\n');
    const missingCats = (['produce', 'bakery', 'beverages', 'deli'] as const).filter(c => !cartCats.includes(c));
    const missingNote = missingCats.length > 0
      ? `\n\nI notice you haven't added anything from ${missingCats.slice(0, 2).join(' or ')} yet — want me to suggest some items?`
      : '\n\nLooks like a well-rounded order.';
    return {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: `${addr(name)}here's your current cart (${cartTotal} items):\n\n${cartSummary}\n\nTotal: $${cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(2)}${missingNote}`,
      followUpPrompts: generateFollowUps(cartItems.map(i => i.product.id)),
    };
  };

  // --- Store specialty handler ---
  const handleStoreSpecialty = (userMsg: Message): Message => {
    const specProducts = selectedStore.specialties.map(id => getProductById(id)).filter(Boolean);
    const specNames = specProducts.map(p => p!.name).join(', ');
    return {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: `${addr(name)}${selectedStore.name} is known for a few items you won't find this fresh anywhere else:\n\n${specProducts.map(p => `⭐ ${p!.name} — ${p!.description}`).join('\n')}\n\nThese move fast, especially on weekends. I'd grab them now.`,
      productIds: selectedStore.specialties,
      followUpPrompts: generateFollowUps(selectedStore.specialties),
    };
  };

  // --- Main send function ---
  const send = (query?: string) => {
    const q = (query ?? input).trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q };
    const newCount = responseCount + 1;
    setResponseCount(newCount);

    const lowerQ = q.toLowerCase();
    setSessionTopics(prev => [...prev, lowerQ]);

    // Track explored categories from query keywords
    const catKeywords: Record<string, string> = {
      bakery: 'bakery', tortilla: 'bakery', bread: 'bakery', pan: 'bakery',
      deli: 'deli', meat: 'meat', seafood: 'meat', fish: 'meat',
      produce: 'produce', vegetable: 'produce', fruit: 'produce',
      drink: 'beverages', beverage: 'beverages', agua: 'beverages',
      snack: 'snacks', candy: 'snacks', sweet: 'snacks',
      cheese: 'dairy', milk: 'dairy', egg: 'dairy',
      bean: 'pantry', rice: 'pantry', chile: 'pantry',
    };
    for (const [kw, cat] of Object.entries(catKeywords)) {
      if (lowerQ.includes(kw)) {
        setExploredCategories(prev => prev.includes(cat) ? prev : [...prev, cat]);
      }
    }

    // --- Cart review ---
    if (lowerQ.includes('what\'s in my cart') || lowerQ.includes('review my cart') || lowerQ.includes('my cart')) {
      const aiMsg = handleCartReview(userMsg);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Store specialty ---
    if (lowerQ.includes('special') && (lowerQ.includes('store') || lowerQ.includes('this'))) {
      setSessionTopics(prev => [...prev, 'specialty']);
      const aiMsg = handleStoreSpecialty(userMsg);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- "What goes with X" ---
    const goesWithMatch = lowerQ.match(/what goes with (.+)/);
    if (goesWithMatch) {
      const itemName = goesWithMatch[1];
      const matchedProduct = cartItems.find(i => i.product.name.toLowerCase().includes(itemName)) ??
        [...lastRecommendedIds].map(id => getProductById(id)).find(p => p?.name.toLowerCase().includes(itemName));

      if (matchedProduct) {
        const product = 'product' in matchedProduct ? (matchedProduct as any).product : matchedProduct;
        const pairing = productPairings[product.id];
        if (pairing) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: `${addr(name)}${product.name} is one of our strongest sellers. ${pairing.reason}.\n\n${isRestaurant ? '📦 All available in bulk. Tap + to add in restaurant quantities.' : 'Our regulars never grab one without the other — here\'s the full combo:'}`,
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

    // --- Optimize bulk order ---
    if (lowerQ.includes('optimize') && lowerQ.includes('bulk')) {
      const cartCats = [...new Set(cartItems.map(i => i.product.category))];
      const gaps: string[] = [];
      if (!cartCats.includes('bakery')) gaps.push('tortillas — essential for any restaurant');
      if (!cartCats.includes('produce')) gaps.push('fresh produce (cilantro, limes, onions)');
      if (!cartCats.includes('beverages')) gaps.push('beverages for your customers');
      if (!cartCats.includes('pantry')) gaps.push('pantry staples (rice, beans)');

      const missingIds: string[] = [];
      if (!cartCats.includes('bakery')) missingIds.push('b3', 'b5');
      if (!cartCats.includes('produce')) missingIds.push('p3', 'p5', 'p8');
      if (!cartCats.includes('beverages')) missingIds.push('bv1', 'bv3');
      if (!cartCats.includes('pantry')) missingIds.push('pa1', 'pa2');

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}I've reviewed your ${cartTotal}-item order.\n\n${gaps.length > 0 ? `Gaps I see:\n${gaps.map(g => `→ ${g}`).join('\n')}\n\nHere's what I'd add to round it out:` : 'Solid order — you\'ve covered the essentials. A few items that move well alongside what you have:'}\n\n${isRestaurant ? '📦 All available in bulk increments.' : ''}`,
        productIds: missingIds.slice(0, 6),
        followUpPrompts: [
          { label: '✅ Looks complete', query: 'I\'m done ordering' },
          { label: '⏱️ Pickup timing?', query: 'when should I pick up' },
          { label: '➕ Show me more', query: 'what else should I add' },
        ],
      };
      setLastRecommendedIds(missingIds);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Pickup timing ---
    if (lowerQ.includes('pick up') || lowerQ.includes('pickup') || lowerQ.includes('when should')) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}for your ${cartTotal}-item order${isRestaurant ? ' (bulk)' : ''}:\n\n⏱️ ${dynamicLabel} at ${selectedStore.name}\n${pickupWarning ? `\n⚠️ ${pickupWarning}` : ''}\n\n${isRestaurant && cartTotal > 15 ? 'For bulk orders this size, early morning pickup gives you the freshest items and shortest wait.' : 'We start prepping as soon as you confirm — the sooner you order, the sooner it\'s ready.'}`,
        followUpPrompts: generateFollowUps(lastRecommendedIds, 'pickup'),
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Done ordering ---
    if (lowerQ.includes('take me to cart') || lowerQ.includes('go to cart')) {
      navigate('/cart');
      return;
    }

    if (lowerQ.includes('done') || lowerQ.includes('checkout') || lowerQ.includes('that\'s all')) {
      const cartValue = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}solid order. Here's the summary:\n\n🛒 ${cartTotal} items · $${cartValue.toFixed(2)}\n📍 Pickup: ${dynamicLabel} at ${selectedStore.name}\n\nHead to your cart to confirm.${isRestaurant ? ' All bulk quantities are locked in.' : ''}\n\n¡Gracias por comprar en Amapola! 🌺`,
        followUpPrompts: generateFollowUps(lastRecommendedIds, 'done'),
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Reorder ---
    if (lowerQ.includes('reorder') && orders.length > 0) {
      const lastOrder = orders[0];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}pulling up your last order (${lastOrder.id}) from ${lastOrder.storeName}, placed ${lastOrder.date}:\n\n${lastOrder.items.map(i => `• ${i.product.name} ×${i.quantity}`).join('\n')}\n\nTotal was $${lastOrder.total.toFixed(2)}. ${isRestaurant ? 'Looks like a standard restock — I\'d keep the same quantities.' : 'Everything here is still in stock.'} Tap below to add it all, or pick individual items.`,
        productIds: lastOrder.items.map(i => i.product.id),
        followUpPrompts: [
          { label: '➕ Add all to cart', query: 'add reorder to cart' },
          { label: '✏️ Modify items', query: 'I want to change some items' },
          { label: '🔗 Add pairings', query: `what goes with ${lastOrder.items[0]?.product.name ?? 'this'}` },
        ],
      };
      setLastRecommendedIds(lastOrder.items.map(i => i.product.id));
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Add reorder to cart ---
    if (lowerQ.includes('add reorder') && orders.length > 0) {
      const lastOrder = orders[0];
      lastOrder.items.forEach(({ product, quantity }) => {
        for (let i = 0; i < quantity; i++) addItem(product);
      });
      const newTotal = cartTotal + lastOrder.items.reduce((s, i) => s + i.quantity, 0);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Done — ${lastOrder.items.length} items added from your last order.${isRestaurant ? ' Quantities match your previous business order.' : ''}\n\n🛒 Cart now has ${newTotal} items.\n\nAnything else to add, or are we good to go?`,
        followUpPrompts: [
          { label: '✅ That\'s everything', query: 'I\'m done ordering' },
          { label: '🥤 Add drinks', query: 'drinks' },
          { label: '🍰 Add dessert', query: 'dessert' },
        ],
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- "What else should I add" / general advice ---
    if (lowerQ.includes('what else') || lowerQ.includes('what should i add') || lowerQ.includes('dinner idea')) {
      const cartCats = [...new Set(cartItems.map(i => i.product.category))];
      const suggestions: string[] = [];
      const suggestedIds: string[] = [];

      if (!cartCats.includes('beverages')) { suggestions.push('Drinks'); suggestedIds.push('bv3', 'bv1'); }
      if (!cartCats.includes('snacks')) { suggestions.push('Snacks'); suggestedIds.push('s6', 's1'); }
      if (!cartCats.includes('bakery')) { suggestions.push('Bakery'); suggestedIds.push('b2', 'b3'); }
      if (!cartCats.includes('deli') && !cartCats.includes('meat')) { suggestions.push('Protein'); suggestedIds.push('d1', 'm3'); }
      if (suggestedIds.length === 0) suggestedIds.push('b4', 'f2', 'bv4'); // Dessert/treat fallback

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `${addr(name)}based on what's in your cart, I'd round it out with${suggestions.length > 0 ? ` something from ${suggestions.join(', ')}` : ' a few treats'}. Here's what I'd pick:`,
        productIds: suggestedIds.slice(0, 4),
        followUpPrompts: generateFollowUps(suggestedIds),
      };
      setLastRecommendedIds(suggestedIds);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
      return;
    }

    // --- Standard AI response ---
    const aiRes = findAiResponse(q);

    // Unavailable items — suggest alternatives
    let storeNote = '';
    const unavailable = aiRes.productIds.filter(id => selectedStore.unavailable.includes(id));
    const available = aiRes.productIds.filter(id => !selectedStore.unavailable.includes(id));
    if (unavailable.length > 0) {
      const names = unavailable.map(id => getProductById(id)?.name).filter(Boolean).join(', ');
      // Find alternatives in same category
      const altIds: string[] = [];
      for (const uid of unavailable) {
        const uProd = getProductById(uid);
        if (uProd) {
          const alt = products.find(p => p.category === uProd.category && !selectedStore.unavailable.includes(p.id) && !available.includes(p.id) && p.id !== uid);
          if (alt) altIds.push(alt.id);
        }
      }
      storeNote = `\n\n⚠️ ${names} ${unavailable.length === 1 ? 'isn\'t' : 'aren\'t'} available at ${selectedStore.name} right now.${altIds.length > 0 ? ` I've swapped in alternatives below.` : ' I\'ve adjusted the list.'}`;
      available.push(...altIds);
    }

    const specialties = aiRes.productIds.filter(id => selectedStore.specialties.includes(id));
    if (specialties.length > 0) {
      const names = specialties.map(id => getProductById(id)?.name).filter(Boolean).join(', ');
      storeNote += `\n\n⭐ ${selectedStore.name} house specialty: ${names} — made fresh here.`;
    }

    const bulkNote = isRestaurant ? `\n\n📦 All items available in bulk. Tap + to add in quantities of 5.` : '';

    // Session-aware context notes
    let sessionNote = '';
    if (newCount >= 2 && sessionTopics.length > 1) {
      const prevTopics = sessionTopics.slice(0, -1);
      const relatedTopic = prevTopics.find(t =>
        (t.includes('taco') && lowerQ.includes('drink')) ||
        (t.includes('meat') && lowerQ.includes('tortilla')) ||
        (t.includes('breakfast') && lowerQ.includes('drink')) ||
        (t.includes('carne') && lowerQ.includes('tortilla')) ||
        (t.includes('seafood') && lowerQ.includes('lime'))
      );
      if (relatedTopic) {
        sessionNote = `\n\n💡 Good call — this pairs perfectly with the ${relatedTopic} you were looking at earlier.`;
      }
    }

    // Cart-aware note
    if (cartTotal > 0 && newCount >= 2) {
      const cartCats = [...new Set(cartItems.map(i => i.product.category))];
      const newCatItems = available.filter(id => {
        const p = getProductById(id);
        return p && !cartCats.includes(p.category) && !cartItems.some(ci => ci.product.id === id);
      });
      if (newCatItems.length > 0) {
        sessionNote += `\n\n🛒 These fill gaps in your current cart — categories you haven't covered yet.`;
      }
    }

    if (pickupWarning && newCount >= 3) {
      sessionNote += `\n\n⏰ ${pickupWarning}`;
    }

    // Pickup context on later turns
    const pickupNote = newCount <= 1
      ? `\n\n📍 Pickup from ${selectedStore.name} in ${dynamicLabel}.`
      : '';

    const followUps = generateFollowUps(available);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiRes.message + storeNote + bulkNote + pickupNote + sessionNote,
      productIds: available.length > 0 ? available : aiRes.productIds,
      followUpPrompts: followUps,
    };

    setLastRecommendedIds(available.length > 0 ? available : aiRes.productIds);
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const lastAiMessage = [...messages].reverse().find(m => m.role === 'ai');
  const activeFollowUps = lastAiMessage?.followUpPrompts;

  return (
    <div className="flex h-full flex-col pb-28">
      <PageHeader title={t('ai.title')} subtitle={`${isRestaurant ? t('ai.bulkOrdering') : t('ai.shopping')} ${t('ai.at')} ${selectedStore.name}`} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`mb-3 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-line font-medium">{msg.text}</div>
              ) : (
                <div className="space-y-2">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-foreground whitespace-pre-line">{msg.text}</div>
                  {msg.productIds && msg.productIds.length > 0 && (
                    <div className="space-y-1.5 pl-1">
                      {msg.productIds.map(id => {
                        const product = getProductById(id);
                        return product ? <ProductCard key={id} product={product} compact /> : null;
                      })}
                      <button
                        onClick={() => {
                          msg.productIds!.forEach(id => {
                            const product = getProductById(id);
                            if (product) {
                              for (let i = 0; i < qtyStep; i++) addItem(product);
                            }
                          });
                        }}
                        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground active:scale-95 transition-transform"
                      >
                        <Plus className="h-4 w-4" />
                        {t('ai.addAllToCart')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Initial quick prompts */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickPrompts.map(qp => (
              <button key={qp.query} onClick={() => send(qp.query)}
                className="rounded-full border-2 border-border bg-card px-3 py-2 text-xs font-bold text-foreground active:scale-95 active:border-primary transition-all">
                {qp.label}
              </button>
            ))}
            {orders.length > 0 && (
              <button onClick={() => send('reorder')}
                className="rounded-full border-2 border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary active:scale-95 transition-all flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                {t('ai.reorderLast')}
              </button>
            )}
          </div>
        )}

        {/* Contextual follow-up prompts — always visible after first exchange */}
        {messages.length > 1 && activeFollowUps && activeFollowUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="flex flex-wrap gap-1.5 mt-1.5 mb-1.5"
          >
            <Lightbulb className="h-4 w-4 text-muted-foreground mt-1.5" />
            {activeFollowUps.map(fp => (
              <button key={fp.query} onClick={() => send(fp.query)}
                className="rounded-full border-2 border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary active:scale-95 transition-all">
                {fp.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={isRestaurant ? t('ai.placeholderRestaurant') : t('ai.placeholderConsumer')}
            className="h-13 flex-1 rounded-xl border-muted bg-muted/50 text-base md:text-lg px-4" />
          <Button size="icon" onClick={() => send()} className="h-13 w-13 shrink-0 rounded-xl px-3 active:scale-95 transition-transform">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
