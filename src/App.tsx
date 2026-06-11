import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet, Leaf, Sparkles, Clock, ShoppingBag, Heart, Shield,
  ChevronRight, Check, MapPin, Phone, Mail, Menu, X, ChevronDown
} from 'lucide-react';

import { FloatingParticles } from './components/FloatingParticles';
import { CartDrawer } from './components/CartDrawer';
import { useCart } from './hooks/useCart';
import { useIsMobile } from './hooks/useIsMobile';
import { products, categories, comparisonData } from './data/products';
import type { Product } from './data/products';

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
   BENTO FEATURE DATA
   ═══════════════════════════════════════════ */
const bentoFeatures = [
  { icon: <Leaf className="w-6 h-6" />, title: '100% Natural', desc: 'Pure flowers, herbs & natural oils. Zero synthetic compounds.', wide: false },
  { icon: <Shield className="w-6 h-6" />, title: 'Skin Friendly', desc: 'Alcohol-free & safe for daily use on sensitive skin.', wide: false },
  { icon: <Clock className="w-6 h-6" />, title: 'Long Lasting', desc: 'A single application lasts 8–12 hours, evolving beautifully.', wide: true },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Pure & Authentic', desc: 'No chemicals, preservatives, or artificial colors.', wide: false },
  { icon: <Heart className="w-6 h-6" />, title: 'Therapeutic', desc: 'Natural aromas relax the mind and elevate mood.', wide: false },
  { icon: <Droplet className="w-6 h-6" />, title: 'Vegan & Cruelty-Free', desc: 'Non-alcoholic vegan perfumes. Never tested on animals.', wide: true },
];

/* ═══════════════════════════════════════════
   EMBLEM 3D
   ═══════════════════════════════════════════ */
