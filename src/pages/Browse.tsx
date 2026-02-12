import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products, categories, priceRanges, type Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CategoryChips from '@/components/CategoryChips';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';

const Browse = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory) list = list.filter(p => p.category === activeCategory);
    if (activePriceRange !== null) {
      const range = priceRanges[activePriceRange];
      list = list.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeCategory, activePriceRange]);

  return (
    <div className="flex flex-col pb-24">
      <PageHeader title="Browse">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
            showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </PageHeader>

      {/* Search */}
      <div className="px-4 pb-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groceries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 rounded-xl border-muted bg-muted/50 pl-10 text-base"
          />
        </div>
      </div>

      {/* Price Filters */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          {priceRanges.map((range, i) => (
            <button
              key={range.label}
              onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                activePriceRange === i
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Categories */}
      <CategoryChips
        categories={categories}
        active={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Product Grid — responsive for tablet/kiosk */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 py-12 text-center text-muted-foreground">
          No items found. Try a different search or filter.
        </div>
      )}
    </div>
  );
};

export default Browse;
