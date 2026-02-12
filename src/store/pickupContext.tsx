import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type PickupType = 'now' | 'later' | 'recurring';
export type RecurringCadence = 'weekly' | 'biweekly' | 'custom';

export interface PickupSchedule {
  type: PickupType;
  /** Only for 'later' */
  date?: string;
  time?: string;
  /** Only for 'recurring' */
  cadence?: RecurringCadence;
}

interface PickupContextType {
  schedule: PickupSchedule;
  setSchedule: (s: PickupSchedule) => void;
  scheduleLabel: string;
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
    <PickupContext.Provider value={{ schedule, setSchedule, scheduleLabel }}>
      {children}
    </PickupContext.Provider>
  );
}

export function usePickup() {
  const ctx = useContext(PickupContext);
  if (!ctx) throw new Error('usePickup must be used within PickupProvider');
  return ctx;
}
