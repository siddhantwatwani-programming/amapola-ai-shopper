import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products, categories, priceRanges, type Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CategoryChips from '@/components/CategoryChips';
import PageHeader from '@/components/PageHeader';
import { useMode } from '@/store/modeContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { useCart } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const { isRestaurant } = useMode();
  const { orders } = useOrderHistory();
  const { addItem } = useCart();

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

  // Count items per category for filter badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let list = products;
    if (activePriceRange !== null) {
      const range = priceRanges[activePriceRange];
      list = list.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    categories.forEach(cat => {
      counts[cat.id] = list.filter(p => p.category === cat.id).length;
    });
    return counts;
  }, [search, activePriceRange]);

  const activeFilterCount = (activeCategory ? 1 : 0) + (activePriceRange !== null ? 1 : 0);

  const handleCategoryTap = (catId: Category) => {
    setActiveCategory(catId);
    setViewMode('products');
  };

  const handleBack = () => {
    setActiveCategory(null);
    setViewMode('categories');
    setSearch('');
  };

  const clearAllFilters = () => {
    setActiveCategory(null);
    setActivePriceRange(null);
    setSearch('');
    setViewMode('categories');
  };

  const handleQuickReorder = () => {
    if (orders.length === 0) return;
    const lastOrder = orders[0];
    lastOrder.items.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) addItem(product);
    });
  };

  return (
    <div className="flex flex-col pb-24">
      <PageHeader
        title={activeCategory ? categories.find(c => c.id === activeCategory)?.label ?? 'Browse' : 'Browse'}
        subtitle={activeCategory ? `${filtered.length} items` : undefined}
        onBack={activeCategory ? handleBack : undefined}
      >
        <div className="flex items-center gap-2">
          {/* Active filter count badge */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary active:scale-95 transition-transform"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({activeFilterCount})
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:h-12 md:w-12',
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFilterCount > 0 && !showFilters && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </PageHeader>

      {/* Quick reorder banner for restaurant mode */}
      {isRestaurant && orders.length > 0 && viewMode === 'categories' && (
        <button
          onClick={handleQuickReorder}
          className="mx-4 mb-2 flex items-center gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 text-left active:scale-[0.98] transition-all"
        >
          <RotateCcw className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Quick Reorder</p>
            <p className="text-xs text-muted-foreground">Repeat your last order ({orders[0].id}) · ${orders[0].total.toFixed(2)}</p>
          </div>
          <span className="text-xs font-bold text-primary">Tap</span>
        </button>
      )}

      {/* Search */}
      <div className="px-4 pb-1.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isRestaurant ? 'Search bulk items...' : 'Search groceries...'}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (e.target.value.trim()) setViewMode('products');
            }}
            className="h-12 rounded-xl border-muted bg-muted/50 pl-11 text-base md:h-14 md:text-lg"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); if (!activeCategory) setViewMode('categories'); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Filters — animated */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 overflow-x-auto px-4 py-2">
              {priceRanges.map((range, i) => {
                const count = products.filter(p => {
                  const inRange = p.price >= range.min && p.price < range.max;
                  const inCategory = activeCategory ? p.category === activeCategory : true;
                  return inRange && inCategory;
                }).length;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      setActivePriceRange(activePriceRange === i ? null : i);
                      setViewMode('products');
                    }}
                    className={cn(
                      'shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95',
                      activePriceRange === i ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {range.label}
                    <span className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                      activePriceRange === i ? 'bg-accent-foreground/20 text-accent-foreground' : 'bg-border text-muted-foreground'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'categories' && !search.trim() ? (
        <div className="grid grid-cols-3 gap-2.5 px-4 pt-2 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleCategoryTap(cat.id)}
              className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-border bg-card p-4 shadow-sm active:scale-95 active:border-primary transition-all md:p-5"
            >
              <span className="text-4xl md:text-5xl">{cat.emoji}</span>
              <span className="text-sm font-bold text-foreground md:text-base">{cat.label}</span>
              <span className="absolute right-2 top-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                {categoryCounts[cat.id]}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <>
          <CategoryChips
            categories={categories}
            active={activeCategory}
            onSelect={(cat) => {
              setActiveCategory(cat);
              if (!cat) setViewMode('categories');
            }}
          />

          {/* Results count */}
          <div className="px-4 pb-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              {activeCategory ? ` in ${categories.find(c => c.id === activeCategory)?.label}` : ''}
              {activePriceRange !== null ? ` · ${priceRanges[activePriceRange].label}` : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 px-4 pt-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center px-4 py-12 text-center">
              <span className="text-5xl mb-3">🔍</span>
              <p className="text-lg font-bold text-foreground mb-1">No items found</p>
              <p className="text-sm text-muted-foreground mb-4">Try a different search or filter.</p>
              <button onClick={clearAllFilters} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground active:scale-95 transition-transform">
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
