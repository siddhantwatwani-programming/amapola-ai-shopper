import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface AccessibilityContextType {
  largeText: boolean;
  toggleLargeText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [largeText, setLargeText] = useState(() => {
    try { return localStorage.getItem('amapola-large-text') === 'true'; } catch { return false; }
  });

  const toggleLargeText = useCallback(() => {
    setLargeText(prev => {
      const next = !prev;
      localStorage.setItem('amapola-large-text', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeText);
  }, [largeText]);

  return (
    <AccessibilityContext.Provider value={{ largeText, toggleLargeText }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
