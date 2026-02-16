import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, CalendarDays, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    icon: Sparkles,
    emoji: '🤖',
    title: 'AI Grocery Assistant',
    description: 'Tell us what you\'re cooking and we\'ll find everything you need. Meal plans, pairings, and budget tips — powered by AI.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: CalendarDays,
    emoji: '📅',
    title: 'Flexible Pickup',
    description: 'Pick up now, schedule for later, or set up recurring orders for your business. We adapt to your schedule.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: MapPin,
    emoji: '📍',
    title: 'Store Specialties',
    description: 'Each Amapola location has unique house-made items. Our AI knows what\'s fresh and special at your nearest store.',
    color: 'bg-secondary text-secondary-foreground',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else onComplete();
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md px-6"
    >
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className={`mb-6 flex h-24 w-24 items-center justify-center rounded-3xl ${slide.color}`}
            >
              <span className="text-5xl">{slide.emoji}</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button
          size="lg"
          onClick={next}
          className="h-14 w-full rounded-2xl text-lg font-bold active:scale-[0.97] transition-transform"
        >
          {current < slides.length - 1 ? (
            <span className="flex items-center gap-2">Next <ChevronRight className="h-5 w-5" /></span>
          ) : (
            'Start Shopping 🛒'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default OnboardingTour;
