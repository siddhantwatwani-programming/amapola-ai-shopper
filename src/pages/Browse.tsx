import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products, categories, type Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CategoryChips from '@/components/CategoryChips';
import PageHeader from '@/components/PageHeader';

const Browse = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory) list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <PageHeader title="Browse" />

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

      {/* Categories */}
      <CategoryChips
        categories={categories}
        active={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 py-12 text-center text-muted-foreground">
          No items found. Try a different search.
        </div>
      )}
    </div>
  );
};

export default Browse;
