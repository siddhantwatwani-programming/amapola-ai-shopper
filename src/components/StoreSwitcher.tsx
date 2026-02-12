import { useState } from 'react';
import { MapPin, Clock, CheckCircle2, Zap, Users, Timer } from 'lucide-react';
import { useStore, stores, type StoreLocation } from '@/store/storeContext';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface StoreSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusIcon = (status: string) => {
  if (status === 'Open') return <Zap className="h-3.5 w-3.5" />;
  if (status === 'Busy') return <Users className="h-3.5 w-3.5" />;
  return <Timer className="h-3.5 w-3.5" />;
};

const StoreSwitcher = ({ open, onOpenChange }: StoreSwitcherProps) => {
  const { selectedStore, setSelectedStore } = useStore();

  const handleSelect = (store: StoreLocation) => {
    setSelectedStore(store);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-6 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">Switch Store</SheetTitle>
          <SheetDescription className="text-sm">
            Your cart stays intact. Availability updates instantly.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          {stores.map((store, i) => {
            const isSelected = selectedStore.id === store.id;
            const isNearest = i === 2;
            return (
              <button
                key={store.id}
                onClick={() => handleSelect(store)}
                className={cn(
                  'w-full rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98]',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-base font-bold text-foreground">
                        Amapola — {store.name}
                      </h3>
                      {isNearest && (
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                          Nearest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{store.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {store.distance}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Ready in {store.pickupTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-primary" />}
                    <span className={cn(
                      'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      store.status === 'Open' ? 'bg-accent/15 text-accent' :
                      store.status === 'Busy' ? 'bg-secondary text-secondary-foreground' :
                      'bg-destructive/10 text-destructive'
                    )}>
                      {statusIcon(store.status)}
                      {store.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StoreSwitcher;
