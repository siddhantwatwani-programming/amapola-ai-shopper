import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Package } from 'lucide-react';
import { products, categories } from '@/data/products';
import { useCart } from '@/store/cartStore';
import { useStore } from '@/store/storeContext';
import { useMode } from '@/store/modeContext';
import { useMarketSignal } from '@/hooks/useMarketSignals';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addItem, updateQuantity } = useCart();
  const { isAvailable } = useStore();
  const { isRestaurant, qtyStep } = useMode();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-xl font-bold text-foreground mb-2">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6">This item doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  const signal = useMarketSignal(product);
  const cartItem = items.find(i => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const available = isAvailable(product.id);
  const category = categories.find(c => c.id === product.category);

  const handleAdd = () => {
    for (let i = 0; i < qtyStep; i++) addItem(product);
  };
  const handleInc = () => updateQuantity(product.id, qty + qtyStep);
  const handleDec = () => updateQuantity(product.id, Math.max(0, qty - qtyStep));

  return (
    <div className="flex flex-col pb-32">
      {/* Hero image */}
      <div className="p-4">
        <div className="relative w-full overflow-hidden rounded-2xl bg-muted/40" style={{ paddingBottom: '90%' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-8xl">{product.emoji}</span>
          )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-md active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {signal.text && (
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${signal.style}`}>
              {signal.text}
            </span>
          )}
          {isRestaurant && available && (
            <span className="rounded-lg bg-secondary/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-secondary-foreground flex items-center gap-1">
              <Package className="h-3 w-3" />Bulk
            </span>
          )}
        </div>
        </div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-5"
      >
        {category && (
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground mb-2">
            {category.label}
          </span>
        )}
        <h1 className="text-2xl font-bold text-foreground mb-1">{product.name}</h1>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
          {isRestaurant && (
            <span className="text-sm text-muted-foreground">per unit · +{qtyStep} per tap</span>
          )}
        </div>

        {/* Product details section */}
        <div className="rounded-xl border border-border bg-card p-4 mb-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Product Details</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{category?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Availability</span>
              <span className={`font-medium ${available ? 'text-primary' : 'text-destructive'}`}>
                {available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {isRestaurant && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Type</span>
                <span className="font-medium text-foreground">Bulk</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sticky bottom add-to-cart bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30">
        <div className="mx-auto max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl px-4 pb-4">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-lg p-4">
            {available ? (
              qty === 0 ? (
                <Button onClick={handleAdd} className="w-full h-12 text-base font-bold rounded-xl">
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Cart — ${product.price.toFixed(2)}
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={handleDec}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground active:scale-90 transition-transform"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex-1 text-center text-lg font-bold text-foreground">{qty}</span>
                    <button
                      onClick={handleInc}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground active:scale-90 transition-transform"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">${(product.price * qty).toFixed(2)}</p>
                    <p className="text-[11px] text-muted-foreground">in cart</p>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-2">
                <p className="text-sm font-bold text-destructive">Currently Unavailable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
