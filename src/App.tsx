import { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet, Leaf, Sparkles, Clock, ShoppingBag, Heart, Shield,
  ChevronRight, Check, MapPin, Phone, Mail, Menu, X, ChevronDown,
  Search, SlidersHorizontal, ArrowUpDown, Info, Eye, ExternalLink
} from 'lucide-react';

import { FloatingParticles } from './components/FloatingParticles';
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrustPolicyModal, type PolicyTab } from './components/TrustPolicyModal';
import { useCart } from './hooks/useCart';
import { useIsMobile } from './hooks/useIsMobile';
import { products, categories, comparisonData, type Product, type ProductVariant } from './data/products';

/* ═══════════════════════════════════════════
   ANIMATION PRESETS
   ═══════════════════════════════════════════ */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5 },
});

/* ═══════════════════════════════════════════
   BENTO FEATURE DATA (EXPLICIT PRODUCT BENEFITS)
   ═══════════════════════════════════════════ */
const bentoFeatures = [
  { icon: <Leaf className="w-6 h-6" />, title: '100% Natural', desc: 'Pure flowers, herbs & botanical oils. Zero synthetic compounds.', wide: false },
  { icon: <Shield className="w-6 h-6" />, title: 'Skin-Friendly', desc: 'Alcohol-free & safe for daily use on sensitive skin.', wide: false },
  { icon: <Clock className="w-6 h-6" />, title: 'Long-Lasting', desc: 'A single application lasts 8–12 hours, evolving beautifully.', wide: true },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Pure & Authentic', desc: 'No chemicals, preservatives, or artificial colors.', wide: false },
  { icon: <Heart className="w-6 h-6" />, title: 'Therapeutic', desc: 'Natural aromas relax the mind and elevate mood.', wide: false },
  { icon: <Droplet className="w-6 h-6" />, title: 'Vegan & Cruelty-Free', desc: 'Non-alcoholic botanical formulations. Never tested on animals.', wide: true },
];

/* ═══════════════════════════════════════════
   EMBLEM 3D
   ═══════════════════════════════════════════ */
