export interface Tile {
  id: string | number;
  name: string;
  category?: 'marble' | 'granite' | 'vitrified' | 'wooden' | string | number;
  brand: string; // Mapped from company name (resolved client-side)
  size: string;  
  fill?: string; // fallback color for rendering
  finish: string;
  finishes?: string[]; // Options
  thickness?: string;
  description?: string;
  origin?: string;
  color: string;
  usage?: string[];
  price?: string;
  sku?: string;
  textureColor?: string; 
  roughness?: number;
  metalness?: number;
  image?: string;       // Static/local image fallback
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  // Convenience: first URL from image_urls, resolved in mapping layer
  image_url?: string;
  image_key?: string;   // S3 storage key (write-only, for reference)
  image_keys?: string[]; // All S3 keys (backend stores up to 5)
  is_featured?: boolean; // Backend supports up to 6 featured products
  company?: number;      // Raw FK ID from backend
  category_name?: string; // Resolved client-side from category ID
  space?: string; 
  created_at?: string;
}

export interface SanitaryItem {
  id: string | number;
  name: string;
  description: string;
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  // Convenience alias: first URL from image_urls, resolved in mapping layer
  image_url?: string;
  image?: string;       // fallback / local
  price?: string;
  image_key?: string;
  image_keys?: string[];
  category?: number | null;
  company?: number | null;  // FK to companies.Company
  created_at?: string;
}