function Emblem3D(props: any) {
  const texture = useTexture('/logo-3d-transparent.png');
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
   APP
   ═══════════════════════════════════════════ */
function App() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string>('attar');
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [popupCategory, setPopupCategory] = useState<string | null>(null);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const cart = useCart();

  const filteredProducts = products.filter(p => p.category === activeCategory);
  const heroProduct = products[0];

  const getVariantIndex = (productId: string) => selectedVariant[productId] ?? 0;

  const handleAddToCart = (product: Product) => {
    const vi = getVariantIndex(product.id);
    cart.addItem(product, product.variants[vi]);
  };

  /* ── 3D scene config — lighter on mobile ── */
  const particleCount = isMobile ? 15 : 40;

  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-gold selection:text-brand-dark">

      {/* ══════════════════════════════════════
          NAVIGATION — compact on mobile
          ══════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 lg:px-12 py-3 md:py-4 flex justify-between items-center bg-brand-light/90 backdrop-blur-xl border-b border-brand-gold/15">
        <a href="#" className="text-lg md:text-2xl font-serif font-bold text-brand-dark tracking-wider flex items-center min-h-[44px]">
          <span className="text-brand-gold">N</span>IKUNJ&nbsp;<span className="text-brand-gold">E</span>SSENCE
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.18em] font-medium text-brand-dark/70">
          {[
            { label: 'Collection', href: '#collection' },
            { label: 'Heritage', href: '#heritage' },
            { label: 'Catalogue', href: '#catalogue' },
            { label: 'Why Attar', href: '#compare' },
            { label: 'Contact', href: '#contact' },
          ].map(l => (
            <a key={l.label} href={l.href} className="hover:text-brand-gold transition-colors duration-300 min-h-[44px] flex items-center">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => cart.setIsOpen(true)}
            className="relative p-3 rounded-full hover:bg-brand-gold/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark" />
            {cart.totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-brand-gold text-brand-dark text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                {cart.totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-full hover:bg-brand-gold/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
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
            className="fixed top-[57px] left-0 w-full bg-brand-light/98 backdrop-blur-xl z-40 border-b border-brand-gold/15 px-6 py-4 space-y-1 lg:hidden"
          >
            {['Collection', 'Heritage', 'Catalogue', 'Why Attar', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-base font-serif text-brand-dark hover:text-brand-gold transition-colors border-b border-brand-gold/5 last:border-0 min-h-[44px] flex items-center"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          HERO — stacked on mobile, side-by-side desktop
          ══════════════════════════════════════ */}
      <section className="relative w-full min-h-[100svh] flex flex-col lg:flex-row items-center pt-[57px] overflow-hidden">
        {/* Ambient orbs — smaller on mobile */}
        <div className="absolute top-20 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-brand-green/8 rounded-full blur-[60px] pointer-events-none" />

        {/* 3D Canvas — on top for mobile, right side for desktop */}
        <div className="w-full lg:w-1/2 h-[280px] sm:h-[340px] lg:h-screen relative order-1 lg:order-2">
          <Canvas
            camera={{ position: [0, 0, isMobile ? 6 : 5.5], fov: isMobile ? 38 : 42 }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.4} />
            <spotLight position={[8, 8, 8]} angle={0.2} penumbra={1} intensity={1.5} castShadow={!isMobile} />
            {!isMobile && <spotLight position={[-5, 3, 5]} angle={0.3} penumbra={1} intensity={0.5} color="#F3E5AB" />}
            <Environment preset="city" />
            <FloatingParticles count={particleCount} color="#D4AF37" area={isMobile ? 4 : 5} />
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

          {/* Floating Learn to Use Button */}
          <button
            onClick={() => setHowToUseOpen(true)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2 px-3 md:px-4 py-2 border border-brand-gold/30 rounded-full text-brand-dark hover:bg-brand-gold/10 transition-colors text-[10px] md:text-xs uppercase tracking-widest font-bold bg-brand-light/50 backdrop-blur-md shadow-lg"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-brand-gold" />
            <span className="hidden sm:inline">Learn to Use</span>
            <span className="sm:hidden">How to Use</span>
          </button>
        </div>

        {/* Text content */}
        <div className="w-full lg:w-1/2 px-6 md:px-12 lg:pl-20 z-10 flex flex-col justify-center py-8 lg:py-0 lg:min-h-screen order-2 lg:order-1">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-brand-gold/80 text-[10px] md:text-xs uppercase tracking-[0.35em] mb-3 md:mb-6 font-medium">
              Fragrance & Wellness · Est. Kannauj
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-brand-dark leading-[0.95] mb-5 md:mb-8">
              Nature's<br />
              <span className="italic font-light">Purity</span> in<br />
              Every <span className="gold-shimmer">Drop</span>
            </h1>
            <p className="text-base md:text-lg text-brand-dark/60 mb-8 md:mb-10 max-w-lg leading-relaxed font-light">
              100% natural, alcohol-free Attars — therapeutic fragrances distilled by master perfumers in Kannauj.<br className="hidden md:block" />
              <span className="font-medium text-brand-gold mt-2 block">Our Strength, Your Assurance</span>
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#collection"
                className="group bg-brand-dark text-brand-goldLight px-6 py-4 hover:bg-brand-green transition-all duration-300 uppercase tracking-[0.12em] text-sm font-bold flex items-center justify-center gap-2 min-h-[52px]"
              >
                Explore Collection
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#heritage"
                className="text-brand-dark font-medium underline underline-offset-8 decoration-brand-gold/40 hover:decoration-brand-gold transition-colors duration-300 text-center py-3 min-h-[44px] flex items-center justify-center"
              >
                Our Story
              </a>
              <button
                onClick={() => setHowToUseOpen(true)}
                className="text-brand-dark font-medium underline underline-offset-8 decoration-brand-gold/40 hover:decoration-brand-gold transition-colors duration-300 text-center py-3 min-h-[44px] flex items-center justify-center"
              >
                Learn to Use
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint — mobile only */}
        {isMobile && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 order-3 z-10"
          >
            <ChevronDown className="w-5 h-5 text-brand-dark/30" />
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════
          HERITAGE — stat cards stack on mobile
          ══════════════════════════════════════ */}
      <section id="heritage" className="relative bg-brand-dark text-brand-light py-16 md:py-28 px-6 md:px-16 overflow-hidden grain-overlay">
        <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-brand-gold/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-16">
            <p className="ornament-divider text-brand-gold/60 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 md:mb-6">Our Heritage</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-goldLight mb-4 md:mb-6">
              Rooted in Kannauj
            </h2>
            <p className="text-brand-light/50 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-light">
              We procure 100% natural products for you from various trusted and verified manufaturers from kannauj(India's perfume capital). You shouldn't think for quality and purity of product. We are here to do it for you
            </p>
          </motion.div>

          {/* Stat cards — horizontal scroll on mobile */}
          <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-8 overflow-x-auto no-scrollbar scroll-snap-x pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
            {[
              { number: '500+', label: 'Years of Heritage', desc: 'Traditions dating back to the Mughal period' },
              { number: '100%', label: 'Natural Ingredients', desc: 'Pure flowers, herbs & oils' },
              { number: '12+', label: 'Hours of Fragrance', desc: 'Evolves beautifully throughout the day' },
            ].map((stat, idx) => (
              <motion.div key={idx} {...stagger(idx * 0.12)}
                className="glass-card rounded-2xl p-6 md:p-8 text-center hover:border-brand-gold/30 transition-colors duration-300 min-w-[240px] md:min-w-0 flex-shrink-0"
              >
                <p className="text-4xl md:text-5xl font-serif font-bold gold-shimmer mb-2">{stat.number}</p>
                <p className="text-brand-goldLight font-medium text-base md:text-lg mb-1">{stat.label}</p>
                <p className="text-brand-light/40 text-xs md:text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO FEATURES GRID
          ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-16 bg-brand-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-16">
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">The Difference</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-3">Why Choose Attar?</h2>
            <p className="text-brand-dark/50 max-w-md mx-auto text-sm md:text-base">Choose Attar for a natural, long-lasting & healthy lifestyle.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {bentoFeatures.map((f, idx) => (
              <motion.div key={idx} {...stagger(idx * 0.06)}
                className={`${f.wide ? 'sm:col-span-2' : 'col-span-1'} bento-card bg-white rounded-xl md:rounded-2xl p-5 md:p-7 border border-brand-gold/8`}
              >
                <div className="w-11 h-11 md:w-12 md:h-12 bg-brand-dark rounded-lg md:rounded-xl flex items-center justify-center text-brand-gold mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base md:text-lg font-serif font-bold text-brand-dark mb-1.5">{f.title}</h3>
                <p className="text-brand-dark/50 text-xs md:text-sm leading-relaxed">{f.desc}</p>
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
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">Our Offerings</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark">Explore Categories</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
            {/* 3D canvas — top on mobile */}
            <div className="w-full lg:w-1/2 h-[320px] sm:h-[400px] lg:h-[550px] bg-gradient-to-br from-brand-green/5 to-brand-gold/5 rounded-2xl lg:rounded-3xl overflow-hidden relative float-glow order-1 lg:order-2">
              <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_40px_rgba(10,28,18,0.06)]" />
              <Canvas
                camera={{ position: [0, 0, 5], fov: isMobile ? 35 : 38 }}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                performance={{ min: 0.5 }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                {!isMobile && <spotLight position={[-3, 4, 3]} intensity={0.6} color="#F3E5AB" />}
                <Environment preset="studio" />
                <FloatingParticles count={isMobile ? 10 : 25} color="#D4AF37" area={4} />
                <PresentationControls global rotation={[0, 0, 0]} polar={[-0.15, 0.15]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
                  <Suspense fallback={null}>
                    <Emblem3D position={[0, 0, 0]} size={isMobile ? 3.5 : 4.5} />
                  </Suspense>
                </PresentationControls>
              </Canvas>
              <div className="absolute bottom-4 w-full text-center text-[9px] md:text-[10px] text-brand-dark/30 uppercase tracking-[0.2em] pointer-events-none">
                {isMobile ? 'Touch & drag to rotate' : 'Drag to rotate'}
              </div>
            </div>

            {/* Category list */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className={`${isMobile ? 'flex gap-3 overflow-x-auto no-scrollbar scroll-snap-x pb-4 -mx-6 px-6' : 'space-y-4'}`}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setPopupCategory(cat.id)}
                    className={`${isMobile ? 'min-w-[280px] flex-shrink-0 rounded-xl' : 'rounded-xl'} p-6 cursor-pointer border border-brand-gold/20 bg-white/40 hover:bg-white hover:shadow-xl hover:shadow-brand-gold/10 hover:-translate-y-1 transition-all duration-300 group`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xl md:text-2xl font-serif text-brand-dark font-bold group-hover:text-brand-gold transition-colors">
                        {cat.label}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-brand-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-brand-dark/60 text-sm leading-relaxed">{cat.description}</p>
                    <div className="mt-4 text-xs font-bold text-brand-gold uppercase tracking-widest flex items-center gap-2">
                      View Products <span className="w-4 h-[1px] bg-brand-gold/50 block"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRODUCT CATALOGUE WITH VARIANTS
          ══════════════════════════════════════ */}
      <section id="catalogue" className="py-16 md:py-24 px-6 md:px-16 bg-brand-dark text-brand-light grain-overlay relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-8 md:mb-12">
            <p className="text-brand-gold/60 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">Product Catalogue</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-goldLight mb-4 md:mb-6">Shop Our Collection</h2>
          </motion.div>

          {/* Category pills — horizontal scroll on mobile */}
          <div className="flex gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto no-scrollbar scroll-snap-x justify-start md:justify-center pb-2 -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap min-h-[44px] flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'category-pill-active'
                    : 'bg-brand-green/30 text-brand-light/60 hover:bg-brand-green/50 border border-brand-gold/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product grid — 2 cols on mobile, up to 4 on XL */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const vIdx = getVariantIndex(product.id);
                const isExpanded = expandedProduct === product.id;
                return (
                  <motion.div key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-xl md:rounded-2xl overflow-hidden group"
                  >
                    {/* Color swatch header */}
                    <div className="h-24 md:h-32 relative overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${product.liquidColor}22, ${product.accentColor}33)` }}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg"
                        style={{ background: `radial-gradient(circle at 35% 35%, ${product.accentColor}, ${product.liquidColor})` }}
                      />
                    </div>

                    <div className="p-3.5 md:p-5">
                      <p className="text-brand-gold/50 text-[8px] md:text-[10px] uppercase tracking-[0.15em] mb-0.5">{product.tagline}</p>
                      <h3 className="text-sm md:text-lg font-serif font-bold text-brand-light mb-0.5 md:mb-1">{product.name}</h3>

                      {/* Description — collapsible on mobile */}
                      <p className={`text-brand-light/40 text-[10px] md:text-xs leading-relaxed mb-3 ${isMobile && !isExpanded ? 'line-clamp-1' : 'line-clamp-2'}`}>
                        {product.description}
                      </p>
                      {isMobile && (
                        <button
                          onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                          className="text-brand-gold/50 text-[10px] mb-2 min-h-[28px] flex items-center"
                        >
                          {isExpanded ? 'Show less' : 'More info'}
                        </button>
                      )}

                      {/* Variant selector */}
                      <div className="flex gap-1.5 md:gap-2 mb-3 flex-wrap">
                        {product.variants.map((v, vi) => (
                          <button key={v.size}
                            onClick={() => setSelectedVariant(prev => ({ ...prev, [product.id]: vi }))}
                            className={`px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-medium transition-all min-h-[32px] ${
                              vIdx === vi
                                ? 'bg-brand-gold text-brand-dark'
                                : 'bg-brand-green/30 text-brand-light/50 hover:bg-brand-green/50'
                            }`}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg md:text-2xl font-serif font-bold text-brand-goldLight">
                          ₹{product.variants[vIdx].price.toLocaleString('en-IN')}
                        </p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-brand-gold text-brand-dark px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-brand-goldLight transition-colors flex items-center gap-1 min-h-[44px]"
                        >
                          <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                          <span className="sm:hidden">+</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPARISON TABLE — scrollable on mobile
          ══════════════════════════════════════ */}
      <section id="compare" className="py-16 md:py-24 px-6 md:px-16 bg-brand-cream">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8 md:mb-14">
            <p className="text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">The Comparison</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-3">Attar vs. Perfume</h2>
            <p className="text-brand-dark/50 max-w-md mx-auto text-sm">See why natural Attar is the superior choice.</p>
          </motion.div>

          <motion.div {...fadeUp} className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl shadow-brand-dark/5 border border-brand-gold/10">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-3 bg-brand-dark text-brand-light">
              <div className="p-3 md:p-5 text-[10px] md:text-sm font-medium text-brand-light/50 uppercase tracking-wider flex items-center">Feature</div>
              <div className="p-3 md:p-5 text-center flex items-center justify-center">
                <span className="text-brand-gold font-serif font-bold text-sm md:text-lg">Attar</span>
              </div>
              <div className="p-3 md:p-5 text-center flex items-center justify-center">
                <span className="text-brand-light/50 font-serif text-sm md:text-lg">Perfume</span>
              </div>
            </div>
            {/* Rows */}
            {comparisonData.map((row, idx) => (
              <div key={idx} className="comparison-row grid grid-cols-[1fr_1fr_1fr] md:grid-cols-3 border-b border-brand-gold/5 last:border-0">
                <div className="p-3 md:p-5 font-medium text-brand-dark text-xs md:text-sm flex items-center">{row.feature}</div>
                <div className="p-3 md:p-5 text-[10px] md:text-sm text-brand-dark/70 flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>{row.attar}</span>
                </div>
                <div className="p-3 md:p-5 text-[10px] md:text-sm text-brand-dark/35">
                  {row.perfume}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer id="contact" className="bg-brand-dark py-14 md:py-20 px-6 md:px-16 border-t border-brand-gold/10 grain-overlay relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
            {/* Brand */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-light tracking-wider mb-3">
                <span className="text-brand-gold">N</span>IKUNJ <span className="text-brand-gold">E</span>SSENCE
              </h3>
              <p className="text-brand-light/40 text-xs md:text-sm leading-relaxed mb-4">
                Manufacturers and exporters of the finest natural Attars, Floral Waters, and aromatic raw materials from Kannauj.
              </p>
              <div className="flex flex-wrap gap-2">
                {['alcohol-free', 'natural', 'long-lasting', 'skin-friendly'].map(tag => (
                  <span key={tag} className="text-[9px] md:text-[10px] uppercase tracking-wider text-brand-gold/50 bg-brand-gold/5 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-brand-goldLight font-serif font-bold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
              <div className="space-y-2">
                {['Our Collection', 'Heritage', 'Product Catalogue', 'Why Attar', 'Contact Us'].map(link => (
                  <a key={link} href="#" className="block text-brand-light/40 text-xs md:text-sm hover:text-brand-gold transition-colors min-h-[36px] flex items-center">{link}</a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-brand-goldLight font-serif font-bold mb-3 md:mb-4 text-sm md:text-base">Get In Touch</h4>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex items-start gap-3 text-brand-light/40">
                  <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>Radha town, Vrindavan<br />pincode, 281121</span>
                </div>
                <a href="tel:+919416160167" className="flex items-center gap-3 text-brand-light/40 hover:text-brand-gold transition-colors min-h-[44px]">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>+91 94161 60167</span>
                </a>
                <a href="mailto:nikunjessense84@gmail.com" className="flex items-center gap-3 text-brand-light/40 hover:text-brand-gold transition-colors min-h-[44px]">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>nikunjessense84@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-gold/10 pt-6 text-center">
            <p className="text-brand-light/25 text-[10px] md:text-xs tracking-wider">
              © 2026 Nikunj Essence — Fragrance & Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MOBILE STICKY BOTTOM BAR
          ══════════════════════════════════════ */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-brand-dark/95 backdrop-blur-xl border-t border-brand-gold/20 z-50 mobile-sticky-bar">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${heroProduct.accentColor}, ${heroProduct.liquidColor})` }} />
              <div>
                <p className="text-brand-light text-xs font-medium">{heroProduct.name}</p>
                <p className="text-brand-gold text-[10px]">from ₹{heroProduct.variants[0].price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(heroProduct)}
                className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
              {cart.totalItems > 0 && (
                <button
                  onClick={() => cart.setIsOpen(true)}
                  className="bg-brand-green text-brand-goldLight px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] flex items-center gap-1"
                >
                  <span className="bg-brand-gold text-brand-dark text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.totalItems}</span>
                  Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          CATEGORY POPUP MODAL
          ══════════════════════════════════════ */}
      <AnimatePresence>
        {popupCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
              onClick={() => setPopupCategory(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-3xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-brand-gold/20"
            >
              <div className="p-6 md:p-8 border-b border-brand-gold/10 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">
                      {categories.find(c => c.id === popupCategory)?.label}
                    </h3>
                    <p className="text-sm text-brand-dark/50 mt-1">Explore our exclusive collection</p>
                  </div>
                  <button 
                    onClick={() => setPopupCategory(null)}
                    className="p-2 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 transition-colors text-brand-dark min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {popupCategory === 'attar' && (
                  <div className="mt-5 p-4 bg-brand-cream rounded-xl border border-brand-gold/20">
                    <h4 className="font-serif font-bold text-brand-dark mb-2 text-sm uppercase tracking-wider">Our Strengths</h4>
                    <ul className="text-xs md:text-sm text-brand-dark/70 space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" /> <span>100% Natural products.</span></li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" /> <span>Alcohol free, Pthalates free, Parabens free, DOP/DPG Free, Free from any types of Synthetic compounds</span></li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 overflow-y-auto space-y-4 bg-brand-cream/30">
                {products.filter(p => p.category === popupCategory).map(product => (
                  <div key={product.id} className="bg-white p-5 rounded-xl border border-brand-gold/10 flex flex-col md:flex-row gap-4 justify-between md:items-center hover:border-brand-gold/30 transition-colors shadow-sm">
                    <div>
                      <h4 className="text-xl font-serif font-bold text-brand-dark">{product.name}</h4>
                      <p className="text-brand-gold/80 text-[10px] uppercase tracking-widest mt-0.5 mb-2">{product.tagline}</p>
                      <p className="text-sm text-brand-dark/60 leading-relaxed max-w-md">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3 text-[10px] text-brand-dark/40">
                        <span className="bg-brand-dark/5 px-2 py-0.5 rounded">Top: {product.notes.top}</span>
                        <span className="bg-brand-dark/5 px-2 py-0.5 rounded">Heart: {product.notes.heart}</span>
                        <span className="bg-brand-dark/5 px-2 py-0.5 rounded">Base: {product.notes.base}</span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-brand-gold/10 w-full md:w-auto flex-shrink-0">
                      {product.variants.length > 1 && (
                        <div className="flex gap-1.5 flex-wrap justify-end mb-2">
                          {product.variants.map((v, vi) => (
                            <button key={v.size}
                              onClick={() => setSelectedVariant(prev => ({ ...prev, [product.id]: vi }))}
                              className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium transition-all min-h-[32px] ${
                                getVariantIndex(product.id) === vi
                                  ? 'bg-brand-gold text-brand-dark'
                                  : 'bg-brand-dark/5 text-brand-dark/50 hover:bg-brand-dark/10'
                              }`}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-brand-dark font-bold whitespace-nowrap">
                          ₹{product.variants[getVariantIndex(product.id)].price.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-brand-dark text-brand-goldLight px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-green transition-colors flex items-center gap-1.5 min-h-[44px]"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          HOW TO USE MODAL
          ══════════════════════════════════════ */}
      <AnimatePresence>
        {howToUseOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
              onClick={() => setHowToUseOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-4xl bg-brand-light rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-brand-gold/20"
            >
              <div className="p-6 md:p-8 border-b border-brand-gold/10 bg-white flex justify-between items-center relative z-10 shrink-0">
                <div className="text-center w-full">
                  <p className="text-brand-gold/80 text-[10px] md:text-xs uppercase tracking-[0.35em] mb-2 font-medium">
                    Fragrance & Wellness
                  </p>
                  <h3 className="text-2xl md:text-4xl font-serif font-bold text-brand-dark tracking-wider">
                    HOW TO USE ATTAR
                  </h3>
                </div>
                <button 
                  onClick={() => setHowToUseOpen(false)}
                  className="absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 transition-colors text-brand-dark min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto bg-brand-cream/30 relative flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 h-full">
                  
                  {/* Steps */}
                  <div className="space-y-6 md:space-y-8 flex flex-col justify-center">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold">
                        <Droplet className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">1. TAKE A SMALL DROP</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">Take a small drop of Attar on your fingertip.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">2. APPLY GENTLY</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">Apply behind ears, on wrists, or neck (gently dab, do not rub).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold">
                        <Heart className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">3. LET IT SETTLE</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">Don't rub - let it sit naturally and blend with your body warmth.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-gold flex items-center justify-center shrink-0 bg-brand-dark text-brand-gold">
                        <Shield className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark mb-1 text-sm md:text-base">4. STORE IT WELL</h4>
                        <p className="text-xs md:text-sm text-brand-dark/70 leading-relaxed">Keep the bottle in a cool, dry place away from direct sunlight.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side styling / visual */}
                  <div className="bg-brand-dark rounded-2xl p-6 md:p-8 flex flex-col justify-center text-center relative overflow-hidden border border-brand-gold/20 shadow-inner">
                    <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay"></div>
                    
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mb-4 md:mb-6 z-10 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                      <Leaf className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-brand-goldLight mb-2 z-10 leading-tight">
                      A DROP OF NATURE,<br />A TOUCH OF SOUL.
                    </h4>
                    
                    <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 md:gap-6 text-left z-10">
                      <div className="bg-white/5 p-3 rounded-lg border border-brand-gold/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <h5 className="text-brand-gold text-[10px] md:text-xs font-bold mb-1 uppercase tracking-wider">Pure & Natural</h5>
                        <p className="text-[9px] md:text-[10px] text-brand-light/70 leading-snug">Crafted from nature's finest ingredients.</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-brand-gold/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <h5 className="text-brand-gold text-[10px] md:text-xs font-bold mb-1 uppercase tracking-wider">Long Lasting</h5>
                        <p className="text-[9px] md:text-[10px] text-brand-light/70 leading-snug">Timeless fragrance that stays with you.</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-brand-gold/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <h5 className="text-brand-gold text-[10px] md:text-xs font-bold mb-1 uppercase tracking-wider">Alcohol Free</h5>
                        <p className="text-[9px] md:text-[10px] text-brand-light/70 leading-snug">Pure Attar. No alcohol. Only natural goodness.</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-brand-gold/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <h5 className="text-brand-gold text-[10px] md:text-xs font-bold mb-1 uppercase tracking-wider">Made With Care</h5>
                        <p className="text-[9px] md:text-[10px] text-brand-light/70 leading-snug">Thoughtfully crafted with love & tradition.</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          CART DRAWER
          ══════════════════════════════════════ */}
      <CartDrawer
        items={cart.items}
        isOpen={cart.isOpen}
        totalItems={cart.totalItems}
        totalPrice={cart.totalPrice}
        onClose={() => cart.setIsOpen(false)}
        onRemove={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
      />

      {/* Bottom padding on mobile for sticky bar */}
      {isMobile && <div className="h-[68px]" />}
    </div>
  );
}

export default App;