function Emblem3D(props: any) {
  const texture = useTexture(import.meta.env.BASE_URL + 'logo-3d-transparent.png');
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const baseY = props.position?.[1] || 0;
      ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[props.size || 3, props.size || 3]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════ */
function App() {
  const isMobile = useIsMobile();
  const cart = useCart();

  // WebGL Availability Check (synchronous to prevent unhandled Canvas mount when WebGL is disabled)
  const [hasWebGL] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return Boolean(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      return false;
    }
  });

  // Catalogue Filters & Search State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name-asc'>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under-500' | '500-1500' | 'above-1500'>('all');
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});

  // Modals & Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyTab>('shipping');
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const [activeShowcaseId, setActiveShowcaseId] = useState<string>('khus-attar');

  const heroProduct = products.find(p => p.id === 'khus-attar') || products[0];
  const showcaseProduct = products.find(p => p.id === activeShowcaseId) || heroProduct;
  const showcaseDisplayName =
    showcaseProduct.id === 'khus-attar'
      ? 'Wild Khus Essence'
      : showcaseProduct.id === 'rose-attar'
      ? 'Damask Rose Essence'
      : showcaseProduct.id === 'sandal-attar'
      ? 'Mysore Sandal Essence'
      : showcaseProduct.name;

  const getVariantIndex = (productId: string) => selectedVariant[productId] ?? 0;

  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const vi = getVariantIndex(product.id);
    const targetVariant = variant || product.variants[vi] || product.variants[0];
    cart.addItem(product, targetVariant, quantity);
  };

  const openPolicies = (tab: PolicyTab) => {
    setActivePolicyTab(tab);
    setPolicyModalOpen(true);
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTag = p.tagline.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchNotes =
            p.notes.top.toLowerCase().includes(q) ||
            p.notes.heart.toLowerCase().includes(q) ||
            p.notes.base.toLowerCase().includes(q);
          const matchBenefits = p.benefits.some(b => b.toLowerCase().includes(q));
          if (!matchName && !matchTag && !matchDesc && !matchNotes && !matchBenefits) {
            return false;
          }
        }

        // Price Range Filter
        const minPrice = Math.min(...p.variants.map(v => v.price));
        if (priceRange === 'under-500' && minPrice >= 500) return false;
        if (priceRange === '500-1500' && (minPrice < 500 || minPrice > 1500)) return false;
        if (priceRange === 'above-1500' && minPrice <= 1500) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants[getVariantIndex(a.id)]?.price ?? a.variants[0].price;
        const priceB = b.variants[getVariantIndex(b.id)]?.price ?? b.variants[0].price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // featured default
      });
  }, [activeCategory, searchQuery, sortBy, priceRange, selectedVariant]);

  const particleCount = isMobile ? 12 : 35;

  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-gold selection:text-white max-w-full overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 lg:px-12 py-3 md:py-4 flex justify-between items-center bg-brand-light/95 backdrop-blur-xl border-b border-brand-gold/15 transition-all">
        <a href="#" className="text-lg md:text-2xl font-serif font-bold text-brand-dark tracking-wider flex items-center min-h-[44px]">
          <span className="text-brand-gold">N</span>IKUNJ&nbsp;<span className="text-brand-gold">E</span>SSENCE
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.18em] font-medium text-brand-dark/75">
          <a href="#collection" className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center">Collection</a>
          <a href="#heritage" className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center">Heritage</a>
          <a href="#catalogue" className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center font-bold text-brand-dark">Catalogue</a>
          <a href="#compare" className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center">Why Attar</a>
          <button onClick={() => openPolicies('authenticity')} className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center uppercase tracking-[0.18em]">Purity</button>
          <button onClick={() => openPolicies('faq')} className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center uppercase tracking-[0.18em]">FAQ</button>
          <a href="#contact" className="hover:text-brand-gold transition-colors duration-200 min-h-[44px] flex items-center">Contact</a>
        </div>

        {/* Actions (Bag & Mobile Toggle) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => cart.setIsOpen(true)}
            className="relative p-3 rounded-full hover:bg-brand-gold/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Open shopping cart (${cart.totalItems} items)`}
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark" />
            {cart.totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-brand-gold text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow-sm">
                {cart.totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-full hover:bg-brand-gold/10 min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-dark"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[57px] left-0 w-full bg-brand-light/98 backdrop-blur-xl z-40 border-b border-brand-gold/20 px-6 py-4 space-y-1 lg:hidden shadow-xl"
          >
            {[
              { label: 'Collection', href: '#collection' },
              { label: 'Heritage', href: '#heritage' },
              { label: 'Product Catalogue', href: '#catalogue' },
              { label: 'Why Attar vs Perfume', href: '#compare' },
              { label: 'Contact Us', href: '#contact' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-base font-serif text-brand-dark hover:text-brand-gold transition-colors border-b border-brand-gold/10 last:border-0 min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex gap-3 text-xs uppercase tracking-wider text-brand-dark/70">
              <button
                onClick={() => { setMobileMenuOpen(false); openPolicies('shipping'); }}
                className="py-2 hover:text-brand-gold min-h-[40px] flex items-center"
              >
                Shipping Policy
              </button>
              <span className="py-2 text-brand-gold/40 flex items-center">•</span>
              <button
                onClick={() => { setMobileMenuOpen(false); openPolicies('returns'); }}
                className="py-2 hover:text-brand-gold min-h-[40px] flex items-center"
              >
                Returns
              </button>
              <span className="py-2 text-brand-gold/40 flex items-center">•</span>
              <button
                onClick={() => { setMobileMenuOpen(false); openPolicies('faq'); }}
                className="py-2 hover:text-brand-gold min-h-[40px] flex items-center"
              >
                FAQ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════ */}
      <section className="relative w-full min-h-[100svh] flex flex-col lg:flex-row items-center pt-[57px] overflow-hidden">
        {/* Ambient lighting accents */}
        <div className="absolute top-20 right-0 w-[240px] md:w-[480px] h-[240px] md:h-[480px] bg-brand-gold/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[380px] h-[200px] md:h-[380px] bg-brand-green/8 rounded-full blur-[60px] pointer-events-none" />

        {/* 3D Canvas / Emblem */}
        <div className="w-full lg:w-1/2 h-[280px] sm:h-[340px] lg:h-screen relative order-1 lg:order-2 flex items-center justify-center">
          <CanvasErrorBoundary
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <img src="/logo-3d-transparent.png" alt="Nikunj Essence 3D Logo" className="w-56 h-56 object-contain drop-shadow-2xl" />
              </div>
            }
          >
            {hasWebGL ? (
              <Canvas
                camera={{ position: [0, 0, isMobile ? 6 : 5.5], fov: isMobile ? 38 : 42 }}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                performance={{ min: 0.5 }}
              >
                <ambientLight intensity={0.5} />
                <spotLight position={[8, 8, 8]} angle={0.2} penumbra={1} intensity={1.5} castShadow={!isMobile} />
                {!isMobile && <spotLight position={[-5, 3, 5]} angle={0.3} penumbra={1} intensity={0.5} color="#FF8A50" />}
                <Environment preset="city" />
                <FloatingParticles count={particleCount} color="#E05D26" area={isMobile ? 4 : 5} />
                <PresentationControls
                  global
                  rotation={[0.1, 0.1, 0]}
                  polar={[-0.3, 0.2]}
                  azimuth={[-0.8, 0.6]}
                  config={{ mass: 2, tension: 400 }}
                  snap={{ mass: 4, tension: 300 }}
                >
                  <Suspense fallback={null}>
                    <Emblem3D position={[0, 0, 0]} size={isMobile ? 3.5 : 4.5} />
                  </Suspense>
                </PresentationControls>
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img src="/logo-3d-transparent.png" alt="Nikunj Essence 3D Logo" className="w-56 h-56 object-contain drop-shadow-2xl" />
              </div>
            )}
          </CanvasErrorBoundary>

          {/* Floating How to Use Button */}
          <button
            onClick={() => setHowToUseOpen(true)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2 px-3 md:px-4 py-2 border border-brand-gold/30 rounded-full text-brand-dark hover:bg-brand-gold/10 transition-colors text-[10px] md:text-xs uppercase tracking-widest font-bold bg-brand-light/70 backdrop-blur-md shadow-md min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>How to Use Attar</span>
          </button>
        </div>

        {/* Hero Text content */}
        <div className="w-full lg:w-1/2 px-6 md:px-12 lg:pl-20 z-10 flex flex-col justify-center py-8 lg:py-0 lg:min-h-screen order-2 lg:order-1">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-brand-gold font-medium text-[10px] md:text-xs uppercase tracking-[0.35em] mb-3 md:mb-6">
              Pure Fragrance & Botanical Wellness · Est. Kannauj
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-brand-dark leading-[0.96] mb-5 md:mb-8">
              Nature's<br />
              <span className="italic font-light">Purity</span> in<br />
              Every <span className="gold-shimmer">Drop</span>
            </h1>
            <p className="text-base md:text-lg text-brand-dark/70 mb-8 md:mb-10 max-w-lg leading-relaxed font-light">
              Concentrated botanical perfume oils, pure botanical hydrosols, and sacred aromatics. Traditionally steam-distilled by generational master distillers in Kannauj.<br className="hidden md:block" />
              <span className="font-semibold text-brand-gold mt-2 block">Our Strength, Your Assurance.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#catalogue"
                className="group bg-brand-dark text-brand-goldLight px-7 py-4 hover:bg-brand-green transition-all duration-300 uppercase tracking-[0.14em] text-xs md:text-sm font-bold flex items-center justify-center gap-2 min-h-[52px] rounded-xl shadow-lg"
              >
                Shop Catalogue
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#heritage"
                className="text-brand-dark font-medium underline underline-offset-8 decoration-brand-gold/40 hover:decoration-brand-gold transition-colors duration-300 text-center py-3 min-h-[44px] flex items-center justify-center text-sm"
              >
                Our Kannauj Heritage
              </a>
              <button
                onClick={() => setHowToUseOpen(true)}
                className="text-brand-dark font-medium underline underline-offset-8 decoration-brand-gold/40 hover:decoration-brand-gold transition-colors duration-300 text-center py-3 min-h-[44px] flex items-center justify-center text-sm"
              >
                Application Ritual
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator for mobile */}
        {isMobile && (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 order-3 z-10"
          >
            <ChevronDown className="w-5 h-5 text-brand-dark/30" />
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════
          HERITAGE SECTION
          ══════════════════════════════════════ */}
      <section id="heritage" className="relative bg-brand-dark text-brand-light py-16 md:py-28 px-6 md:px-16 overflow-hidden grain-overlay">
        <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-brand-gold/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-16">
            <p className="ornament-divider text-brand-goldLight text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 md:mb-6">
              Our Authenticity
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-goldLight mb-4 md:mb-6">
              Rooted in Kannauj
            </h2>
            <p className="text-brand-light/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
              We source unadulterated botanical essences directly from trusted artisan distillers in Kannauj—the historic perfume capital of India. Every formulation is strictly verified for unadulterated purity, zero synthetic additives, and traditional craftsmanship.
            </p>
          </motion.div>

          {/* Stat cards */}
          <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-8 overflow-x-auto no-scrollbar scroll-snap-x pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
            {[
              { number: '500+', label: 'Years of Heritage', desc: 'Ancient Deg & Bhapka hydro-distillation traditions' },
              { number: '100%', label: 'Botanical Ingredients', desc: 'Pure flowers, roots, resins & herbs — zero synthetics' },
              { number: '8–12+', label: 'Hours of Fragrance', desc: 'Concentrated perfume oil that blooms naturally with skin heat' },
            ].map((stat, idx) => (
              <motion.div key={idx} {...stagger(idx * 0.12)}
                className="glass-card rounded-2xl p-6 md:p-8 text-center hover:border-brand-gold/40 transition-colors duration-300 min-w-[240px] md:min-w-0 flex-shrink-0"
              >
                <p className="text-4xl md:text-5xl font-serif font-bold gold-shimmer mb-2">{stat.number}</p>
                <p className="text-brand-goldLight font-medium text-base md:text-lg mb-1">{stat.label}</p>
                <p className="text-brand-light/50 text-xs md:text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO FEATURES GRID ("WHY CHOOSE ATTAR")
          ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-16 bg-brand-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-16">
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Botanical Difference</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-3">Why Choose Pure Attar?</h2>
            <p className="text-brand-dark/60 max-w-md mx-auto text-sm md:text-base">Pure botanical formulations respectful to your skin and senses.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bentoFeatures.map((f, idx) => (
              <motion.div key={idx} {...stagger(idx * 0.05)}
                className="bento-card bg-white rounded-xl md:rounded-2xl p-6 border border-brand-gold/15 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-brand-gold mb-4 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-dark mb-1.5">{f.title}</h3>
                <p className="text-brand-dark/60 text-xs md:text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTERACTIVE 3D PRODUCT SHOWCASE
          ══════════════════════════════════════ */}
      <section id="collection" className="py-16 md:py-24 px-6 md:px-16 bg-brand-light">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-16">
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Artisanal Distillation</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark">Signature Fragrance Showcase</h2>
            <p className="text-xs md:text-sm text-brand-dark/60 mt-2">Authentic Kannauj attars steam-distilled from pure flowers, woods, and roots.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
            {/* Luxury Product Highlight Stage */}
            <div className="w-full lg:w-1/2 min-h-[400px] sm:min-h-[480px] lg:h-[580px] bg-white rounded-2xl lg:rounded-3xl overflow-hidden relative shadow-xl border border-brand-gold/25 flex flex-col justify-between p-6 sm:p-8 group order-1 lg:order-2">
              {/* Background ambient liquid glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
                style={{ background: `radial-gradient(circle at 50% 40%, ${showcaseProduct.liquidColor}, transparent 70%)` }}
              />

              {/* Top Bar with Origin & Purity Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-brand-dark/90 text-brand-goldLight px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md border border-brand-gold/20 shadow-sm">
                  <span className="text-[9px] text-brand-gold block font-mono uppercase tracking-widest">Kannauj Heritage</span>
                  <span className="font-serif font-bold text-sm">{showcaseProduct.tagline}</span>
                </div>
                <span className="bg-brand-gold/15 text-brand-dark font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border border-brand-gold/30">
                  100% Botanical
                </span>
              </div>

              {/* Central Luxury Image Presentation with smooth crossfade */}
              <div className="relative z-10 flex-1 flex items-center justify-center my-4 overflow-hidden">
                <motion.div
                  key={showcaseProduct.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative max-h-full aspect-square flex items-center justify-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${showcaseProduct.imageUrl}`}
                    alt={showcaseProduct.name}
                    className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover rounded-2xl shadow-2xl border-2 border-white/60 group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

              {/* Bottom Showcase Info Bar */}
              <div className="relative z-10 bg-brand-light/95 backdrop-blur-md rounded-xl p-4 border border-brand-gold/20 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <p className="font-serif font-bold text-base text-brand-dark">{showcaseDisplayName}</p>
                  <p className="text-[11px] text-brand-dark/60 mt-0.5">
                    <span className="font-semibold text-brand-gold">Notes:</span> {showcaseProduct.notes.top} • {showcaseProduct.notes.heart} • {showcaseProduct.notes.base}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedProductForDetail(showcaseProduct)}
                    className="px-3.5 py-2 rounded-xl border border-brand-gold/40 text-brand-dark text-xs font-semibold hover:bg-white transition-colors min-h-[40px]"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(showcaseProduct)}
                    className="px-4 py-2 rounded-xl bg-brand-dark text-brand-goldLight text-xs font-bold uppercase tracking-wider hover:bg-brand-green transition-colors min-h-[40px] flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add from ₹{showcaseProduct.variants[0].price.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            </div>

            {/* Showcase Selection List */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col justify-center space-y-3.5">
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-1">
                Select a Fragrance to Explore:
              </h3>
              {products.slice(0, 4).map((prod) => {
                const isSelected = showcaseProduct.id === prod.id;
                const displayName =
                  prod.id === 'khus-attar'
                    ? 'Wild Khus Essence'
                    : prod.id === 'rose-attar'
                    ? 'Damask Rose Essence'
                    : prod.id === 'sandal-attar'
                    ? 'Mysore Sandal Essence'
                    : prod.name;

                return (
                  <div
                    key={prod.id}
                    onClick={() => setActiveShowcaseId(prod.id)}
                    className={`p-4 md:p-5 rounded-2xl cursor-pointer border transition-all duration-300 flex items-center justify-between group ${
                      isSelected
                        ? 'border-brand-dark bg-white shadow-md'
                        : 'border-brand-gold/15 bg-white/50 hover:bg-white hover:border-brand-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-brand-gold/30 bg-white">
                        <img
                          src={`${import.meta.env.BASE_URL}${prod.imageUrl}`}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base md:text-lg text-brand-dark group-hover:text-brand-gold transition-colors">
                            {displayName}
                          </h4>
                          {isSelected && (
                            <span className="bg-brand-gold/15 text-brand-gold text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-brand-dark/60 text-xs">{prod.tagline}</p>
                        <p className="text-brand-dark/40 text-[10px] mt-0.5">Notes: {prod.notes.top} • {prod.notes.heart} • {prod.notes.base}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-3">
                      <span className="font-serif font-bold text-sm text-brand-dark">
                        from ₹{prod.variants[0].price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForDetail(prod);
                        }}
                        className="mt-1 text-[11px] text-brand-gold font-bold hover:underline flex items-center gap-1 min-h-[36px]"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRODUCT CATALOGUE (PHASE 3)
          ══════════════════════════════════════ */}
      <section id="catalogue" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-brand-dark text-brand-light grain-overlay relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-8 md:mb-12">
            <p className="text-brand-goldLight text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 font-medium">
              Curated Fragrance Catalogue
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-goldLight mb-3">
              Shop Our Natural Collection
            </h2>
            <p className="text-xs md:text-sm text-brand-light/60 max-w-lg mx-auto leading-relaxed">
              Traditional botanical attars, hydro-distilled herbal waters, and pure sacred aromatics handcrafted in Kannauj.
            </p>
          </motion.div>

          {/* ── Search, Filters & Sorting Toolbar ── */}
          <div className="bg-brand-green/40 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-brand-gold/20 mb-8 md:mb-10 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fragrances (e.g. Khus, Rose, Sandal, floral, meditative)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-brand-dark/80 border border-brand-gold/20 rounded-xl text-xs md:text-sm text-brand-light placeholder:text-brand-light/40 focus:outline-none focus:border-brand-gold transition-colors min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light/40 hover:text-brand-light p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Price Filter & Sorting Controls */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                {/* Price Range */}
                <div className="flex items-center gap-1.5 bg-brand-dark/80 border border-brand-gold/20 rounded-xl px-2.5 py-1 min-h-[44px]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <select
                    value={priceRange}
                    onChange={(e: any) => setPriceRange(e.target.value)}
                    className="bg-transparent text-xs text-brand-light focus:outline-none cursor-pointer py-1"
                    aria-label="Filter by price range"
                  >
                    <option value="all" className="bg-brand-dark text-brand-light">All Prices</option>
                    <option value="under-500" className="bg-brand-dark text-brand-light">Under ₹500</option>
                    <option value="500-1500" className="bg-brand-dark text-brand-light">₹500 – ₹1,500</option>
                    <option value="above-1500" className="bg-brand-dark text-brand-light">Above ₹1,500</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-1.5 bg-brand-dark/80 border border-brand-gold/20 rounded-xl px-2.5 py-1 min-h-[44px]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-brand-light focus:outline-none cursor-pointer py-1"
                    aria-label="Sort products by"
                  >
                    <option value="featured" className="bg-brand-dark text-brand-light">Featured</option>
                    <option value="price-low" className="bg-brand-dark text-brand-light">Price: Low to High</option>
                    <option value="price-high" className="bg-brand-dark text-brand-light">Price: High to Low</option>
                    <option value="name-asc" className="bg-brand-dark text-brand-light">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar scroll-snap-x pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 min-h-[40px] shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-brand-gold text-white shadow-md'
                      : 'bg-brand-dark/60 text-brand-light/70 hover:bg-brand-dark hover:text-brand-light border border-brand-gold/15'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count & active search summary */}
          <div className="flex justify-between items-center text-xs text-brand-light/50 mb-6 px-1">
            <span>Showing <strong>{filteredProducts.length}</strong> available item{filteredProducts.length === 1 ? '' : 's'}</span>
            {(searchQuery || activeCategory !== 'all' || priceRange !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange('all');
                }}
                className="text-brand-goldLight hover:underline font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* ── Product Grid ── */}
          {filteredProducts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8">
              <Search className="w-10 h-10 text-brand-gold/40 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-brand-goldLight mb-1">No Fragrances Found</h3>
              <p className="text-xs text-brand-light/50 mb-6 leading-relaxed">
                We couldn't find any items matching your search or filters. Try adjusting your query or resetting filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange('all');
                }}
                className="px-6 py-2.5 bg-brand-gold text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-goldLight transition-colors min-h-[44px]"
              >
                View Complete Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => {
                  const vIdx = getVariantIndex(product.id);
                  const activeVariant = product.variants[vIdx] || product.variants[0];

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-brand-gold/40 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      {/* Product Header / Visual Card */}
                      <div
                        onClick={() => setSelectedProductForDetail(product)}
                        className="aspect-[4/3] w-full relative overflow-hidden flex items-center justify-center bg-brand-light cursor-pointer group-hover:brightness-105 transition-all"
                        style={!product.imageUrl ? { background: `linear-gradient(135deg, ${product.liquidColor}22, ${product.accentColor}33)` } : undefined}
                      >
                        {product.imageUrl ? (
                          <img
                            src={`${import.meta.env.BASE_URL}${product.imageUrl}`}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="relative flex flex-col items-center justify-center p-4">
                            <div
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg opacity-90 flex items-center justify-center border-2 border-white/40"
                              style={{ background: `radial-gradient(circle at 35% 35%, ${product.accentColor}, ${product.liquidColor})` }}
                            >
                              <span className="font-serif text-white font-bold text-2xl">N</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-brand-dark/50 mt-2 font-mono">
                              Kannauj Distilled
                            </span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-brand-dark/85 text-brand-gold text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border border-brand-gold/20">
                            {product.category.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Quick View Button Hover */}
                        <div className="absolute inset-0 bg-brand-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-brand-light text-brand-dark font-medium text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-brand-gold" /> View Details
                          </span>
                        </div>
                      </div>

                      {/* Product Content Body */}
                      <div className="p-4 md:p-5 flex flex-col flex-1">
                        <div className="mb-2">
                          <p className="text-brand-goldLight text-[10px] uppercase tracking-[0.16em] font-medium">
                            {product.tagline}
                          </p>
                          <h3
                            onClick={() => setSelectedProductForDetail(product)}
                            className="text-base md:text-lg font-serif font-bold text-brand-light hover:text-brand-gold transition-colors cursor-pointer"
                          >
                            {product.name}
                          </h3>
                        </div>

                        <p className="text-brand-light/60 text-xs leading-relaxed mb-3.5 line-clamp-2 font-light">
                          {product.description}
                        </p>

                        {/* Fragrance Notes Preview */}
                        <div className="bg-white/5 rounded-lg p-2 mb-3.5 text-[10px] text-brand-light/50 border border-white/5">
                          <span className="text-brand-goldLight font-medium block mb-0.5">Key Notes:</span>
                          <span className="truncate block">{product.notes.top} • {product.notes.heart} • {product.notes.base}</span>
                        </div>

                        {/* Variant Selector Pills */}
                        <div className="flex gap-1.5 mb-4 flex-wrap">
                          {product.variants.map((v, vi) => (
                            <button
                              key={v.size}
                              onClick={() => setSelectedVariant(prev => ({ ...prev, [product.id]: vi }))}
                              className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold transition-all min-h-[32px] ${
                                vIdx === vi
                                  ? 'bg-brand-gold text-white shadow-sm'
                                  : 'bg-brand-green/40 text-brand-light/60 hover:bg-brand-green/70 border border-white/5'
                              }`}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>

                        {/* Price & Add to Bag Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                          <div>
                            <p className="text-lg md:text-xl font-serif font-bold text-brand-goldLight">
                              ₹{activeVariant.price.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[9px] text-brand-light/40">/{activeVariant.size}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedProductForDetail(product)}
                              className="p-2.5 rounded-lg border border-white/10 text-brand-light/70 hover:text-brand-gold hover:border-brand-gold/40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label={`View full details for ${product.name}`}
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-brand-gold text-white px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-goldLight hover:text-brand-dark transition-all flex items-center gap-1.5 shadow-md min-h-[44px]"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPARISON TABLE ("ATTAR VS PERFUME")
          ══════════════════════════════════════ */}
      <section id="compare" className="py-16 md:py-24 px-6 md:px-16 bg-brand-cream">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8 md:mb-14">
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 font-semibold">The Comparative Truth</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-3">Natural Attar vs. Synthetic Perfume</h2>
            <p className="text-brand-dark/60 max-w-md mx-auto text-sm">Discover why authentic botanical attar is the purer, healthier choice.</p>
          </motion.div>

          <motion.div {...fadeUp} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-brand-gold/15">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-3 bg-brand-dark text-brand-light">
              <div className="p-3.5 md:p-5 text-[11px] md:text-sm font-medium text-brand-light/60 uppercase tracking-wider flex items-center">Feature</div>
              <div className="p-3.5 md:p-5 text-center flex items-center justify-center">
                <span className="text-brand-gold font-serif font-bold text-sm md:text-lg">Natural Attar</span>
              </div>
              <div className="p-3.5 md:p-5 text-center flex items-center justify-center">
                <span className="text-brand-light/50 font-serif text-sm md:text-lg">Commercial Perfume</span>
              </div>
            </div>
            {/* Rows */}
            {comparisonData.map((row, idx) => (
              <div key={idx} className="comparison-row grid grid-cols-[1fr_1fr_1fr] md:grid-cols-3 border-b border-brand-gold/10 last:border-0">
                <div className="p-3.5 md:p-5 font-medium text-brand-dark text-xs md:text-sm flex items-center">{row.feature}</div>
                <div className="p-3.5 md:p-5 text-[11px] md:text-sm text-brand-dark/80 flex items-start gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>{row.attar}</span>
                </div>
                <div className="p-3.5 md:p-5 text-[11px] md:text-sm text-brand-dark/40">
                  {row.perfume}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER & TRUST DETAILS
          ══════════════════════════════════════ */}
      <footer id="contact" className="bg-brand-dark py-14 md:py-20 px-6 md:px-16 border-t border-brand-gold/15 grain-overlay relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12 md:mb-16">
            
            {/* Brand column */}
            <div className="md:col-span-1">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-light tracking-wider mb-3">
                <span className="text-brand-gold">N</span>IKUNJ <span className="text-brand-gold">E</span>SSENCE
              </h3>
              <p className="text-brand-light/50 text-xs md:text-sm leading-relaxed mb-4">
                Manufacturers and purveyors of authentic botanical Attars, distilled plant hydrosols, and aromatic raw materials distilled in Kannauj, India.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['botanical oils', 'zero-alcohol', 'all-day wear', 'skin-safe'].map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-brand-goldLight font-serif font-bold mb-3 md:mb-4 text-sm md:text-base">Navigation</h4>
              <div className="space-y-2 text-xs md:text-sm">
                <a href="#collection" className="block text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center">3D Collection</a>
                <a href="#heritage" className="block text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center">Our Kannauj Heritage</a>
                <a href="#catalogue" className="block text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center">Product Catalogue</a>
                <a href="#compare" className="block text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center">Why Attar vs Perfume</a>
              </div>
            </div>

            {/* Brand Policies & Trust */}
            <div>
              <h4 className="text-brand-goldLight font-serif font-bold mb-3 md:mb-4 text-sm md:text-base">Customer Care</h4>
              <div className="space-y-2 text-xs md:text-sm">
                <button
                  onClick={() => openPolicies('shipping')}
                  className="text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center text-left"
                >
                  Shipping & Pan-India Delivery
                </button>
                <button
                  onClick={() => openPolicies('returns')}
                  className="text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center text-left"
                >
                  Returns & Replacement Policy
                </button>
                <button
                  onClick={() => openPolicies('authenticity')}
                  className="text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center text-left"
                >
                  Purity & Kannauj Guarantee
                </button>
                <button
                  onClick={() => openPolicies('faq')}
                  className="text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center text-left"
                >
                  Frequently Asked Questions
                </button>
                <button
                  onClick={() => openPolicies('privacy')}
                  className="text-brand-light/50 hover:text-brand-gold transition-colors min-h-[36px] flex items-center text-left"
                >
                  Privacy Policy & Terms
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-brand-goldLight font-serif font-bold mb-3 md:mb-4 text-sm md:text-base">Get In Touch</h4>
              <div className="space-y-3 text-xs md:text-sm text-brand-light/50">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>Radha Town, Vrindavan<br />Pincode: 281121, UP, India</span>
                </div>
                <a href="tel:+919416160167" className="flex items-center gap-2.5 hover:text-brand-gold transition-colors min-h-[44px]">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>+91 94161 60167</span>
                </a>
                <a href="mailto:nikunjessense84@gmail.com" className="flex items-center gap-2.5 hover:text-brand-gold transition-colors min-h-[44px]">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>nikunjessense84@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/919416160167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold hover:underline mt-1 min-h-[40px]"
                >
                  <span>Chat on WhatsApp Desk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-brand-gold/15 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-brand-light/40 text-[11px] tracking-wider">
              © 2026 Nikunj Essence — Fragrance & Botanical Wellness. All rights reserved.
            </p>
            <p className="text-brand-light/30 text-[10px]">
              Distilled in Kannauj · Handcrafted in India · Free Shipping above ₹2,000
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MOBILE STICKY BOTTOM BAR
          ══════════════════════════════════════ */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-brand-dark/95 backdrop-blur-xl border-t border-brand-gold/20 z-50 mobile-sticky-bar">
          <div className="flex items-center justify-between px-4 py-2">
            <div
              onClick={() => setSelectedProductForDetail(heroProduct)}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-brand-gold/30 shrink-0 bg-white">
                <img
                  src={`${import.meta.env.BASE_URL}${heroProduct.imageUrl}`}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate max-w-[130px]">
                <p className="text-brand-light text-xs font-medium truncate">{heroProduct.name}</p>
                <p className="text-brand-gold text-[10px]">from ₹{heroProduct.variants[0].price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(heroProduct)}
                className="bg-brand-gold text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add
              </button>
              <button
                onClick={() => cart.setIsOpen(true)}
                className="bg-brand-green/80 border border-brand-gold/25 text-brand-goldLight px-3 py-2 rounded-xl text-xs font-bold min-h-[44px] flex items-center gap-1.5"
                aria-label={`View cart (${cart.totalItems} items)`}
              >
                {cart.totalItems > 0 && (
                  <span className="bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.totalItems}
                  </span>
                )}
                Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          PRODUCT DETAIL MODAL (PHASE 4)
          ══════════════════════════════════════ */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(product, variant, qty) => {
          handleAddToCart(product, variant, qty);
        }}
      />

      {/* ══════════════════════════════════════
          CHECKOUT MODAL (PHASE 6)
          ══════════════════════════════════════ */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        shippingFee={cart.shippingFee}
        totalPrice={cart.totalPrice}
        onOrderSuccess={() => {
          cart.clearCart();
        }}
      />

      {/* ══════════════════════════════════════
          TRUST & POLICIES MODAL (PHASE 7)
          ══════════════════════════════════════ */}
      <TrustPolicyModal
        isOpen={policyModalOpen}
        activeTab={activePolicyTab}
        onTabChange={setActivePolicyTab}
        onClose={() => setPolicyModalOpen(false)}
      />

      {/* ══════════════════════════════════════
          CART DRAWER (PHASE 5)
          ══════════════════════════════════════ */}
      <CartDrawer
        items={cart.items}
        isOpen={cart.isOpen}
        totalItems={cart.totalItems}
        subtotal={cart.subtotal}
        shippingFee={cart.shippingFee}
        totalPrice={cart.totalPrice}
        freeShippingProgress={cart.freeShippingProgress}
        amountNeededForFreeShipping={cart.amountNeededForFreeShipping}
        onClose={() => cart.setIsOpen(false)}
        onRemove={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* ══════════════════════════════════════
          HOW TO USE / RITUAL MODAL
          ══════════════════════════════════════ */}
      <AnimatePresence>
        {howToUseOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ritual-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
              onClick={() => setHowToUseOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-brand-gold/30 my-8 z-10"
            >
              <div className="p-6 md:p-8 border-b border-brand-gold/15 bg-white flex justify-between items-center relative z-10 shrink-0">
                <div className="text-center w-full">
                  <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.35em] mb-1 font-semibold">
                    The Sacred Kannauj Ritual
                  </p>
                  <h3 id="ritual-title" className="text-2xl md:text-4xl font-serif font-bold text-brand-dark tracking-wide">
                    HOW TO APPLY NATURAL ATTAR
                  </h3>
                </div>
                <button
                  onClick={() => setHowToUseOpen(false)}
                  className="absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 transition-colors text-brand-dark min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                  aria-label="Close ritual modal"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto bg-brand-cream/40 relative flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 h-full">
                  
                  {/* Steps */}
                  <div className="space-y-6 flex flex-col justify-center">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold shadow-sm">
                        <Droplet className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">1. TAKE A SINGLE DROP</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">
                          Pure attar is a concentrated botanical oil. A single microscopic drop from the applicator wand is all you need.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold shadow-sm">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">2. APPLY TO PULSE POINTS</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">
                          Touch gently behind your ears, on inner wrists, or along collarbones where natural blood flow warms the oil.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold shadow-sm">
                        <Heart className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">3. DAB, NEVER CRUSH</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">
                          Do not rub wrists together vigorously. Rubbing bruises the delicate botanical molecules. Let the scent evolve with your natural body temperature.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold shadow-sm">
                        <Shield className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">4. PROPER STORAGE</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">
                          Keep your crystal attar bottle away from direct sunlight in a cool, shaded environment. Natural attars mature and gain depth over time.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right visual card */}
                  <div className="bg-brand-dark rounded-2xl p-6 md:p-8 flex flex-col justify-center text-center relative overflow-hidden border border-brand-gold/25 shadow-xl">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-brand-gold text-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_25px_rgba(224,93,38,0.4)]">
                      <Leaf className="w-7 h-7 md:w-8 md:h-8" />
                    </div>

                    <h4 className="text-xl md:text-2xl font-serif font-bold text-brand-goldLight mb-2 leading-tight">
                      A DROP OF NATURE,<br />A TOUCH OF SOUL.
                    </h4>
                    <p className="text-xs text-brand-light/60 max-w-xs mx-auto mb-6">
                      Distilled using centuries-old hydro-distillation in copper vessels over wood fires in Kannauj.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="bg-white/5 p-3 rounded-xl border border-brand-gold/15 backdrop-blur-sm">
                        <h5 className="text-brand-gold text-xs font-bold mb-1 uppercase tracking-wider">Zero Alcohol</h5>
                        <p className="text-[10px] text-brand-light/70 leading-relaxed">Pure oil extracts. Never burns or dries skin.</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-brand-gold/15 backdrop-blur-sm">
                        <h5 className="text-brand-gold text-xs font-bold mb-1 uppercase tracking-wider">8–12h Wear</h5>
                        <p className="text-[10px] text-brand-light/70 leading-relaxed">Slow evaporative rate ensures all-day natural presence.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom padding on mobile for sticky bar */}
      {isMobile && <div className="h-[68px]" />}
    </div>
  );
}

export default App;
