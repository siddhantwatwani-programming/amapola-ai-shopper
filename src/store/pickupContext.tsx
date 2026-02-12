import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useCart } from '@/store/cartStore';
import { useMode } from '@/store/modeContext';

export type PickupType = 'now' | 'later' | 'recurring';
export type RecurringCadence = 'weekly' | 'biweekly' | 'custom';

export interface PickupSchedule {
  type: PickupType;
  date?: string;
  time?: string;
  cadence?: RecurringCadence;
}

interface PickupContextType {
  schedule: PickupSchedule;
  setSchedule: (s: PickupSchedule) => void;
  scheduleLabel: string;
  /** Dynamic computed pickup range based on cart/mode/time */
  dynamicMinutes: [number, number];
  dynamicLabel: string;
  pickupWarning: string | null;
}

const PickupContext = createContext<PickupContextType | null>(null);

export function PickupProvider({ children }: { children: ReactNode }) {
  const [schedule, setScheduleState] = useState<PickupSchedule>({ type: 'now' });

  const setSchedule = useCallback((s: PickupSchedule) => setScheduleState(s), []);

  const scheduleLabel = (() => {
    if (schedule.type === 'now') return 'Pick up now';
    if (schedule.type === 'later') {
      const parts: string[] = [];
      if (schedule.date) parts.push(schedule.date);
      if (schedule.time) parts.push(`at ${schedule.time}`);
      return parts.length ? `Pickup ${parts.join(' ')}` : 'Scheduled pickup';
    }
    const cadenceMap: Record<RecurringCadence, string> = {
      weekly: 'Weekly pickup',
      biweekly: 'Every 2 weeks',
      custom: 'Custom schedule',
    };
    return cadenceMap[schedule.cadence ?? 'weekly'];
  })();

  return (
    <PickupContext.Provider value={{
      schedule, setSchedule, scheduleLabel,
      // These are placeholder values — real computation happens in usePickup hook
      dynamicMinutes: [0, 0],
      dynamicLabel: '',
      pickupWarning: null,
    }}>
      {children}
    </PickupContext.Provider>
  );
}

/** Hook that computes dynamic pickup timing from cart + mode + time of day */
export function usePickup() {
  const ctx = useContext(PickupContext);
  if (!ctx) throw new Error('usePickup must be used within PickupProvider');

  // Access cart & mode outside context to compute dynamic values
  let totalItems = 0;
  let totalQty = 0;
  let isRestaurant = false;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cart = useCart();
    totalItems = cart.items.length;
    totalQty = cart.totalItems;
  } catch { /* cart not available yet */ }

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const modeCtx = useMode();
    isRestaurant = modeCtx.isRestaurant;
  } catch { /* mode not available yet */ }

  const hour = new Date().getHours();

  const dynamicMinutes = useMemo((): [number, number] => {
    let baseMin = 20;
    let baseMax = 30;

    // Cart size factor
    if (totalQty > 20) { baseMin += 25; baseMax += 35; }
    else if (totalQty > 10) { baseMin += 15; baseMax += 20; }
    else if (totalQty > 5) { baseMin += 5; baseMax += 10; }

    // Restaurant mode adds prep time
    if (isRestaurant) { baseMin += 15; baseMax += 20; }

    // Time-of-day factor (lunch/dinner rush)
    if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)) {
      baseMin += 10; baseMax += 15;
    }

    // Late evening
    if (hour >= 21 || hour < 6) {
      baseMin = 0; baseMax = 0; // store closed
    }

    return [baseMin, baseMax];
  }, [totalQty, isRestaurant, hour]);

  const dynamicLabel = useMemo(() => {
    if (dynamicMinutes[0] === 0 && dynamicMinutes[1] === 0) return 'Tomorrow morning';
    if (dynamicMinutes[0] >= 90) return `~${Math.round(dynamicMinutes[0] / 60)}–${Math.round(dynamicMinutes[1] / 60)} hours`;
    return `${dynamicMinutes[0]}–${dynamicMinutes[1]} min`;
  }, [dynamicMinutes]);

  const pickupWarning = useMemo(() => {
    if (dynamicMinutes[0] === 0 && dynamicMinutes[1] === 0) return 'Store is closed — pickup available tomorrow morning';
    if (isRestaurant && totalQty > 30) return 'Large bulk order — may exceed same-day pickup capacity';
    if (dynamicMinutes[1] > 60) return 'High volume order — consider scheduling for later';
    if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)) return 'Rush hour — expect longer wait times';
    return null;
  }, [dynamicMinutes, isRestaurant, totalQty, hour]);

  return {
    ...ctx,
    dynamicMinutes,
    dynamicLabel,
    pickupWarning,
  };
}
