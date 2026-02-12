import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findAiResponse, getProductById } from '@/data/products';
import { useStore } from '@/store/storeContext';
import { useCustomer } from '@/store/customerContext';
import ProductCard from '@/components/ProductCard';
import PageHeader from '@/components/PageHeader';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  productIds?: string[];
}

const quickPrompts = [
  { label: '🌮 Taco Night', query: 'taco night' },
  { label: '🫔 Tamales', query: 'tamales' },
  { label: '⭐ Popular', query: 'popular' },
  { label: '🔥 Carne Asada', query: 'carne asada' },
  { label: '💰 Budget', query: 'budget' },
];

const AiAssistant = () => {
  const { selectedStore } = useStore();
  const { customer } = useCustomer();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting = customer?.firstName ? `${customer.firstName}, welcome` : 'Welcome';

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'ai',
      text: `${greeting} to Amapola — ${selectedStore.name} 🌺\n\nI'm your market assistant. I know every aisle, every specialty, and what's fresh right now.\n\nPickup is ready in ${selectedStore.pickupTime}. Tell me what you're cooking or tap a suggestion below.`,
    }]);
  }, [selectedStore, customer]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (query?: string) => {
    const q = (query ?? input).trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q };
    const aiRes = findAiResponse(q);

    let storeNote = '';
    const unavailableInResponse = aiRes.productIds.filter(id =>
      selectedStore.unavailable.includes(id)
    );
    if (unavailableInResponse.length > 0) {
      const names = unavailableInResponse
        .map(id => getProductById(id)?.name)
        .filter(Boolean)
        .join(', ');
      storeNote = `\n\n⚠️ Heads up${customer?.firstName ? `, ${customer.firstName}` : ''}: ${names} may not be available at ${selectedStore.name} right now.`;
    }

    const specialtiesInResponse = aiRes.productIds.filter(id =>
      selectedStore.specialties.includes(id)
    );
    if (specialtiesInResponse.length > 0) {
      const names = specialtiesInResponse
        .map(id => getProductById(id)?.name)
        .filter(Boolean)
        .join(', ');
      storeNote += `\n\n⭐ ${selectedStore.name} specialty: ${names}`;
    }

    // Add personalized pickup note
    const personalNote = customer?.firstName
      ? `\n\n📍 ${customer.firstName}, your order from ${selectedStore.name} will be ready in ${selectedStore.pickupTime}.`
      : '';

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiRes.message + storeNote + personalNote,
      productIds: aiRes.productIds,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col pb-28">
      <PageHeader title="Market Assistant" subtitle={`Shopping at ${selectedStore.name}`} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : ''}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-5 py-3 text-base text-primary-foreground whitespace-pre-line font-medium">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-5 py-3 text-base text-foreground whitespace-pre-line">
                    {msg.text}
                  </div>
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
              <button
                key={qp.query}
                onClick={() => send(qp.query)}
                className="rounded-full border-2 border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground active:scale-95 active:border-primary transition-all"
              >
                {qp.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="What are you cooking today?"
            className="h-13 flex-1 rounded-xl border-muted bg-muted/50 text-base md:text-lg px-4"
          />
          <Button size="icon" onClick={() => send()} className="h-13 w-13 shrink-0 rounded-xl active:scale-95 transition-transform">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
