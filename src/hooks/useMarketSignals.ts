import { useMemo } from 'react';
import type { Product } from '@/data/products';
import { useStore } from '@/store/storeContext';

export interface MarketSignal {
  text: string;
  style: string;
  priority: number;
}

/** Returns a dynamic market signal for a product based on store, time, and deterministic hash */
export function useMarketSignal(product: Product): MarketSignal {
  const { selectedStore, isSpecialty, isAvailable } = useStore();
  const hour = new Date().getHours();

  return useMemo(() => {
    if (!isAvailable(product.id)) {
      return { text: 'Not at this location', style: 'bg-destructive/10 text-destructive', priority: 0 };
    }

    if (isSpecialty(product.id)) {
      return { text: `${selectedStore.name} specialty`, style: 'bg-primary/10 text-primary', priority: 5 };
    }

    // Time-based signals
    const hash = product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    // Morning fresh items
    if (hour >= 6 && hour < 11 && ['bakery', 'produce', 'dairy'].includes(product.category)) {
      return { text: 'Fresh this morning', style: 'bg-accent/15 text-accent', priority: 4 };
    }

    // Lunch rush popular
    if (hour >= 11 && hour <= 14 && ['deli', 'meat'].includes(product.category)) {
      return { text: 'Popular right now', style: 'bg-secondary text-secondary-foreground', priority: 3 };
    }

    // Evening signals
    if (hour >= 16 && hour < 20 && product.category === 'deli') {
      return { text: 'Selling fast', style: 'bg-destructive/10 text-destructive', priority: 3 };
    }

    // Static signals based on hash
    const signals: MarketSignal[] = [
      { text: 'Popular today', style: 'bg-secondary text-secondary-foreground', priority: 2 },
      { text: 'House made', style: 'bg-primary/10 text-primary', priority: 2 },
      { text: 'Recommended', style: 'bg-accent/15 text-accent', priority: 1 },
      { text: 'Great value', style: 'bg-secondary text-secondary-foreground', priority: 1 },
    ];

    // Only ~60% of products show a signal
    if (hash % 5 === 0) return { text: '', style: '', priority: 0 };

    return signals[hash % signals.length];
  }, [product.id, product.category, selectedStore.name, hour, isSpecialty, isAvailable]);
}
