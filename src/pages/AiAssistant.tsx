import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findAiResponse, getProductById } from '@/data/products';
import { useStore } from '@/store/storeContext';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome message when store changes
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'ai',
      text: `Hi! I'm your shopping assistant at Amapola — ${selectedStore.name} 🌺 I know every aisle here. Pickup is ready in ${selectedStore.pickupTime}.\n\nTry asking:\n• "What do I need for taco night?"\n• "I'm making tamales — help me shop"\n• "What's popular at this location?"`,
    }]);
  }, [selectedStore]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q };
    const aiRes = findAiResponse(q);

    // Add store context to AI message
    let storeNote = '';
    const unavailableInResponse = aiRes.productIds.filter(id =>
      selectedStore.unavailable.includes(id)
    );
    if (unavailableInResponse.length > 0) {
      const names = unavailableInResponse
        .map(id => getProductById(id)?.name)
        .filter(Boolean)
        .join(', ');
      storeNote = `\n\n⚠️ Note: ${names} may not be available at the ${selectedStore.name} location. Check with our staff!`;
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

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiRes.message + storeNote,
      productIds: aiRes.productIds,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col pb-24">
      <PageHeader title="AI Assistant" subtitle={`Shopping at ${selectedStore.name}`} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 ${msg.role === 'user' ? 'flex justify-end' : ''}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-line">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-foreground whitespace-pre-line">
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
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Ask about ${selectedStore.name} store...`}
            className="h-11 flex-1 rounded-xl border-muted bg-muted/50 text-base"
          />
          <Button size="icon" onClick={send} className="h-11 w-11 shrink-0 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
