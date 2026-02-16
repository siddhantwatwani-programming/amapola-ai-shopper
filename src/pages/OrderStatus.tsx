import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Package, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/storeContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { Button } from '@/components/ui/button';
import logoAmapola from '@/assets/logo-amapola.png';

const steps = [
  { id: 'received', label: 'Order Received', icon: CheckCircle2, description: 'We got your order!' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Our team is gathering your items' },
  { id: 'ready', label: 'Ready for Pickup', icon: Package, description: 'Head to the counter!' },
];

const OrderStatus = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  const { orders } = useOrderHistory();
  const latestOrder = orders[0];
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate order progress
  useEffect(() => {
    if (currentStep >= steps.length - 1) return;
    const timer = setTimeout(() => setCurrentStep(prev => prev + 1), currentStep === 0 ? 8000 : 15000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!latestOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <span className="text-6xl mb-4">📦</span>
        <h2 className="text-xl font-bold text-foreground mb-2">No active orders</h2>
        <p className="text-muted-foreground mb-6">Place an order to track it here</p>
        <Button onClick={() => navigate('/browse')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/browse')} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img src={logoAmapola} alt="Amapola" className="h-8 w-auto" />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Order {latestOrder.id}</h1>
            <p className="text-xs text-muted-foreground">{latestOrder.date}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8">
        {/* Live status indicator */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </span>
          <span className="text-sm font-bold text-accent">Live Tracking</span>
        </motion.div>

        {/* Progress Steps */}
        <div className="relative">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isComplete = index <= currentStep;
            const isActive = index === currentStep;

            return (
              <div key={step.id} className="flex gap-4 mb-8 last:mb-0">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      opacity: isComplete ? 1 : 0.3,
                    }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                      isComplete
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-muted text-muted-foreground'
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 32 }}
                      className={`w-0.5 mt-1 transition-colors ${
                        index < currentStep ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-2">
                  <motion.h3
                    animate={{ opacity: isComplete ? 1 : 0.4 }}
                    className="text-base font-bold text-foreground"
                  >
                    {step.label}
                  </motion.h3>
                  <p className={`text-sm ${isComplete ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                    {step.description}
                  </p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-accent"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {index === 0 ? 'Just now' : index === 1 ? '~10 min remaining' : 'Come to the counter!'}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Store info */}
        <div className="mt-6 rounded-2xl border-2 border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">Amapola — {selectedStore.name}</p>
              <p className="text-xs text-muted-foreground">{selectedStore.address}</p>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-4 rounded-2xl bg-muted/50 p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Order Summary</h3>
          <div className="space-y-1">
            {latestOrder.items.slice(0, 5).map(i => (
              <div key={i.product.id} className="flex justify-between text-xs text-muted-foreground">
                <span>{i.product.name} ×{i.quantity}</span>
                <span>${(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            {latestOrder.items.length > 5 && (
              <p className="text-xs text-muted-foreground/60">+{latestOrder.items.length - 5} more items</p>
            )}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-sm font-bold text-foreground">${latestOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/browse')}
          className="mt-6 h-14 w-full rounded-2xl text-base font-bold"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderStatus;
