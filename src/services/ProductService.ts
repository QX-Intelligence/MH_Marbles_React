import { api } from '@/lib/api';
import { Tile } from '@/data/tiles';

export interface ProductResponse {
  next: string | null;
  previous: string | null;
  results: Tile[];
}

export const ProductService = {
  getProducts: async (params?: Record<string, string | number>): Promise<ProductResponse> => {
    console.log("[API] Fetching products from Django backend...");
    const res = await api.get('/products/', { params });
    
    // Map Django response if necessary, but assuming Tile matches Django result for now
    return res.data;
  },
  
  saveProduct: async (data: FormData) => {
    console.log("[API] Persisting product to Django...");
    const productId = data.get('id');
    
    if (productId && !productId.toString().startsWith('temp-')) {
      const res = await api.patch(`/products/${productId}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } else {
      const res = await api.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }
  },

  deleteProduct: async (id: string | number) => {
    await api.delete(`/products/${id}/`);
  },


};

export default ProductService;
