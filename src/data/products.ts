export interface ProductVariant {
  size: string;
  price: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'attar' | 'floral-water' | 'raw-material' | 'dhoop';
  liquidColor: string;
  accentColor: string;
  imageUrl?: string;
  variants: ProductVariant[];
  benefits: string[];
  notes: { top: string; heart: string; base: string };
  origin: string;
}

export const products: Product[] = [
  // ATTAR CATEGORY
  {
    id: 'sandal-attar',
    name: 'Sandal',
    tagline: 'Liquid Gold of Mysore',
    description: 'A royal, velvety, and extended-wear fragrance. Pure sandalwood oil aged to perfection. A deeply grounding and meditative scent that forms the heart of our Kannauj heritage.',
    category: 'attar',
    liquidColor: '#E05D26',
    accentColor: '#FF8A50',
    imageUrl: 'sandal-attar.jpg',
    variants: [
      { size: '3ml', price: 510, unit: 'ml' },
      { size: '6ml', price: 980, unit: 'ml' },
      { size: '10ml', price: 1600, unit: 'ml' }
    ],
    benefits: ['Pure botanicals', 'Zero alcohol', 'Grounding', 'Gentle on skin'],
    notes: { top: 'Soft Wood', heart: 'Creamy Sandalwood', base: 'Earthy Musk' },
    origin: 'Kannauj & Mysore',
  },
  {
    id: 'rose-attar',
    name: 'Rose Attar',
    tagline: 'Queen of Flowers (Ruh Gulab)',
    description: 'Royal and classic, a true symbol of love and peace. Distilled from thousands of pure Damask roses. An opulent, romantic, and intensely floral attar.',
    category: 'attar',
    liquidColor: '#d63447',
    accentColor: '#e8637a',
    imageUrl: 'rose-attar.jpg',
    variants: [
      { size: '3ml', price: 510, unit: 'ml' },
      { size: '6ml', price: 980, unit: 'ml' },
      { size: '10ml', price: 1600, unit: 'ml' }
    ],
    benefits: ['Pure Damask extract', 'Zero alcohol', 'Mood-elevating', 'Gentle on skin'],
    notes: { top: 'Fresh Petals', heart: 'Damask Rose', base: 'Honeyed Musk' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'mogra-attar',
    name: 'Mogra',
    tagline: 'Twilight Blossom (Jasminum sambac)',
    description: 'An intoxicating and sweet fragrance that acts as a natural mood booster. The heady scent of Indian Jasmine Sambac, harvested just as the sun sets over the Ganges.',
    category: 'attar',
    liquidColor: '#FF8A50',
    accentColor: '#E05D26',
    imageUrl: 'mogra-attar.jpg',
    variants: [
      { size: '12ml', price: 1800, unit: 'ml' },
      { size: '25ml', price: 3600, unit: 'ml' },
      { size: '100ml', price: 14000, unit: 'ml' }
    ],
    benefits: ['Pure Sambac extract', 'Zero alcohol', 'Relaxing', 'Gentle on skin'],
    notes: { top: 'Green Leaves', heart: 'Mogra Blossom', base: 'Warm Amber' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'jasmine-attar',
    name: 'Jasmine',
    tagline: 'Star of the Night',
    description: 'An intoxicating and sweet fragrance that acts as a natural mood booster. A delicate yet powerfully seductive night-blooming jasmine attar.',
    category: 'attar',
    liquidColor: '#FDF8EC',
    accentColor: '#FF8A50',
    imageUrl: 'jasmine-attar.jpg',
    variants: [
      { size: '3ml', price: 510, unit: 'ml' },
      { size: '6ml', price: 980, unit: 'ml' },
      { size: '10ml', price: 1600, unit: 'ml' }
    ],
    benefits: ['Night bloom essence', 'Zero alcohol', 'Sensual', 'Gentle on skin'],
    notes: { top: 'White Floral', heart: 'Jasmine Grandiflorum', base: 'Soft Musk' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'khus-attar',
    name: 'Rooh Khus',
    tagline: 'The Soul of Wild Vetiver',
    description: 'An earthy, deep green vetiver attar distilled from the roots of wild Khus grass. Cooling, grounding, and profoundly calming in traditional copper stills.',
    category: 'attar',
    liquidColor: '#1b4d3e',
    accentColor: '#2d7a5f',
    imageUrl: 'ruh-khus-bottle.jpeg',
    variants: [
      { size: '3ml', price: 450, unit: 'ml' },
      { size: '6ml', price: 900, unit: 'ml' },
      { size: '10ml', price: 1500, unit: 'ml' }
    ],
    benefits: ['Wild vetiver roots', 'Zero alcohol', 'Cooling & Grounding', 'Gentle on skin'],
    notes: { top: 'Fresh Earth', heart: 'Vetiver Roots', base: 'Smoky Wood' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'lotus-attar',
    name: 'Lotus',
    tagline: 'Sacred Purity (Pink Lotus)',
    description: 'Spiritual, calm, and divine. A rare and ethereal extract from pink lotus petals. Delicate, aquatic, and meditative.',
    category: 'attar',
    liquidColor: '#e091b0',
    accentColor: '#f0a8c4',
    imageUrl: 'lotus-attar.jpg',
    variants: [
      { size: '3ml', price: 510, unit: 'ml' },
      { size: '6ml', price: 980, unit: 'ml' },
      { size: '10ml', price: 1600, unit: 'ml' }
    ],
    benefits: ['Pink lotus petals', 'Zero alcohol', 'Spiritual', 'Gentle on skin'],
    notes: { top: 'Water Lily', heart: 'Pink Lotus', base: 'Soft Musk' },
    origin: 'Kannauj, UP',
  },

  // FLORAL WATER CATEGORY
  {
    id: 'rose-water',
    name: 'Rose Water',
    tagline: "Nature's Hydration (Damask Hydro-distillation)",
    description: 'Distilled using the ancient Deg Bhapka method, capturing the purest essence of fresh roses. A refreshing and soothing facial mist.',
    category: 'floral-water',
    liquidColor: '#f0c0c0',
    accentColor: '#f5d0d0',
    imageUrl: 'rose-water.jpg',
    variants: [
      { size: '50ml', price: 50, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '1000ml', price: 600, unit: 'ml' }
    ],
    benefits: ['Hydro-distilled', 'Zero alcohol', 'Deeply hydrating', 'Gentle on skin'],
    notes: { top: 'Fresh Dew', heart: 'Rose Petals', base: 'Soft Floral' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'kewda-water',
    name: 'Kewda Water',
    tagline: 'Cooling Oasis (Pandanus Hydrosol)',
    description: 'A traditional hydrosol made from fragrant screw pine flowers. Incredibly cooling for the skin and perfect for summer refreshment.',
    category: 'floral-water',
    liquidColor: '#FDF8EC',
    accentColor: '#FF8A50',
    imageUrl: 'kewda-water.jpg',
    variants: [
      { size: '50ml', price: 50, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '1000ml', price: 600, unit: 'ml' }
    ],
    benefits: ['Screw pine extract', 'Zero alcohol', 'Cooling mist', 'Gentle on skin'],
    notes: { top: 'Fresh Floral', heart: 'Kewda Blossom', base: 'Aquatic' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'khus-water',
    name: 'Khus Water',
    tagline: 'Earthy Mist (Vetiver Hydrosol)',
    description: 'Pure vetiver hydrosol carrying the scent of first rain on dry earth. Grounding and exceptional for calming skin inflammation.',
    category: 'floral-water',
    liquidColor: '#e8f0e8',
    accentColor: '#c8d8c8',
    imageUrl: 'khus-water.jpg',
    variants: [
      { size: '50ml', price: 50, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '1000ml', price: 600, unit: 'ml' }
    ],
    benefits: ['Wild vetiver hydrosol', 'Zero alcohol', 'Calming mist', 'Gentle on skin'],
    notes: { top: 'Rain', heart: 'Vetiver Root', base: 'Earth' },
    origin: 'Kannauj, UP',
  },

  // DHOOP CATEGORY
  {
    id: 'dhoop-cones',
    name: 'Dhoop Cones',
    tagline: 'Sacred Smoke (Charcoal Free)',
    description: 'Hand-rolled botanical dhoop cones. Pure herbal ingredients, DEP free, Alcohol free, Charcoal free, Dark Smoke free.',
    category: 'dhoop',
    liquidColor: '#5c3a21',
    accentColor: '#E05D26',
    imageUrl: 'dhoop-cones.jpg',
    variants: [{ size: '50pcs', price: 450, unit: 'box' }],
    benefits: ['Charcoal free', 'Dark Smoke free', 'Pure herbs', 'DEP free'],
    notes: { top: 'Resin', heart: 'Aromatic Herbs', base: 'Sandalwood' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'dhoop-sticks',
    name: 'Dhoop Sticks',
    tagline: 'Temple Fragrance (Pure Botanicals)',
    description: 'Thick, long-burning dhoop sticks crafted from temple flowers. Pure herbal ingredients, DEP free, Alcohol free, Charcoal free, Dark Smoke free.',
    category: 'dhoop',
    liquidColor: '#8a5a32',
    accentColor: '#E05D26',
    imageUrl: 'dhoop-sticks.jpg',
    variants: [{ size: '50pcs', price: 550, unit: 'box' }],
    benefits: ['Charcoal free', 'Dark Smoke free', 'Temple flowers', 'DEP free'],
    notes: { top: 'Temple Flowers', heart: 'Resins', base: 'Woods' },
    origin: 'Kannauj, UP',
  },

  // RAW MATERIAL CATEGORY
  {
    id: 'agarwood-chips',
    name: 'Agarwood Chips',
    tagline: 'Sacred Oud Wood (Wild Assam)',
    description: 'Rare, resin-rich wild agarwood pieces harvested for slow traditional fumigation (Bakhoor). Releases an ancient, mystical woody aroma when gently heated.',
    category: 'raw-material',
    liquidColor: '#5c3a21',
    accentColor: '#8a5a32',
    imageUrl: 'agarwood-chips.jpg',
    variants: [
      { size: '25g', price: 1800, unit: 'g' },
      { size: '50g', price: 3400, unit: 'g' },
      { size: '100g', price: 6500, unit: 'g' }
    ],
    benefits: ['Wild Assam harvest', 'Resin-rich wood', 'Meditative aroma'],
    notes: { top: 'Resinous Bark', heart: 'Smoky Oud', base: 'Balsamic Amber' },
    origin: 'Assam & Kannauj',
  },
  {
    id: 'sandalwood-powder',
    name: 'Sandalwood Powder',
    tagline: 'Pure Mysore Heartwood',
    description: 'Finely micro-milled heartwood powder from genuine Santalum album trees. Ideal for traditional paste preparation, spiritual rituals, and skin calming.',
    category: 'raw-material',
    liquidColor: '#E05D26',
    accentColor: '#FF8A50',
    imageUrl: 'sandalwood-powder.jpg',
    variants: [
      { size: '50g', price: 850, unit: 'g' },
      { size: '100g', price: 1600, unit: 'g' }
    ],
    benefits: ['Mysore heartwood', 'Gentle on skin', 'Cooling & Grounding'],
    notes: { top: 'Fresh Wood', heart: 'Creamy Sandalwood', base: 'Earthy' },
    origin: 'Mysore & Kannauj',
  },
];

export const categories = [
  { id: 'all', label: 'All Products', description: 'Explore our complete heritage collection of botanical attars, waters, and aromatics.' },
  { id: 'attar', label: 'Attars', description: 'Pure botanical perfume oils, distilled traditionally in copper stills in Kannauj.' },
  { id: 'floral-water', label: 'Floral Waters', description: 'Hydrating natural hydrosols made from pure flowers and botanicals.' },
  { id: 'dhoop', label: 'Dhoop Cones & Sticks', description: 'Pure botanical ingredients, DEP free, Alcohol free, Charcoal free, Dark Smoke free.' },
  { id: 'raw-material', label: 'Raw Aromatics', description: 'Precious wild agarwood chips and genuine Mysore sandalwood heartwood powder.' },
] as const;

export const comparisonData = [
  { feature: 'Composition', attar: 'Pure Botanical — natural flowers, herbs & botanical oils', perfume: 'Chemical Based — synthetic fragrance & chemicals' },
  { feature: 'Longevity', attar: 'Extended Wear — lasts 8–12 hours together', perfume: 'Fades Quickly — evaporates in 2–3 hours' },
  { feature: 'Skin Safety', attar: 'Safe & Gentle — alcohol free & non-irritating for daily use', perfume: 'May Irritate Skin — contains alcohol & chemicals' },
  { feature: 'Authenticity', attar: 'Pure & Authentic — no chemicals, no synthetic fragrance', perfume: 'Artificial Fragrance — contains artificial colors & preservatives' },
  { feature: 'Wellness', attar: 'Therapeutic Benefits — natural aromas help relax & boost mood', perfume: 'No Therapeutic Value — only gives smell, no health benefits' },
];
