import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/data/products';

export interface PastOrder {
  id: string;
  date: string;
  storeId: string;
  storeName: string;
  items: { product: Product; quantity: number }[];
  total: number;
  mode: 'consumer' | 'restaurant';
}

interface OrderHistoryContextType {
  orders: PastOrder[];
  addOrder: (order: PastOrder) => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | null>(null);

// Mock past orders for demo
import { products } from '@/data/products';

const mockOrders: PastOrder[] = [
  {
    id: 'AMP-8421',
    date: '2 days ago',
    storeId: 'boyle-heights',
    storeName: 'Boyle Heights',
    items: [
      { product: products.find(p => p.id === 'd1')!, quantity: 3 },
      { product: products.find(p => p.id === 'b3')!, quantity: 2 },
      { product: products.find(p => p.id === 'p3')!, quantity: 1 },
      { product: products.find(p => p.id === 'bv3')!, quantity: 2 },
    ],
    total: 38.45,
    mode: 'consumer',
  },
  {
    id: 'AMP-7103',
    date: '1 week ago',
    storeId: 'east-la',
    storeName: 'East LA',
    items: [
      { product: products.find(p => p.id === 'd1')!, quantity: 10 },
      { product: products.find(p => p.id === 'b5')!, quantity: 20 },
      { product: products.find(p => p.id === 'm5')!, quantity: 8 },
      { product: products.find(p => p.id === 'pa4')!, quantity: 5 },
      { product: products.find(p => p.id === 'bv1')!, quantity: 24 },
    ],
    total: 218.90,
    mode: 'restaurant',
  },
];

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PastOrder[]>(mockOrders);

  const addOrder = useCallback((order: PastOrder) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error('useOrderHistory must be used within OrderHistoryProvider');
  return ctx;
}