export const initialTiles: Tile[] = [
  // Marble Collection
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold',
    category: 'marble',
    finish: 'Polished',
    color: 'White',
    usage: ['Living Room', 'Bedroom'],
    price: '₹450/sq.ft',
    textureColor: '#f5f3ef',
    roughness: 0.1,
    metalness: 0.1,
    brand: 'Italian Heritage',
    size: '1200x2400 mm',
    image: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=2000',
    space: 'Living Room',
    fill: '#f5f3ef',
    finishes: ['Polished', 'Honed'],
    thickness: '20',
    description: 'A masterpiece from the Apuan Alps, featuring crisp white backgrounds with dramatic gold and grey veining.',
    origin: 'Carrara, Italy'
  },
  {
    id: 'statuario-white',
    name: 'Statuario White',
    category: 'marble',
    finish: 'Polished',
    color: 'White',
    usage: ['Living Room', 'Commercial'],
    price: '₹520/sq.ft',
    textureColor: '#fafafa',
    roughness: 0.05,
    metalness: 0.15,
    brand: 'Carrara Elite',
    size: '1200x2400 mm',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7b69a9a?auto=format&fit=crop&q=80&w=2000',
    space: 'Commercial',
    fill: '#fafafa',
    finishes: ['Polished'],
    thickness: '18',
    description: 'The epitome of classic luxury, known for its bright white background and bold, striking grey veins.',
    origin: 'Carrara, Italy'
  },
  {
    id: 'emperador-dark',
    name: 'Emperador Dark',
    category: 'marble',
    finish: 'Honed',
    color: 'Brown',
    usage: ['Living Room', 'Commercial'],
    price: '₹380/sq.ft',
    textureColor: '#4a3728',
    roughness: 0.3,
    metalness: 0.05,
    brand: 'Levantina',
    size: '800x1600 mm',
    image: 'https://images.unsplash.com/photo-1590212151175-e58edd96d8f5?auto=format&fit=crop&q=80&w=2000',
    space: 'Living Room',
    fill: '#4a3728',
    finishes: ['Honed', 'Polished'],
    thickness: '20',
    description: 'Rich chocolate browns interspersed with brilliant beige and white veins, offering a warm, opulent atmosphere.',
    origin: 'Spain'
  },
  {
    id: 'nero-marquina',
    name: 'Nero Marquina',
    category: 'marble',
    finish: 'Polished',
    color: 'Black',
    usage: ['Living Room', 'Commercial'],
    price: '₹490/sq.ft',
    textureColor: '#1a1a1a',
    roughness: 0.1,
    metalness: 0.2,
    brand: 'Marquina Premium',
    size: '800x1600 mm',
    image: 'https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&q=80&w=2000',
    space: 'Bathroom',
    fill: '#1a1a1a',
    finishes: ['Polished', 'Leather'],
    thickness: '18',
    description: 'A striking deep black stone adorned with contrasting stark white fossilized veining for dramatic impact.',
    origin: 'Basque Country, Spain'
  },
  // Granite Collection
  {
    id: 'black-galaxy',
    name: 'Black Galaxy',
    category: 'granite',
    finish: 'Polished',
    color: 'Black',
    usage: ['Kitchen', 'Commercial'],
    price: '₹320/sq.ft',
    textureColor: '#0d0d0d',
    roughness: 0.15,
    metalness: 0.3,
    brand: 'Galaxy Stone',
    size: '600x1200 mm',
    image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80&w=2000',
    space: 'Kitchen',
    fill: '#0d0d0d',
    finishes: ['Polished', 'Flamed'],
    thickness: '20',
    description: 'A deep black granite naturally speckled with brilliant copper and bronze flakes that catch the light.',
    origin: 'Andhra Pradesh, India'
  },
  {
    id: 'tan-brown',
    name: 'Tan Brown',
    category: 'granite',
    finish: 'Polished',
    color: 'Brown',
    usage: ['Living Room', 'Kitchen'],
    price: '₹280/sq.ft',
    textureColor: '#8b6914',
    roughness: 0.2,
    metalness: 0.1,
    brand: 'Indian Earth',
    size: '600x600 mm',
    fill: '#8b6914',
    finishes: ['Polished', 'Leather'],
    thickness: '18',
    description: 'A dark brown granite highlighted with robust, darker black and grey mineral deposits.',
    origin: 'Telangana, India'
  },
  {
    id: 'kashmir-white',
    name: 'Kashmir White',
    category: 'granite',
    finish: 'Polished',
    color: 'White',
    usage: ['Kitchen', 'Bedroom'],
    price: '₹340/sq.ft',
    textureColor: '#e8e4de',
    roughness: 0.15,
    metalness: 0.1,
    brand: 'Kashmir Silks',
    size: '600x600 mm',
    fill: '#e8e4de',
    finishes: ['Polished'],
    thickness: '20',
    description: 'A beautiful light grey granite with subtle brown and blackberry garnets sprinkled throughout.',
    origin: 'Tamil Nadu, India'
  },
  // Vitrified Tiles
  {
    id: 'arctic-white',
    name: 'Arctic White',
    category: 'vitrified',
    finish: 'Glossy',
    color: 'White',
    usage: ['Living Room', 'Bedroom'],
    price: '₹95/sq.ft',
    textureColor: '#ffffff',
    roughness: 0.05,
    metalness: 0.4,
    brand: 'Arctic Series',
    size: '600x1200 mm',
    image: 'https://images.unsplash.com/photo-1516633630673-67bbad747022?auto=format&fit=crop&q=80&w=2000',
    fill: '#ffffff',
    finishes: ['Glossy', 'Matte'],
    thickness: '10',
    description: 'Pure, unblemished white vitrified surface engineered for maximum light reflection and modern minimalism.',
    origin: 'Engineered'
  },
  {
    id: 'midnight-grey',
    name: 'Midnight Grey',
    category: 'vitrified',
    finish: 'Matte',
    color: 'Grey',
    usage: ['Living Room', 'Commercial'],
    price: '₹110/sq.ft',
    textureColor: '#4a4a4a',
    roughness: 0.4,
    metalness: 0.05,
    brand: 'Nightshade',
    size: '600x600 mm',
    image: 'https://images.unsplash.com/photo-1604543519999-738cb20dce94?auto=format&fit=crop&q=80&w=2000',
    fill: '#4a4a4a',
    finishes: ['Matte', 'Rustic'],
    thickness: '10',
    description: 'A deep, charcoal grey tile with a sophisticated matte finish, perfect for grounding large open spaces.',
    origin: 'Engineered'
  },
  {
    id: 'beige-elegance',
    name: 'Beige Elegance',
    category: 'vitrified',
    finish: 'Satin',
    color: 'Beige',
    usage: ['Bedroom', 'Living Room'],
    price: '₹105/sq.ft',
    textureColor: '#d4c4a8',
    roughness: 0.25,
    metalness: 0.1,
    brand: 'Beige Luxe',
    size: '800x800 mm',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000',
    fill: '#d4c4a8',
    finishes: ['Satin', 'Glossy'],
    thickness: '12',
    description: 'Warm, inviting beige tones with a subtle satin sheen that brings effortless elegance to any room.',
    origin: 'Engineered'
  },
  // Wooden Finish
  {
    id: 'oak-natural',
    name: 'Oak Natural',
    category: 'wooden',
    finish: 'Matte',
    color: 'Brown',
    usage: ['Bedroom', 'Living Room'],
    price: '₹180/sq.ft',
    textureColor: '#c4a77d',
    roughness: 0.5,
    metalness: 0.0,
    brand: 'Natural Wood',
    size: '200x1200 mm',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=2000',
    fill: '#c4a77d',
    finishes: ['Matte', 'Textured'],
    thickness: '15',
    description: 'Authentic oak wood texture with intricate grain patterns, offering the warmth of wood with the durability of tile.',
    origin: 'Engineered'
  },
  {
    id: 'walnut-dark',
    name: 'Walnut Dark',
    category: 'wooden',
    finish: 'Matte',
    color: 'Brown',
    usage: ['Bedroom', 'Living Room'],
    price: '₹195/sq.ft',
    textureColor: '#5c4033',
    roughness: 0.5,
    metalness: 0.0,
    brand: 'Deep Walnut',
    size: '200x1200 mm',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=2000',
    fill: '#5c4033',
    finishes: ['Matte', 'Hand-scraped'],
    thickness: '15',
    description: 'Rich, dark walnut tones that emulate classic hardwood floors, providing a stately and luxurious foundation.',
    origin: 'Engineered'
  },
];

export const categories = [
  { id: 'marble', name: 'Marble', icon: '💎' },
  { id: 'granite', name: 'Granite', icon: '🪨' },
  { id: 'vitrified', name: 'Vitrified Tiles', icon: '✨' },
  { id: 'wooden', name: 'Wooden Finish', icon: '🌳' },
] as const;

export const colors = ['White', 'Black', 'Brown', 'Grey', 'Beige'] as const;
export const usages = ['Living Room', 'Bedroom', 'Kitchen', 'Commercial'] as const;