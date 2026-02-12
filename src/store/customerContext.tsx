import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CustomerInfo {
  firstName: string;
  phone: string;
}

interface CustomerContextType {
  customer: CustomerInfo | null;
  setCustomer: (info: CustomerInfo) => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomerState] = useState<CustomerInfo | null>(null);

  const setCustomer = useCallback((info: CustomerInfo) => {
    setCustomerState(info);
  }, []);

  const clearCustomer = useCallback(() => {
    setCustomerState(null);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider');
  return ctx;
}
