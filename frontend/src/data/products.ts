import type { Product, Coupon } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'vera-001',
    name: 'Oversized Cotton Shirt',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 1499,
    originalPrice: 2299,
    rating: 4.8,
    reviewsCount: 142,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sand Beige', hex: '#D7C4B7' },
      { name: 'Midnight Black', hex: '#111111' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Effortless tailoring meets extreme comfort. Crafted from 100% long-staple organic cotton, this relaxed silhouette features dropped shoulders, a softly curved hemline, and shell buttons.',
    material: '100% Organic Egyptian Cotton (180 GSM)',
    fit: 'Oversized / Relaxed Silhouette',
    features: [
      'Pre-washed fabric for zero shrinkage',
      'Natural Mother-of-Pearl buttons',
      'Breathable all-season weave',
      'Back box pleat for mobility'
    ],
    careInstructions: 'Machine wash cold with like colors. Tumble dry low or line dry in shade. Warm iron if needed.',
    inStock: true
  },
  {
    id: 'vera-002',
    name: 'Relaxed Fit Cargo Pants',
    category: 'Men\'s Fashion',
    gender: 'men',
    price: 1899,
    originalPrice: 2699,
    rating: 4.7,
    reviewsCount: 98,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Olive Drab', hex: '#556B2F' },
      { name: 'Stone Khaki', hex: '#C2B280' },
      { name: 'Slate Black', hex: '#222222' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Utility refined. Made from heavy-duty stretch cotton twill, designed with ergonomic knee darts, functional gusseted pockets, and an elasticated drawcord hem.',
    material: '98% Cotton, 2% Elastane Heavy Twill',
    fit: 'Relaxed Tapered Fit',
    features: [
      '6 multi-functional utility pockets',
      'Adjustable ankle cuffs with hidden toggles',
      'Reinforced double-stitching along stress seams'
    ],
    careInstructions: 'Machine wash inside out at 30°C. Do not bleach. Iron on medium heat.',
    inStock: true
  },
  {
    id: 'vera-003',
    name: 'Premium Linen Shirt',
    category: 'Men\'s Fashion',
    gender: 'men',
    price: 2199,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 176,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Off-White', hex: '#F5F5DC' },
      { name: 'Terracotta', hex: '#E2725B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'The ultimate warm-weather essential. Woven from 100% French flax linen, providing unmatched breathability, a refined slub texture, and timeless Mediterranean styling.',
    material: '100% European Flax Linen',
    fit: 'Classic Tailored Cut',
    features: [
      'Naturally thermoregulating & hypoallergenic',
      'Softens with every wash',
      'Spread collar with removable stays'
    ],
    careInstructions: 'Hand wash or delicate machine cycle. Hang to dry naturally for signature linen texture.',
    inStock: true
  },
  {
    id: 'vera-004',
    name: 'Classic Oversized T-Shirt',
    category: 'Men\'s Fashion',
    gender: 'unisex',
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviewsCount: 310,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Oatmeal Heather', hex: '#E3DAC9' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavyweight streetwear essential. Crafted with 240 GSM combed cotton that holds its structure wash after wash without sagging.',
    material: '100% Combed Heavyweight Cotton (240 GSM)',
    fit: 'Drop-Shoulder Streetwear Oversized',
    features: [
      'Thick 1.25" ribbed crewneck collar',
      'Double-needle hem and sleeve finish',
      'Tagless interior label'
    ],
    careInstructions: 'Wash cold inside out. Tumble dry on low.',
    inStock: true
  },
  {
    id: 'vera-005',
    name: 'Straight Fit High-Waist Denim',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 1999,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 164,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582142839970-2b93284439bb?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Vintage Indigo', hex: '#2C4A6F' },
      { name: 'Washed Black', hex: '#333333' },
      { name: 'Ecrú Raw', hex: '#F0EAD6' }
    ],
    sizes: ['26', '28', '30', '32', '34'],
    description: 'Inspired by 90s vintage archives. Designed with a flattering high rise, straight leg fall, and authentic non-stretch rigid cotton denim.',
    material: '100% Sustainable Cotton Denim (13 oz)',
    fit: 'High-Rise Straight Leg',
    features: [
      'Classic 5-pocket construction',
      'Branded antique brass button fly',
      'Genuine leather rear VÉRA patch'
    ],
    careInstructions: 'Wash sparingly inside out with cold water. Avoid tumble drying to preserve raw indigo shade.',
    inStock: true
  },
  {
    id: 'vera-006',
    name: 'Essential Heavyweight Hoodie',
    category: 'Men\'s Fashion',
    gender: 'unisex',
    price: 1699,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 215,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Cream Ivory', hex: '#FFFFF0' },
      { name: 'Forest Green', hex: '#014421' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Ultra-luxurious warmth. Features a double-walled hood, plush fleece interior, custom metal lace tips, and a seamless kangaroo pocket.',
    material: '400 GSM French Terry Cotton-Fleece Blend',
    fit: 'Boxy Oversized Fit',
    features: [
      'Double-lined structural hood',
      'Deep kangaroo pocket',
      'Heavy ribbed cuffs & waistband'
    ],
    careInstructions: 'Machine wash cool. Dry flat.',
    inStock: true
  },
  {
    id: 'vera-007',
    name: 'Ribbed Seamless Crop Top',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 999,
    originalPrice: 1499,
    rating: 4.7,
    reviewsCount: 88,
    isNew: true,
    isTrending: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Muted Rose', hex: '#DDA0DD' },
      { name: 'Off White', hex: '#FAF9F6' },
      { name: 'Expresso Brown', hex: '#3B2F2F' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Sleek everyday layering piece. Seamless 3D ribbed knit construction contours gently to the body with maximum stretch and soft recovery.',
    material: '92% Nylon Microfiber, 8% Spandex',
    fit: 'Fitted Cropped Silhouette',
    features: [
      'Chafeless 3D ribbed texture',
      'Square neck front and low back design',
      'Double layered non-sheer chest fabric'
    ],
    careInstructions: 'Delicate wash bag recommended. Lay flat to dry.',
    inStock: true
  },
  {
    id: 'vera-008',
    name: 'Minimal Co-ord Linen Set',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 120,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Sand Taupe', hex: '#B38B6D' },
      { name: 'Ecrú Linen', hex: '#F0EAD6' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Effortless luxury co-ord matching set comprising a boxy short-sleeve top and high-waist drawstring wide-leg pants. Made for vacation ease or elevated casual days.',
    material: '70% French Linen, 30% Viscose',
    fit: 'Fluid Wide-Leg & Boxy Top',
    features: [
      'Elastic waist with linen drawstrings',
      'Side slash pockets on trousers',
      'Breathable drape that resists excessive creasing'
    ],
    careInstructions: 'Cold hand wash or gentle machine cycle. Cool iron while damp.',
    inStock: true
  },
  {
    id: 'vera-009',
    name: 'Oversized Tailored Wool Blazer',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 3899,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 74,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Pinstripe Black', hex: '#1C1C1C' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Power dressing reimagined. Designed with structured shoulder padding, double-breasted button closure, and a silky cupro lining for smooth layering.',
    material: '60% Merino Wool, 40% Viscose Tailored Weave',
    fit: 'Structured Oversized Silhouette',
    features: [
      'Padded sharp shoulders',
      'Horn-look dual buttons',
      'Interior welt chest pocket'
    ],
    careInstructions: 'Dry clean only.',
    inStock: true
  },
  {
    id: 'vera-010',
    name: 'Satin Silk Slip Midi Dress',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 2899,
    originalPrice: 3799,
    rating: 4.8,
    reviewsCount: 112,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#F7E7CE' },
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Noir Black', hex: '#0F0F0F' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Glamorous fluidity. Cut on the bias to drape gracefully over curves, featuring adjustable spaghetti straps and a subtle cowl neckline.',
    material: '100% Mulberry Silk Satin Touch Blend',
    fit: 'Bias-Cut Body Skimming',
    features: [
      'Delicate adjustable shoulder straps',
      'Soft cowl front neckline',
      'Side leg split'
    ],
    careInstructions: 'Hand wash gently cold with silk detergent or dry clean.',
    inStock: true
  },
  {
    id: 'vera-011',
    name: 'Chunky Leather Platform Sneakers',
    category: 'Footwear',
    gender: 'unisex',
    price: 3299,
    originalPrice: 4499,
    rating: 4.7,
    reviewsCount: 135,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Monochrome White', hex: '#FAFAFA' },
      { name: 'Off-White / Beige', hex: '#EAE6DF' }
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    description: 'Sculpted chunky sole sneaker crafted from premium full-grain Italian leather panels with memory foam insoles for all-day urban comfort.',
    material: 'Full-Grain Leather Upper & Light EVA Outsole',
    fit: 'True to size',
    features: [
      '1.75 inch elevated platform height',
      'Memory foam cushioned footbed',
      'Breathable micro-perforated toe box'
    ],
    careInstructions: 'Wipe clean with soft damp cloth and use leather conditioner periodically.',
    inStock: true
  },
  {
    id: 'vera-012',
    name: 'Handcrafted Suede Chelsea Boots',
    category: 'Footwear',
    gender: 'men',
    price: 4199,
    originalPrice: 5999,
    rating: 4.9,
    reviewsCount: 68,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Tobacco Suede', hex: '#704214' },
      { name: 'Charcoal Black', hex: '#262626' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    description: 'Artisanal ankle boots featuring water-repellent oiled suede leather, elastic side gores, pull tabs, and durable Blake-stitched rubber soles.',
    material: 'Italian Calfskin Suede & Goodyear welted sole',
    fit: 'Sleek European Last',
    features: [
      'Elasticated side gussets for easy slip-on',
      'Water and stain resistant treatment',
      'Cushioned leather lining'
    ],
    careInstructions: 'Brush with suede brush. Apply suede protector spray before first wear.',
    inStock: true
  },
  {
    id: 'vera-013',
    name: 'Minimalist Leather Tote Bag',
    category: 'Accessories',
    gender: 'women',
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 94,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Cognac Brown', hex: '#9A463D' },
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Cream Latte', hex: '#EEDC9A' }
    ],
    sizes: ['One Size'],
    description: 'Roomy architecture designed for modern daily essentials. Holds up to a 15-inch laptop, includes a detachable zip pouch and magnetic clasp closure.',
    material: 'Grainy Pebbled Vegan Leather',
    fit: 'Dimensions: 38cm x 30cm x 14cm',
    features: [
      'Internal 15" padded laptop sleeve',
      'Removable zippered coin & key pouch',
      'Reinforced shoulder straps with 10" drop'
    ],
    careInstructions: 'Wipe gently with leather cleaning cloth.',
    inStock: true
  },
  {
    id: 'vera-014',
    name: 'Classic Polarized Acetate Sunglasses',
    category: 'Accessories',
    gender: 'unisex',
    price: 1299,
    originalPrice: 1899,
    rating: 4.7,
    reviewsCount: 156,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Tortoise Shell', hex: '#8B4513' },
      { name: 'Polished Black', hex: '#000000' }
    ],
    sizes: ['Medium Frame'],
    description: 'Timeless square frame silhouette crafted from handcrafted Italian cellulose acetate. Fitted with TAC polarized UV400 anti-glare lenses.',
    material: 'Hand-cut Bio-Acetate & German 5-barrel hinges',
    fit: 'Unisex Medium Universal Fit',
    features: [
      '100% UV400 Protection (Cat 3 polarized)',
      'Scratch-resistant lens coating',
      'Includes hard leather folding case & microfiber cloth'
    ],
    careInstructions: 'Clean lenses with included microfiber cloth only.',
    inStock: true
  },
  {
    id: 'vera-015',
    name: 'Structured Cotton Chore Jacket',
    category: 'Men\'s Fashion',
    gender: 'men',
    price: 2799,
    originalPrice: 3699,
    rating: 4.8,
    reviewsCount: 82,
    isNew: true,
    isTrending: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Navy Blue', hex: '#000080' },
      { name: 'Tobacco Brown', hex: '#795548' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'French workwear heritage reimagined. Heavy 320 GSM cotton canvas jacket featuring 3 outer patch pockets and tortoiseshell buttons.',
    material: '100% Cotton Heavyweight Canvas',
    fit: 'Boxy Utility Fit',
    features: [
      '3 exterior utility patch pockets + internal card pocket',
      'Reinforced elbow patches',
      'Point collar with chin strap'
    ],
    careInstructions: 'Machine wash 30°C. Line dry.',
    inStock: true
  },
  {
    id: 'vera-016',
    name: 'Minimalist Leather Loafers',
    category: 'Footwear',
    gender: 'men',
    price: 3699,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 54,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Deep Espresso', hex: '#3B2F2F' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    description: 'Sleek penny loafers crafted from smooth burnished calfskin leather. Soft memory leather footbed for effortless sockless wear.',
    material: '100% Calfskin Leather',
    fit: 'European Standard Width',
    features: [
      'Hand-stitched apron toe',
      'Flexible rubberized leather lug sole',
      'Breathable calf leather lining'
    ],
    careInstructions: 'Apply matching shoe cream and polish regularly.',
    inStock: true
  },
  {
    id: 'vera-017',
    name: 'Premium Automatic Leather Watch',
    category: 'Accessories',
    gender: 'unisex',
    price: 5499,
    originalPrice: 7999,
    rating: 4.9,
    reviewsCount: 42,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Rose Gold / Tan', hex: '#B76E79' },
      { name: 'Silver / Black', hex: '#C0C0C0' }
    ],
    sizes: ['40mm Dial'],
    description: 'Precision horology. Powered by a 21-jewel automatic mechanical movement visible through an open heart dial exhibition caseback.',
    material: '316L Surgical Stainless Steel & Genuine Italian Horween Leather Strap',
    fit: '40mm Case Diameter / 20mm Lug Width',
    features: [
      'Self-winding automatic movement (42 hour power reserve)',
      'Sapphire crystal glass (scratch-resistant)',
      '5 ATM / 50 meter water resistance'
    ],
    careInstructions: 'Keep away from strong magnetic fields. Service every 3 years.',
    inStock: true
  },
  {
    id: 'vera-018',
    name: 'Tailored Wool Trench Coat',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 4899,
    originalPrice: 6499,
    rating: 4.9,
    reviewsCount: 78,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Classic Beige', hex: '#F5F5DC' },
      { name: 'Midnight Navy', hex: '#000022' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Iconic double-breasted trench coat with removable waist belt, gun flap detail, storms shield, and deep side welt pockets.',
    material: '80% Water-Resistant Cotton Gabardine, 20% Wool',
    fit: 'Relaxed Full-Length Cut',
    features: [
      'Buckled belt & cuff straps',
      'Rain shield back cape',
      'Branded horn buttons'
    ],
    careInstructions: 'Professional dry clean only.',
    inStock: true
  },
  {
    id: 'vera-019',
    name: 'Tapered Slim Chino Trousers',
    category: 'Men\'s Fashion',
    gender: 'men',
    price: 1999,
    originalPrice: 2799,
    rating: 4.7,
    reviewsCount: 110,
    isNew: false,
    isTrending: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Sand Beige', hex: '#E5D3B3' },
      { name: 'Navy Blue', hex: '#1B263B' },
      { name: 'Charcoal', hex: '#2F4F4F' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Smart casual perfecting. Stretch cotton twill cut slim through thigh and tapered at the calf for a clean, sharp look.',
    material: '97% Cotton, 3% Elastane Satin Finish Twill',
    fit: 'Slim Tapered Fit',
    features: [
      'Non-slip waistband tape',
      'Rear welt pockets with button closure',
      'YKK auto-lock zipper fly'
    ],
    careInstructions: 'Machine wash 40°C. Warm iron.',
    inStock: true
  },
  {
    id: 'vera-020',
    name: 'Gold Hoop Earrings Trio',
    category: 'Accessories',
    gender: 'women',
    price: 799,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 230,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: '18k Gold Vermeil', hex: '#FFD700' }
    ],
    sizes: ['Set of 3 (12mm, 16mm, 20mm)'],
    description: 'Set of 3 minimalist chunky huggie hoops in small, medium, and large diameters. Hypoallergenic titanium post backs for sensitive ears.',
    material: '18k Gold Plated Recycled Brass & Titanium Posts',
    fit: 'Lightweight everyday wear',
    features: [
      'Water resistant anti-tarnish coating',
      'Lead-free, nickel-free, hypoallergenic',
      'Secure click-latch closure'
    ],
    careInstructions: 'Avoid contact with perfumes, hairsprays, and saltwater.',
    inStock: true
  },
  {
    id: 'vera-021',
    name: 'Vintage Wash Denim Trucker Jacket',
    category: 'Men\'s Fashion',
    gender: 'men',
    price: 2699,
    originalPrice: 3499,
    rating: 4.8,
    reviewsCount: 95,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Stone Wash Blue', hex: '#4682B4' },
      { name: 'Washed Black', hex: '#2B2B2B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Classic American trucker jacket silhouette with authentic hand-fading, shank metal buttons, and twin button-flap chest pockets.',
    material: '100% Rigid Heavy Cotton Denim (14 oz)',
    fit: 'Regular Fit',
    features: [
      'Adjustable side waist tabs',
      'Twin welt side hand pockets',
      'Hand-distressed vintage finish'
    ],
    careInstructions: 'Machine wash cold with like colors inside out.',
    inStock: true
  },
  {
    id: 'vera-022',
    name: 'Modern Strappy Heel Sandals',
    category: 'Footwear',
    gender: 'women',
    price: 2999,
    originalPrice: 3999,
    rating: 4.6,
    reviewsCount: 48,
    isNew: true,
    isTrending: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Nude Beige', hex: '#D2B48C' },
      { name: 'Sleek Black', hex: '#050505' }
    ],
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    description: 'Architectural block heel sandals with micro tubular leather straps that frame the foot elegantly.',
    material: 'Soft Nappa Leather Upper & Cushioned Insole',
    fit: '2.5 inch Block Heel',
    features: [
      'Cushioned high-density foam footbed',
      'Adjustable ankle strap buckle',
      'Non-slip rubber heel cap'
    ],
    careInstructions: 'Store in dust bag. Clean with soft leather conditioner.',
    inStock: true
  },
  {
    id: 'vera-023',
    name: 'Pleated A-Line Midi Skirt',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 1799,
    originalPrice: 2399,
    rating: 4.7,
    reviewsCount: 62,
    isNew: false,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Olive Green', hex: '#3B5323' },
      { name: 'Champagne Taupe', hex: '#D7C4B7' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Precision sunray pleats that movement gracefully with every step. High-waisted with a comfortable hidden elastic waistband.',
    material: '100% Recycled Chiffon Satin',
    fit: 'High-Waist Swing A-Line',
    features: [
      'Permanent heat-set sharp pleats',
      'Full breathable satin lining',
      'Concealed side zip closure'
    ],
    careInstructions: 'Hand wash or dry clean to maintain knife pleats.',
    inStock: true
  },
  {
    id: 'vera-024',
    name: 'Textured Knit Cardigan',
    category: 'Women\'s Fashion',
    gender: 'women',
    price: 2299,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 91,
    isNew: true,
    isTrending: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Cream Oat', hex: '#FDFBF7' },
      { name: 'Warm Mocha', hex: '#4A3B32' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cozy cable knit cardigan with vintage tortoiseshell buttons, a slight cropped hem, and ribbed edges.',
    material: '60% Organic Cotton, 40% Merino Wool Knit',
    fit: 'Relaxed Cropped Length',
    features: [
      'Chunky 7-gauge cable knit pattern',
      'Natural horn-look front buttons',
      'Ribbed cuffs and waistband'
    ],
    careInstructions: 'Hand wash cold with wool wash detergent. Dry flat on towel.',
    inStock: true
  }
];

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'VERA10',
    discountPercent: 10,
    description: '10% OFF on all orders'
  },
  {
    code: 'VERA20',
    discountPercent: 20,
    minOrderAmount: 2000,
    description: '20% OFF on orders above ₹2,000'
  },
  {
    code: 'FIRSTLOOK',
    flatDiscount: 300,
    minOrderAmount: 999,
    description: '₹300 FLAT OFF for new customers'
  }
];
