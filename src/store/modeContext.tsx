import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type AppMode = 'consumer' | 'restaurant';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isRestaurant: boolean;
  /** Quantity step: 1 for consumer, 5 for restaurant */
  qtyStep: number;
}

const ModeContext = createContext<ModeContextType | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>('consumer');

  const setMode = useCallback((m: AppMode) => setModeState(m), []);

  return (
    <ModeContext.Provider value={{
      mode,
      setMode,
      isRestaurant: mode === 'restaurant',
      qtyStep: mode === 'restaurant' ? 5 : 1,
    }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
