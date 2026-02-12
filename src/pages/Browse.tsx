import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products, categories, priceRanges, type Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CategoryChips from '@/components/CategoryChips';
import PageHeader from '@/components/PageHeader';
import { useMode } from '@/store/modeContext';
import { useOrderHistory } from '@/store/orderHistoryContext';
import { useCart } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  const handleCategoryTap = (catId: Category) => {
    setActiveCategory(catId);
    setViewMode('products');
  };

  const handleBack = () => {
    setActiveCategory(null);
    setViewMode('categories');
    setSearch('');
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
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:h-12 md:w-12',
            showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
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
      <div className="px-4 pb-2">
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
        </div>
      </div>

      {/* Price Filters */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          {priceRanges.map((range, i) => (
            <button
              key={range.label}
              onClick={() => {
                setActivePriceRange(activePriceRange === i ? null : i);
                setViewMode('products');
              }}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors active:scale-95',
                activePriceRange === i ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-muted text-muted-foreground'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {viewMode === 'categories' && !search.trim() ? (
        <div className="grid grid-cols-3 gap-3 px-4 pt-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleCategoryTap(cat.id)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card p-5 shadow-sm active:scale-95 active:border-primary transition-all md:p-7"
            >
              <span className="text-4xl md:text-5xl">{cat.emoji}</span>
              <span className="text-sm font-bold text-foreground md:text-base">{cat.label}</span>
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
          <div className="grid grid-cols-2 gap-3 px-4 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-lg text-muted-foreground">
              No items found. Try a different search or filter.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
