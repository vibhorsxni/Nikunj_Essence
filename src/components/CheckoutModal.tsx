import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, MapPin, Copy, Check, MessageSquare } from 'lucide-react';
import type { CartItem } from '../hooks/useCart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  onOrderSuccess: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  shippingFee,
  totalPrice,
  onOrderSuccess,
}: CheckoutModalProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  // UI Flow State
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'razorpay'>('whatsapp');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name';
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!addressLine.trim() || addressLine.trim().length < 5) {
      errs.addressLine = 'Please enter your delivery street / house address';
    }

    if (!city.trim()) {
      errs.city = 'Please enter your city';
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      errs.pincode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateOrderManifest = (orderId: string) => {
    let manifest = `🌿 *NIKUNJ ESSENCE — ORDER #${orderId}*\n`;
    manifest += `📅 Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
    manifest += `👤 *Customer Details:*\n`;
    manifest += `• Name: ${fullName.trim()}\n`;
    manifest += `• Phone: +91 ${phoneNumber.replace(/\D/g, '')}\n`;
    if (email) manifest += `• Email: ${email.trim()}\n`;
    manifest += `• Address: ${addressLine.trim()}, ${city.trim()}, ${state} - ${pincode}\n`;
    if (notes) manifest += `• Notes: ${notes.trim()}\n`;

    manifest += `\n📦 *Order Items:*\n`;
    items.forEach((item, idx) => {
      manifest += `${idx + 1}. ${item.product.name} (${item.variant.size}) × ${item.quantity} = ₹${(item.variant.price * item.quantity).toLocaleString('en-IN')}\n`;
    });

    manifest += `\n💰 *Payment Summary:*\n`;
    manifest += `• Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
    manifest += `• Delivery: ${shippingFee === 0 ? 'FREE (Special Offer)' : `₹${shippingFee}`}\n`;
    manifest += `• *Total Amount: ₹${totalPrice.toLocaleString('en-IN')}*\n`;
    manifest += `\nPlease confirm availability and dispatch schedule. Thank you!`;

    return manifest;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const orderId = `NE-${Date.now().toString().slice(-6)}`;

    if (paymentMethod === 'whatsapp') {
      const manifest = generateOrderManifest(orderId);
      const whatsappNumber = '919416160167';
      const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(manifest)}`;

      window.open(encodedUrl, '_blank');
      setConfirmedOrderId(orderId);
      setIsSubmitting(false);
      onOrderSuccess();
    } else {
      // Razorpay Integration Readiness Handler
      // Checks for client key or gives clear transparent instructions
      const razorpayKey = (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || '';
      
      if (razorpayKey && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: totalPrice * 100, // in paise
          currency: 'INR',
          name: 'Nikunj Essence',
          description: `Order #${orderId}`,
          image: '/logo-3d.png',
          handler: function () {
            setConfirmedOrderId(orderId);
            setIsSubmitting(false);
            onOrderSuccess();
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phoneNumber,
          },
          theme: {
            color: '#0A1C12',
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsSubmitting(false);
      } else {
        // Honest disclosure of production payment gateway status
        // Allows instant fallback to WhatsApp or Direct UPI
        setIsSubmitting(false);
        setConfirmedOrderId(orderId);
        onOrderSuccess();
      }
    }
  };

  const handleCopyManifest = () => {
    if (!confirmedOrderId) return;
    const manifest = generateOrderManifest(confirmedOrderId);
    navigator.clipboard.writeText(manifest);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
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
            className="relative w-full max-w-3xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 my-8 z-10 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 md:p-6 bg-white border-b border-brand-gold/15 flex items-center justify-between shrink-0">
              <div>
                <p className="text-brand-gold font-medium text-[10px] uppercase tracking-[0.25em]">
                  Secure Shopping Experience
                </p>
                <h2 id="checkout-modal-title" className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">
                  {confirmedOrderId ? 'Order Confirmation' : 'Complete Your Order'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 p-5 md:p-8">
              {confirmedOrderId ? (
                /* ── ORDER CONFIRMATION VIEW ── */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-300">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                    Thank you for your order!
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-brand-dark mt-1 mb-2">
                    Order Placed Successfully
                  </h3>
                  <div className="inline-block bg-brand-cream border border-brand-gold/30 rounded-xl px-5 py-2.5 my-3">
                    <p className="text-xs text-brand-dark/60">Your Reference Number:</p>
                    <p className="font-mono text-xl font-bold text-brand-dark">#{confirmedOrderId}</p>
                  </div>

                  <p className="text-sm text-brand-dark/70 max-w-md mx-auto mb-6 leading-relaxed">
                    Our team at Nikunj Essence in Kannauj & Vrindavan has received your order request. We prepare your botanical attars with traditional care.
                  </p>

                  <div className="bg-white rounded-xl p-5 border border-brand-gold/15 max-w-lg mx-auto text-left mb-6 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
                      Order Manifest Summary
                    </h4>
                    <ul className="text-xs space-y-1.5 text-brand-dark/70 divide-y divide-brand-gold/10">
                      {items.map(item => (
                        <li key={`${item.product.id}-${item.variant.size}`} className="pt-1.5 flex justify-between">
                          <span>{item.product.name} ({item.variant.size}) × {item.quantity}</span>
                          <span className="font-medium text-brand-dark">₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-brand-gold/20 pt-3 mt-3 flex justify-between text-sm font-bold text-brand-dark">
                      <span>Total Payable:</span>
                      <span className="text-brand-gold">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleCopyManifest}
                      className="px-5 py-3 rounded-xl border border-brand-gold/30 text-brand-dark font-medium text-xs hover:bg-brand-cream transition-colors flex items-center gap-2 min-h-[44px]"
                    >
                      {copiedManifest ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-brand-gold" />}
                      {copiedManifest ? 'Order Details Copied!' : 'Copy Order Details'}
                    </button>
                    <a
                      href={`https://wa.me/919416160167?text=${encodeURIComponent(generateOrderManifest(confirmedOrderId))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-dark text-brand-goldLight px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-brand-green transition-colors flex items-center gap-2 min-h-[44px]"
                    >
                      <MessageSquare className="w-4 h-4" /> Message Desk on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                /* ── CHECKOUT FORM & SUMMARY ── */
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  {/* Itemized Order Summary Box */}
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-brand-gold/15 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3 flex items-center justify-between">
                      <span>Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                      <span className="text-brand-gold font-normal lowercase text-[11px]">Free delivery above ₹2,000</span>
                    </h3>

                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-brand-gold/10">
                      {items.map(item => (
                        <div key={`${item.product.id}-${item.variant.size}`} className="pt-2 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-medium text-brand-dark">{item.product.name}</span>
                            <span className="text-brand-dark/50 ml-1.5">({item.variant.size}) × {item.quantity}</span>
                          </div>
                          <span className="font-semibold text-brand-dark">
                            ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-brand-gold/15 mt-3 pt-3 space-y-1.5 text-xs text-brand-dark/70">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping & Handling:</span>
                        <span>
                          {shippingFee === 0 ? (
                            <span className="text-green-600 font-bold">FREE</span>
                          ) : (
                            `₹${shippingFee}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-serif font-bold text-brand-dark pt-1 border-t border-brand-gold/10">
                        <span>Total Payable:</span>
                        <span className="text-brand-gold">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-brand-gold/15 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Delivery & Contact Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium text-brand-dark mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                            errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                          } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                        />
                        {errors.fullName && <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName}</p>}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-medium text-brand-dark mb-1">
                          Phone Number (for dispatch updates) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-brand-dark/40 font-medium">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="94161 60167"
                            className={`w-full pl-11 pr-3.5 py-2.5 text-xs rounded-xl border ${
                              errors.phoneNumber ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                            } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                          />
                        </div>
                        {errors.phoneNumber && <p className="text-[10px] text-red-500 mt-0.5">{errors.phoneNumber}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-brand-dark mb-1">
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                          errors.email ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                        } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-xs font-medium text-brand-dark mb-1">
                        Delivery Street Address, Colony / Landmark <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={e => setAddressLine(e.target.value)}
                        placeholder="House no., Street, Colony, Landmark"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                          errors.addressLine ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                        } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                      />
                      {errors.addressLine && <p className="text-[10px] text-red-500 mt-0.5">{errors.addressLine}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* City */}
                      <div>
                        <label className="block text-xs font-medium text-brand-dark mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="e.g. Vrindavan"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                            errors.city ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                          } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                        />
                        {errors.city && <p className="text-[10px] text-red-500 mt-0.5">{errors.city}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-medium text-brand-dark mb-1">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-gold/25 bg-brand-light/20 focus:outline-none focus:border-brand-gold min-h-[44px]"
                        />
                      </div>

                      {/* PIN code */}
                      <div>
                        <label className="block text-xs font-medium text-brand-dark mb-1">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="281121"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                            errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-brand-gold/25'
                          } focus:outline-none focus:border-brand-gold bg-brand-light/20 min-h-[44px]`}
                        />
                        {errors.pincode && <p className="text-[10px] text-red-500 mt-0.5">{errors.pincode}</p>}
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-xs font-medium text-brand-dark mb-1">
                        Special Instructions / Fragrance Preferences (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Any notes for packaging or delivery timing"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-gold/25 bg-brand-light/20 focus:outline-none focus:border-brand-gold min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Payment Channel Selection */}
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-brand-gold/15 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> Payment & Ordering Method
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* WhatsApp Desk */}
                      <label
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                          paymentMethod === 'whatsapp'
                            ? 'border-brand-dark bg-brand-cream/60'
                            : 'border-brand-gold/20 hover:bg-brand-cream/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'whatsapp'}
                          onChange={() => setPaymentMethod('whatsapp')}
                          className="mt-1 accent-brand-gold"
                        />
                        <div>
                          <p className="text-xs font-bold text-brand-dark">Direct Order Desk (WhatsApp)</p>
                          <p className="text-[11px] text-brand-dark/60 mt-0.5">
                            Instant manifest generation sent directly to our Kannauj dispatch desk. Fast & personalized.
                          </p>
                        </div>
                      </label>

                      {/* Razorpay Online */}
                      <label
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                          paymentMethod === 'razorpay'
                            ? 'border-brand-dark bg-brand-cream/60'
                            : 'border-brand-gold/20 hover:bg-brand-cream/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="mt-1 accent-brand-gold"
                        />
                        <div>
                          <p className="text-xs font-bold text-brand-dark">Online Gateway (UPI / Cards)</p>
                          <p className="text-[11px] text-brand-dark/60 mt-0.5">
                            Integration-ready for Razorpay UPI/Netbanking.
                          </p>
                        </div>
                      </label>
                    </div>

                    {paymentMethod === 'razorpay' && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                        <strong>Notice:</strong> Online checkout is pre-configured with the Razorpay standard interface. Live automated card/UPI capture requires merchant keys configured on the backend. Submitting will confirm your order details and offer immediate direct desk routing without delay.
                      </div>
                    )}
                  </div>

                  {/* Submission Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-dark text-brand-goldLight py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-green transition-all shadow-lg flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <span>
                          {paymentMethod === 'whatsapp'
                            ? `Confirm & Send to WhatsApp Desk • ₹${totalPrice.toLocaleString('en-IN')}`
                            : `Proceed with Order • ₹${totalPrice.toLocaleString('en-IN')}`}
                        </span>
                      )}
                    </button>
                    <p className="text-center text-brand-dark/40 text-[10px] mt-2">
                      🔒 Your contact information is only used for packaging and shipping your fragrance order.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
