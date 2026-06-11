import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
  onRemove: (productId: string, size: string) => void;
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
}

export const CartDrawer = ({
  items, isOpen, totalItems, totalPrice, onClose, onRemove, onUpdateQuantity
}: CartDrawerProps) => {
  const handleCheckout = () => {
    let message = "Hello, I'd like to place an order.\n\nProducts:\n";
    items.forEach(item => {
      message += `- ${item.product.name} (${item.variant.size}) x${item.quantity}\n`;
    });
    message += `\nTotal: ₹${totalPrice.toLocaleString('en-IN')}\n\nCustomer Name:\nPhone:\nAddress:\n`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "919416160167";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-light z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <h2 className="text-xl font-serif font-bold text-brand-dark">Your Cart</h2>
                <span className="bg-brand-gold text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-brand-dark/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-brand-dark/20 mx-auto mb-4" />
                  <p className="text-brand-dark/50 font-serif text-lg">Your cart is empty</p>
                  <p className="text-brand-dark/30 text-sm mt-2">Discover our collection of pure attars</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.variant.size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-brand-gold/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-serif font-bold text-brand-dark">{item.product.name}</h3>
                        <p className="text-brand-dark/50 text-sm">{item.variant.size}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.product.id, item.variant.size)}
                        className="text-brand-dark/30 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-brand-light rounded-lg px-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.variant.size, item.quantity - 1)}
                          className="p-1.5 hover:bg-brand-gold/10 rounded-md transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.variant.size, item.quantity + 1)}
                          className="p-1.5 hover:bg-brand-gold/10 rounded-md transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-medium text-brand-gold">
                        ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-brand-gold/20 bg-white/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-brand-dark/70">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-brand-dark">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-dark text-brand-goldLight py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-brand-green transition-colors"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-brand-dark/40 text-xs mt-3">
                  Free shipping on orders above ₹2,000
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
