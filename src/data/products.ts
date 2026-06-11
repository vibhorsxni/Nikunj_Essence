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
    description: 'Pure sandalwood oil aged to perfection. A deeply grounding, creamy, and meditative fragrance that forms the heart of our Kannauj heritage.',
    category: 'attar',
    liquidColor: '#E05D26',
    accentColor: '#FF8A50',
    variants: [
      { size: '12ml', price: 2500, unit: 'ml' },
      { size: '25ml', price: 5000, unit: 'ml' },
      { size: '100ml', price: 19500, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'grounding'],
    notes: { top: 'Soft Wood', heart: 'Creamy Sandalwood', base: 'Earthy Musk' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'rose-attar',
    name: 'Rose',
    tagline: 'Queen of Flowers',
    description: 'Distilled from thousands of pure Damask roses. An opulent, romantic, and intensely floral attar that captures the true essence of love.',
    category: 'attar',
    liquidColor: '#d63447',
    accentColor: '#e8637a',
    variants: [
      { size: '12ml', price: 2100, unit: 'ml' },
      { size: '25ml', price: 4200, unit: 'ml' },
      { size: '100ml', price: 16500, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'mood-elevating'],
    notes: { top: 'Fresh Petals', heart: 'Damask Rose', base: 'Honeyed Musk' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'mogra-attar',
    name: 'Mogra',
    tagline: 'Twilight Blossom',
    description: 'The intoxicating scent of Indian Jasmine Sambac. Sweet, heady, and deeply spiritual, harvested just as the sun sets over the Ganges.',
    category: 'attar',
    liquidColor: '#FF8A50',
    accentColor: '#E05D26',
    variants: [
      { size: '12ml', price: 1800, unit: 'ml' },
      { size: '25ml', price: 3600, unit: 'ml' },
      { size: '100ml', price: 14000, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'relaxing'],
    notes: { top: 'Green Leaves', heart: 'Mogra Blossom', base: 'Warm Amber' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'jasmine-attar',
    name: 'Jasmine',
    tagline: 'Star of the Night',
    description: 'A delicate yet powerfully seductive night-blooming jasmine attar. Pure, exotic, and wonderfully vibrant.',
    category: 'attar',
    liquidColor: '#FDF8EC',
    accentColor: '#FF8A50',
    variants: [
      { size: '12ml', price: 1900, unit: 'ml' },
      { size: '25ml', price: 3800, unit: 'ml' },
      { size: '100ml', price: 14800, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'sensual'],
    notes: { top: 'White Floral', heart: 'Jasmine Grandiflorum', base: 'Soft Musk' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'khus-attar',
    name: 'Khus',
    tagline: 'The Soul of Vetiver',
    description: 'An earthy, deep green vetiver attar distilled from the roots of wild Khus grass. Cooling, grounding, and profoundly calming.',
    category: 'attar',
    liquidColor: '#1b4d3e',
    accentColor: '#2d7a5f',
    variants: [
      { size: '12ml', price: 900, unit: 'ml' },
      { size: '25ml', price: 1800, unit: 'ml' },
      { size: '100ml', price: 7000, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'cooling'],
    notes: { top: 'Fresh Earth', heart: 'Vetiver Roots', base: 'Smoky Wood' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'lotus-attar',
    name: 'Lotus',
    tagline: 'Sacred Purity',
    description: 'A rare and ethereal extract from pink lotus petals. Delicate, aquatic, and meditative — embodying the pure spirit of nature.',
    category: 'attar',
    liquidColor: '#e091b0',
    accentColor: '#f0a8c4',
    variants: [
      { size: '12ml', price: 2100, unit: 'ml' },
      { size: '25ml', price: 4200, unit: 'ml' },
      { size: '100ml', price: 16500, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'spiritual'],
    notes: { top: 'Water Lily', heart: 'Pink Lotus', base: 'Soft Musk' },
    origin: 'Kannauj, UP',
  },

  // DHOOP CATEGORY
  {
    id: 'dhoop-cones',
    name: 'Dhoop Cones',
    tagline: 'Sacred Smoke',
    description: 'Hand-rolled pure dhoop cones. 100% natural ingredients, DEP free, Alcohol free, Charcoal free, No synthetic compounds, Dark Smoke free.',
    category: 'dhoop',
    liquidColor: '#5c3a21',
    accentColor: '#E05D26',
    variants: [{ size: '50pcs', price: 450, unit: 'box' }],
    benefits: ['Charcoal free', 'Dark Smoke free', '100% natural'],
    notes: { top: 'Resin', heart: 'Aromatic Herbs', base: 'Sandalwood' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'dhoop-sticks',
    name: 'Dhoop Sticks',
    tagline: 'Temple Fragrance',
    description: 'Thick, long-burning dhoop sticks crafted from temple flowers. 100% natural ingredients, DEP free, Alcohol free, Charcoal free, No synthetic compounds, Dark Smoke free.',
    category: 'dhoop',
    liquidColor: '#8a5a32',
    accentColor: '#E05D26',
    variants: [{ size: '50pcs', price: 550, unit: 'box' }],
    benefits: ['Charcoal free', 'Dark Smoke free', '100% natural'],
    notes: { top: 'Temple Flowers', heart: 'Resins', base: 'Woods' },
    origin: 'Kannauj, UP',
  },

  // FLORAL WATER CATEGORY
  {
    id: 'rose-water',
    name: 'Rose Water',
    tagline: 'Nature\'s Hydration',
    description: 'Distilled using the ancient Deg Bhapka method, capturing the purest essence of fresh roses. A refreshing and natural facial mist.',
    category: 'floral-water',
    liquidColor: '#f0c0c0',
    accentColor: '#f5d0d0',
    variants: [
      { size: '1000ml', price: 600, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '50ml', price: 50, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'hydrating'],
    notes: { top: 'Fresh Dew', heart: 'Rose Petals', base: 'Soft Floral' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'kewda-water',
    name: 'Kewda Water',
    tagline: 'Cooling Oasis',
    description: 'A traditional hydrosol made from fragrant screw pine flowers. Incredibly cooling for the skin and perfect for summer refreshment.',
    category: 'floral-water',
    liquidColor: '#FDF8EC',
    accentColor: '#FF8A50',
    variants: [
      { size: '1000ml', price: 600, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '50ml', price: 50, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'cooling'],
    notes: { top: 'Fresh Floral', heart: 'Kewda Blossom', base: 'Aquatic' },
    origin: 'Kannauj, UP',
  },
  {
    id: 'khus-water',
    name: 'Khus Water',
    tagline: 'Earthy Mist',
    description: 'Pure vetiver hydrosol carrying the scent of first rain on dry earth. Grounding and exceptional for calming skin inflammation.',
    category: 'floral-water',
    liquidColor: '#e8f0e8',
    accentColor: '#c8d8c8',
    variants: [
      { size: '1000ml', price: 600, unit: 'ml' },
      { size: '250ml', price: 200, unit: 'ml' },
      { size: '100ml', price: 70, unit: 'ml' },
      { size: '50ml', price: 50, unit: 'ml' }
    ],
    benefits: ['100% natural', 'alcohol-free', 'anti-inflammatory'],
    notes: { top: 'Rain', heart: 'Vetiver Root', base: 'Earth' },
    origin: 'Kannauj, UP',
  },
];

export const categories = [
  { id: 'attar', label: 'Attars', description: 'Pure botanical perfume oils, distilled traditionally in Kannauj.' },
  { id: 'dhoop', label: 'Dhoop Cones & Sticks', description: '100% natural ingredients, DEP free, Alcohol free, Charcoal free, No synthetic compounds, Dark Smoke free.' },
  { id: 'floral-water', label: 'Floral Waters', description: 'Hydrating natural hydrosols made from pure flowers and botanicals.' },
] as const;

export const comparisonData = [
  { feature: 'Composition', attar: '100% Natural — pure flowers, herbs & natural oils', perfume: 'Chemical Based — synthetic fragrance & chemicals' },
  { feature: 'Longevity', attar: 'Long Lasting — lasts for hours together', perfume: 'Fades Quickly — doesn\'t last too long' },
  { feature: 'Skin Safety', attar: 'Skin Friendly — alcohol free & safe for daily use', perfume: 'May Irritate Skin — contains alcohol & chemicals' },
  { feature: 'Authenticity', attar: 'Pure & Authentic — no chemicals, no synthetic fragrance', perfume: 'Artificial Fragrance — contains artificial colors & preservatives' },
  { feature: 'Wellness', attar: 'Therapeutic Benefits — natural aromas help relax & boost mood', perfume: 'No Therapeutic Value — only gives smell, no health benefits' },
];
