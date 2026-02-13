import { useState } from 'react';
import { Clock, CalendarDays, Repeat, Check } from 'lucide-react';
import { usePickup, type PickupType, type RecurringCadence } from '@/store/pickupContext';
import { useStore } from '@/store/storeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface PickupSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const dateOptions = ['Today', 'Tomorrow', 'Sat, Feb 14', 'Sun, Feb 15', 'Mon, Feb 16'];
const cadenceOptions: { id: RecurringCadence; label: string }[] = [
  { id: 'weekly', label: 'Every week' },
  { id: 'biweekly', label: 'Every 2 weeks' },
  { id: 'custom', label: 'Custom' },
];

const PickupScheduler = ({ open, onOpenChange }: PickupSchedulerProps) => {
  const { schedule, setSchedule } = usePickup();
  const { selectedStore } = useStore();
  const [activeType, setActiveType] = useState<PickupType>(schedule.type);
  const [selectedDate, setSelectedDate] = useState(schedule.date ?? 'Today');
  const [selectedTime, setSelectedTime] = useState(schedule.time ?? '10:00 AM');
  const [selectedCadence, setSelectedCadence] = useState<RecurringCadence>(schedule.cadence ?? 'weekly');

  const handleConfirm = () => {
    if (activeType === 'now') {
      setSchedule({ type: 'now' });
    } else if (activeType === 'later') {
      setSchedule({ type: 'later', date: selectedDate, time: selectedTime });
    } else {
      setSchedule({ type: 'recurring', cadence: selectedCadence, date: selectedDate, time: selectedTime });
    }
    onOpenChange(false);
  };

  const types: { id: PickupType; label: string; icon: typeof Clock }[] = [
    { id: 'now', label: 'Now', icon: Clock },
    { id: 'later', label: 'Later', icon: CalendarDays },
    { id: 'recurring', label: 'Recurring', icon: Repeat },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-6 overflow-hidden">
        <SheetHeader className="mb-3">
          <SheetTitle className="text-lg font-bold">Pickup Schedule</SheetTitle>
          <SheetDescription className="text-xs">
            {selectedStore.name} · Ready in {selectedStore.pickupTime}
          </SheetDescription>
        </SheetHeader>

        {/* Type selector */}
        <div className="flex gap-2 mb-4">
          {types.map(t => {
            const Icon = t.icon;
            const isActive = activeType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-all active:scale-95',
                  isActive ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Now */}
        {activeType === 'now' && (
          <div className="rounded-xl bg-accent/10 p-3 text-center mb-4">
            <p className="text-sm font-bold text-foreground">Ready in {selectedStore.pickupTime}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pickup at front counter or kiosk</p>
          </div>
        )}

        {/* Later — date + time compact */}
        {(activeType === 'later' || activeType === 'recurring') && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Date</label>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {dateOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                      selectedDate === d ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Time</label>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                      selectedTime === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recurring cadence */}
        {activeType === 'recurring' && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-foreground mb-1.5">Repeat</label>
            <div className="flex gap-1.5">
              {cadenceOptions.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCadence(c.id)}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-xs font-semibold transition-all active:scale-95',
                    selectedCadence === c.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          size="lg"
          onClick={handleConfirm}
          className="h-12 w-full rounded-xl text-base font-bold shadow-lg active:scale-[0.97] transition-transform"
        >
          <Check className="mr-2 h-4 w-4" />
          Confirm
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default PickupScheduler;
