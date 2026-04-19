import { api } from '@/lib/api';
import { Tile } from '@/data/tiles';

export interface ProductResponse {
  next: string | null;
  previous: string | null;
  results: Tile[];
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=2000', // Marble 1
  'https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&q=80&w=2000', // Marble Dark
  'https://images.unsplash.com/photo-1516633630673-67bbad747022?auto=format&fit=crop&q=80&w=2000', // Vitrified Light
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=2000', // Wood Texture
  'https://images.unsplash.com/photo-1620626011761-9963d7b69a9a?auto=format&fit=crop&q=80&w=2000', // White Onyx
  'https://images.unsplash.com/photo-1604543519999-738cb20dce94?auto=format&fit=crop&q=80&w=2000'  // Dark Stone
];

const resolveProduct = (p: Tile): Tile => {
  const images = p.image_urls && p.image_urls.length > 0 ? p.image_urls : [p.image_url || p.image || ''];
  let finalImage = images[0];
  
  if (!finalImage && !p.image) {
    // Deterministic fallback so it consistently shows distinct images per product ID
    const idNum = typeof p.id === 'number' ? p.id : parseInt(String(p.id).replace(/\D/g, '') || '0', 10);
    finalImage = FALLBACK_IMAGES[idNum % FALLBACK_IMAGES.length];
  }

  return {
    ...p,
    image_url: finalImage,
    image: finalImage, // Populate fallback natively for components expecting it
  };
};

/**
 * Backend expects image_1…image_5 for uploads.
 * If 'images' field contains multiple files, map them.
 */
const remapImageField = (data: FormData): FormData => {
  const files = data.getAll('images') as File[];
  if (files && files.length > 0) {
    data.delete('images');
    files.slice(0, 5).forEach((file, i) => {
      data.append(`image_${i + 1}`, file);
    });
    return data;
  }

  // Fallback for single 'image' field
  const file = data.get('image') as File | null;
  if (file) {
    data.delete('image');
    data.append('image_1', file);
  }
  return data;
};

export const ProductService = {
  getProducts: async (params?: Record<string, string | number>): Promise<ProductResponse> => {
    console.log("[API] Fetching products from Django backend...");
    const res = await api.get('/products/', { params });
    return {
      ...res.data,
      results: (res.data.results || []).map(resolveProduct),
    };
  },
  
  saveProduct: async (data: FormData) => {
    console.log("[API] Persisting product to Django...");
    const productId = data.get('id');
    remapImageField(data);
    
    if (productId && !productId.toString().startsWith('temp-')) {
      const res = await api.patch(`/products/${productId}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return resolveProduct(res.data);
    } else {
      const res = await api.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return resolveProduct(res.data);
    }
  },

  deleteProduct: async (id: string | number) => {
    await api.delete(`/products/${id}/`);
  },

  getFeatured: async (): Promise<Tile[]> => {
    const res = await api.get('/products/featured/');
    return (res.data || []).map(resolveProduct);
  },
};

export default ProductService;

