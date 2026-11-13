import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  onClose: () => void;
  onRemove: (productId: string, size: string) => void;
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer = ({
  items,
  isOpen,
  totalItems,
  subtotal,
  shippingFee,
  totalPrice,
  freeShippingProgress,
  amountNeededForFreeShipping,
  onClose,
  onRemove,
  onUpdateQuantity,
  onOpenCheckout,
}: CartDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm z-[80]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-light z-[85] shadow-2xl flex flex-col border-l border-brand-gold/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-brand-gold/20 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <h2 className="text-xl font-serif font-bold text-brand-dark">Your Fragrance Bag</h2>
                <span className="bg-brand-dark text-brand-goldLight text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-dark/5 rounded-full transition-colors text-brand-dark min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-brand-cream border-b border-brand-gold/15 shrink-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-brand-dark">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    {amountNeededForFreeShipping > 0 ? (
                      <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for FREE delivery</span>
                    ) : (
                      <span className="text-green-700 font-bold">✨ Unlocked FREE Pan-India Delivery!</span>
                    )}
                  </span>
                  <span className="text-[10px] text-brand-dark/50 font-mono">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-brand-gold/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-goldLight rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-3.5">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-brand-dark/5 border border-brand-gold/20 flex items-center justify-center mx-auto mb-4 text-brand-dark/30">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-brand-dark/60 font-serif text-lg font-bold">Your bag is empty</p>
                  <p className="text-brand-dark/40 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Explore our botanical attars, floral waters, and pure sacred dhoop from Kannauj.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded-xl border border-brand-gold/40 text-brand-dark font-medium text-xs hover:bg-brand-cream transition-colors min-h-[44px]"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.variant.size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-brand-gold/15 flex gap-3.5 items-center"
                  >
                    {/* Thumbnail Swatch */}
                    <div
                      className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-brand-gold/15 flex items-center justify-center bg-brand-light"
                      style={!item.product.imageUrl ? { background: `linear-gradient(135deg, ${item.product.liquidColor}22, ${item.product.accentColor}33)` } : undefined}
                    >
                      {item.product.imageUrl ? (
                        <img
                          src={`${import.meta.env.BASE_URL}${item.product.imageUrl}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full shadow-sm"
                          style={{ background: `radial-gradient(circle at 35% 35%, ${item.product.accentColor}, ${item.product.liquidColor})` }}
                        />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="pr-2 truncate">
                          <h3 className="font-serif font-bold text-sm text-brand-dark truncate">
                            {item.product.name}
                          </h3>
                          <span className="text-[11px] text-brand-dark/50">
                            Size: {item.variant.size}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemove(item.product.id, item.variant.size)}
                          className="text-brand-dark/30 hover:text-red-500 transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2.5">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-brand-light border border-brand-gold/15 rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.variant.size, item.quantity - 1)}
                            className="p-1 hover:bg-brand-gold/15 rounded transition-colors text-brand-dark"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.variant.size, item.quantity + 1)}
                            className="p-1 hover:bg-brand-gold/15 rounded transition-colors text-brand-dark"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-serif font-bold text-sm text-brand-gold">
                          ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 md:p-6 border-t border-brand-gold/20 bg-white/90 shrink-0 shadow-lg">
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Pan-India Delivery:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-brand-gold/10">
                    <span className="text-sm font-bold text-brand-dark">Estimated Total:</span>
                    <span className="text-2xl font-serif font-bold text-brand-dark">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full bg-brand-dark text-brand-goldLight py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-green transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-brand-dark/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>100% Authentic Natural Distillations · Kannauj Heritage</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
