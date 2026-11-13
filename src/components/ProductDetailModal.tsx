import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, Shield, Sparkles, Droplet, Clock, Plus, Minus, MapPin } from 'lucide-react';
import type { Product, ProductVariant } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Reset variant and quantity when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIdx(0);
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!product) return null;

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const handleAdd = () => {
    onAddToCart(product, currentVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/25 my-8 z-10 max-h-[92vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 p-2.5 rounded-full bg-brand-dark/10 hover:bg-brand-dark/20 text-brand-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close product details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto flex-1 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                
                {/* Left: Product Visual Presentation */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-full aspect-square rounded-2xl overflow-hidden relative flex items-center justify-center border border-brand-gold/20 shadow-lg bg-brand-cream/60 group"
                    style={!product.imageUrl ? { background: `linear-gradient(135deg, ${product.liquidColor}22, ${product.accentColor}33)` } : undefined}
                  >
                    {product.imageUrl ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="relative flex flex-col items-center justify-center p-8 text-center">
                        <div 
                          className="w-36 h-36 md:w-44 md:h-44 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50 mb-4 transition-transform group-hover:scale-105"
                          style={{ background: `radial-gradient(circle at 35% 35%, ${product.accentColor}, ${product.liquidColor})` }}
                        >
                          <div className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center text-white/90">
                            <span className="font-serif text-3xl font-bold tracking-wider">N</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-dark/50">
                          Kannauj Pure Distillation
                        </span>
                      </div>
                    )}

                    {/* Category & Origin Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm border border-brand-gold/20">
                        {product.category.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-brand-dark/70 backdrop-blur-md px-3.5 py-2 rounded-xl text-brand-light text-xs border border-white/10">
                      <span className="flex items-center gap-1.5 text-brand-goldLight text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {product.origin}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-green-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> In Stock
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-brand-gold/15 text-center">
                      <Shield className="w-4 h-4 text-brand-gold mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-brand-dark uppercase">100% Natural</p>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-brand-gold/15 text-center">
                      <Droplet className="w-4 h-4 text-brand-gold mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-brand-dark uppercase">Alcohol Free</p>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-brand-gold/15 text-center">
                      <Clock className="w-4 h-4 text-brand-gold mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-brand-dark uppercase">8–12h Wear</p>
                    </div>
                  </div>
                </div>

                {/* Right: Product Details & Purchase Actions */}
                <div className="flex flex-col">
                  <p className="text-brand-gold font-medium text-xs uppercase tracking-[0.25em] mb-1">
                    {product.tagline}
                  </p>
                  <h2 id="product-detail-title" className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3">
                    {product.name}
                  </h2>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-3xl font-serif font-bold text-brand-gold">
                      ₹{currentVariant.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-brand-dark/50">
                      inclusive of all taxes / {currentVariant.size}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-brand-dark/75 text-sm md:text-base leading-relaxed mb-6 font-light">
                    {product.description}
                  </p>

                  {/* Olfactory Notes Pyramid */}
                  <div className="bg-white rounded-xl p-4 border border-brand-gold/15 mb-6 shadow-sm">
                    <h3 className="text-xs font-serif font-bold text-brand-dark uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Fragrance Profile
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-brand-cream/60 p-2.5 rounded-lg border border-brand-gold/10">
                        <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold block mb-0.5">Top Note</span>
                        <span className="text-xs font-medium text-brand-dark">{product.notes.top}</span>
                      </div>
                      <div className="bg-brand-cream/60 p-2.5 rounded-lg border border-brand-gold/10">
                        <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold block mb-0.5">Heart Note</span>
                        <span className="text-xs font-medium text-brand-dark">{product.notes.heart}</span>
                      </div>
                      <div className="bg-brand-cream/60 p-2.5 rounded-lg border border-brand-gold/10">
                        <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold block mb-0.5">Base Note</span>
                        <span className="text-xs font-medium text-brand-dark">{product.notes.base}</span>
                      </div>
                    </div>
                  </div>

                  {/* Size / Variant Selector */}
                  <div className="mb-6">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block mb-2">
                      Select Size / Packaging:
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v, idx) => (
                        <button
                          key={v.size}
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 border ${
                            selectedVariantIdx === idx
                              ? 'bg-brand-dark text-brand-goldLight border-brand-dark shadow-md'
                              : 'bg-white text-brand-dark/70 border-brand-gold/20 hover:border-brand-gold/50 hover:bg-brand-cream/50'
                          }`}
                        >
                          <span>{v.size}</span>
                          <span className="text-brand-gold text-[11px]">₹{v.price.toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Add to Cart Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto pt-4 border-t border-brand-gold/15">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between sm:justify-start gap-4 bg-white border border-brand-gold/20 rounded-xl px-3 py-1.5 shrink-0">
                      <span className="text-xs text-brand-dark/50 sm:hidden">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="p-2 hover:bg-brand-dark/5 rounded-lg text-brand-dark min-h-[44px] min-w-[36px] flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-brand-dark w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => Math.min(10, q + 1))}
                          className="p-2 hover:bg-brand-dark/5 rounded-lg text-brand-dark min-h-[44px] min-w-[36px] flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAdd}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 min-h-[50px] transition-all duration-300 shadow-md ${
                        addedAnimation
                          ? 'bg-green-700 text-white'
                          : 'bg-brand-dark text-brand-goldLight hover:bg-brand-green'
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" /> Add to Cart • ₹{(currentVariant.price * quantity).toLocaleString('en-IN')}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Verified Benefits List */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.benefits.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 text-[11px] text-brand-dark/70 bg-white/60 px-3 py-1 rounded-full border border-brand-gold/15"
                      >
                        <Check className="w-3 h-3 text-brand-gold" /> {b}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
