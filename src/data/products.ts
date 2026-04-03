export interface Product {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  category: Category;
  images: string[];
  youtubeUrl?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  featured: boolean;
  onSale: boolean;
  salePrice?: number;
}

export type Category = 'clothing' | 'shoes' | 'belts' | 'bags' | 't-shirts';

export const categories: { id: Category; label: string; labelRo: string; image: string }[] = [
  { id: 'clothing', label: 'Clothing', labelRo: 'Îmbrăcăminte', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
  { id: 'shoes', label: 'Shoes', labelRo: 'Încălțăminte', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 'belts', label: 'Belts', labelRo: 'Curele', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
  { id: 'bags', label: 'Bags & Handbags', labelRo: 'Genți', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { id: 't-shirts', label: 'T-Shirts', labelRo: 'Tricouri', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
];

export const products: Product[] = [
  {
    id: 'atlas-explorer-jacket',
    name: 'Explorer Jacket',
    description: 'Lightweight, water-resistant jacket designed for movement. Built for city streets and mountain trails alike.',
    priceUSD: 189,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#0a0a0a' }, { name: 'Olive', hex: '#556B2F' }],
    featured: true,
    onSale: false,
  },
  {
    id: 'atlas-nomad-sneakers',
    name: 'Nomad Sneakers',
    description: 'Premium leather sneakers with cushioned sole. Your companion for every timezone.',
    priceUSD: 145,
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'White', hex: '#f5f0eb' }, { name: 'Sand', hex: '#C2B280' }],
    featured: true,
    onSale: false,
  },
  {
    id: 'atlas-meridian-belt',
    name: 'Meridian Belt',
    description: 'Full-grain leather belt with brushed gold buckle. Minimalist design, maximum impact.',
    priceUSD: 65,
    category: 'belts',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Brown', hex: '#5C4033' }, { name: 'Black', hex: '#0a0a0a' }],
    featured: false,
    onSale: true,
    salePrice: 49,
  },
  {
    id: 'atlas-voyager-bag',
    name: 'Voyager Duffle',
    description: 'Canvas and leather weekender bag. Spacious enough for a 3-day escape.',
    priceUSD: 220,
    category: 'bags',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Dark Brown', hex: '#3E2723' }],
    featured: true,
    onSale: false,
  },
  {
    id: 'atlas-summit-tee',
    name: 'Summit T-Shirt',
    description: 'Heavyweight organic cotton tee with embroidered ATLAS CO. logo. Relaxed fit.',
    priceUSD: 55,
    category: 't-shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Off White', hex: '#f5f0eb' }, { name: 'Black', hex: '#0a0a0a' }, { name: 'Sand', hex: '#C2B280' }],
    featured: true,
    onSale: false,
  },
  {
    id: 'atlas-drift-hoodie',
    name: 'Drift Hoodie',
    description: 'Premium French terry hoodie. Oversized silhouette with kangaroo pocket.',
    priceUSD: 120,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Cream', hex: '#FFFDD0' }],
    featured: false,
    onSale: true,
    salePrice: 89,
  },
  {
    id: 'atlas-horizon-crossbody',
    name: 'Horizon Crossbody',
    description: 'Compact crossbody bag in smooth leather. Adjustable strap, zip closure.',
    priceUSD: 95,
    category: 'bags',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Black', hex: '#0a0a0a' }, { name: 'Cognac', hex: '#9A7B4F' }],
    featured: false,
    onSale: false,
  },
  {
    id: 'atlas-terrain-boots',
    name: 'Terrain Boots',
    description: 'Rugged suede boots with Vibram sole. Built for everywhere.',
    priceUSD: 195,
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Desert', hex: '#EDC9AF' }, { name: 'Dark Brown', hex: '#3E2723' }],
    featured: true,
    onSale: false,
  },
];
