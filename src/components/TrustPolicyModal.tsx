import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, RotateCcw, ShieldCheck, HelpCircle, FileText, Phone, Mail, MapPin } from 'lucide-react';

export type PolicyTab = 'shipping' | 'returns' | 'authenticity' | 'faq' | 'privacy';

interface TrustPolicyModalProps {
  isOpen: boolean;
  activeTab: PolicyTab;
  onTabChange: (tab: PolicyTab) => void;
  onClose: () => void;
}

export function TrustPolicyModal({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
}: TrustPolicyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const tabs: { id: PolicyTab; label: string; icon: any }[] = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'authenticity', label: 'Purity & Authenticity', icon: ShieldCheck },
    { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy & Terms', icon: FileText },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
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
            className="relative w-full max-w-3xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 my-8 z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 md:p-6 bg-white border-b border-brand-gold/15 flex items-center justify-between shrink-0">
              <div>
                <p className="text-brand-gold font-medium text-[10px] uppercase tracking-[0.25em]">
                  Nikunj Essence Brand Policies
                </p>
                <h2 id="policy-modal-title" className="text-2xl font-serif font-bold text-brand-dark">
                  Customer Care & Policies
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close policies modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-brand-gold/15 bg-brand-cream/50 overflow-x-auto no-scrollbar shrink-0 px-4 pt-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 min-h-[44px] ${
                      isActive
                        ? 'border-brand-gold text-brand-dark bg-white rounded-t-lg'
                        : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-brand-dark/40'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 text-brand-dark/80 text-sm leading-relaxed space-y-4">
              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-brand-dark">Shipping & Delivery Policy</h3>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2">
                    <p className="font-semibold text-brand-dark">Pan-India Delivery Timelines</p>
                    <p className="text-xs text-brand-dark/70">
                      All orders are carefully packed in protective luxury packaging and dispatched within 24 to 48 hours directly from our Kannauj distillation center or Vrindavan distribution desk. Estimated delivery across India is 3 to 7 business days depending on your postal PIN code.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2">
                    <p className="font-semibold text-brand-dark">Shipping Charges</p>
                    <ul className="text-xs text-brand-dark/70 list-disc list-inside space-y-1">
                      <li><strong>Free Standard Delivery:</strong> On all orders totaling ₹2,000 or above.</li>
                      <li><strong>Flat ₹99 Delivery:</strong> On orders below ₹2,000 across India.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2">
                    <p className="font-semibold text-brand-dark">Tracking & Confirmation</p>
                    <p className="text-xs text-brand-dark/70">
                      Upon dispatch, a consignment tracking number with live courier status is shared directly with you via WhatsApp and SMS/Email.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-brand-dark">Returns & Replacement Policy</h3>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2">
                    <p className="font-semibold text-brand-dark">Hygiene & Natural Oil Integrity</p>
                    <p className="text-xs text-brand-dark/70">
                      Due to the personal nature and purity standards of natural attars and aromatic hydrosols, we do not accept returns on opened or used products. This ensures every customer receives untampered, 100% pure formulations.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2">
                    <p className="font-semibold text-brand-dark">Transit Damage Guarantee (7 Days)</p>
                    <p className="text-xs text-brand-dark/70">
                      If your bottle arrives damaged, cracked, or leaking during transit, please share a photo/video within 7 days of receiving the package with our support desk at +91 94161 60167 or nikunjessense84@gmail.com. We will immediately dispatch a free replacement bottle with zero hassle.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'authenticity' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-brand-dark">Authenticity & Purity Guarantee</h3>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-3">
                    <p className="font-semibold text-brand-dark">The Kannauj Deg & Bhapka Tradition</p>
                    <p className="text-xs text-brand-dark/70">
                      Kannauj is celebrated globally as India's perfume capital, carrying over 500 years of traditional hydro-distillation. We source directly from generational artisan distillers who utilize copper stills (Deg) and receiver condensers (Bhapka) over wood or coal fires.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-gold/10">
                      <div className="p-2 bg-brand-cream/60 rounded text-[11px]">
                        <strong>Zero Alcohol:</strong> 100% alcohol-free oil concentrate.
                      </div>
                      <div className="p-2 bg-brand-cream/60 rounded text-[11px]">
                        <strong>No Synthetics:</strong> Free from phthalates, parabens, & DEP/DPG solvents.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-bold text-brand-dark">Frequently Asked Questions</h3>
                  {[
                    {
                      q: 'How does natural Attar differ from spray perfumes?',
                      a: 'Commercial perfumes typically contain 80–90% alcohol and synthetic fixatives that evaporate within 2–3 hours. Authentic Attar is 100% concentrated botanical oil distilled onto sandalwood or natural base oil, lasting 8–12 hours and evolving with your body heat.'
                    },
                    {
                      q: 'How should I apply Attar?',
                      a: 'Dab a single drop using the applicator wand onto your pulse points: wrists, behind earlobes, or base of the neck. Do not rub vigorously; allow the natural botanicals to settle and diffuse naturally.'
                    },
                    {
                      q: 'Are your products safe for sensitive skin?',
                      a: 'Yes, because our attars contain zero alcohol, chemical binders, or artificial colors. However, as with all natural plant extracts, we recommend a small patch test if you have specific botanical sensitivities.'
                    },
                    {
                      q: 'How long does an Attar bottle last?',
                      a: 'Because authentic attars are pure concentrated oils, a 3ml bottle often provides over 100 applications (lasting 2 to 3 months of daily wear). Attars stored in cool, dark spots improve with age like fine wine.'
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-brand-gold/15">
                      <h4 className="font-bold text-xs text-brand-dark mb-1">{faq.q}</h4>
                      <p className="text-xs text-brand-dark/70">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-brand-dark">Privacy Policy & Terms</h3>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2 text-xs text-brand-dark/70">
                    <p>
                      <strong>Information Privacy:</strong> Nikunj Essence values your trust. When you place an order or contact us, your name, contact phone, delivery address, and email are used exclusively for fulfilling your fragrance order and sending courier tracking updates. We never sell, rent, or trade customer data to third-party marketers.
                    </p>
                    <p className="pt-2">
                      <strong>Terms of Service:</strong> All product descriptions, pricing, and volume specifications reflect our genuine inventory from Kannauj. Orders submitted via our online desk are confirmed upon inventory verification.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-brand-gold/15 space-y-2 text-xs">
                    <p className="font-bold text-brand-dark">Direct Support Desk</p>
                    <div className="flex flex-col gap-1.5 text-brand-dark/70">
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-gold" /> +91 94161 60167</span>
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-gold" /> nikunjessense84@gmail.com</span>
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-gold" /> Radha Town, Vrindavan 281121, UP, India</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
