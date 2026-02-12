import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Category } from '@/data/products';
import { cn } from '@/lib/utils';

interface Props {
  categories: { id: Category; label: string; emoji: string }[];
  active: Category | null;
  onSelect: (cat: Category | null) => void;
}

const CategoryChips = ({ categories, active, onSelect }: Props) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 px-4 py-3">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            !active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(active === cat.id ? null : cat.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active === cat.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryChips;
