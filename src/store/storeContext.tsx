import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  pickupTime: string;
  pickupMinutes: [number, number];
  status: 'Open' | 'Busy' | 'Closing soon';
  specialties: string[];
  /** Product IDs NOT available at this location */
  unavailable: string[];
}

export const stores: StoreLocation[] = [
  {
    id: 'east-la',
    name: 'East LA',
    address: '4649 E Cesar Chavez Ave, Los Angeles, CA',
    distance: '2.1 mi',
    pickupTime: '25–35 min',
    pickupMinutes: [25, 35],
    status: 'Open',
    specialties: ['d1', 'b3', 'b5', 'bv3'],
    unavailable: ['m4', 'f4'],
  },
  {
    id: 'huntington-park',
    name: 'Huntington Park',
    address: '6235 Pacific Blvd, Huntington Park, CA',
    distance: '5.8 mi',
    pickupTime: '40–55 min',
    pickupMinutes: [40, 55],
    status: 'Busy',
    specialties: ['f1', 'd5', 'b2', 'pa4'],
    unavailable: ['m2', 'bv4'],
  },
  {
    id: 'boyle-heights',
    name: 'Boyle Heights',
    address: '2018 E 1st St, Los Angeles, CA',
    distance: '1.4 mi',
    pickupTime: '20–30 min',
    pickupMinutes: [20, 30],
    status: 'Open',
    specialties: ['b4', 'd3', 'm5', 'bv4'],
    unavailable: ['f3', 'pa6'],
  },
];

interface StoreContextType {
  selectedStore: StoreLocation;
  setSelectedStore: (store: StoreLocation) => void;
  isAvailable: (productId: string) => boolean;
  isSpecialty: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Default to nearest store (Boyle Heights)
  const [selectedStore, setSelectedStoreState] = useState<StoreLocation>(stores[2]);

  const setSelectedStore = useCallback((store: StoreLocation) => {
    setSelectedStoreState(store);
  }, []);

  const isAvailable = useCallback((productId: string) => {
    return !selectedStore.unavailable.includes(productId);
  }, [selectedStore]);

  const isSpecialty = useCallback((productId: string) => {
    return selectedStore.specialties.includes(productId);
  }, [selectedStore]);

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore, isAvailable, isSpecialty }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
