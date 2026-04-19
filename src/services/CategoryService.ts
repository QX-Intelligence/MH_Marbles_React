import { api } from '@/lib/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  image_keys?: string[];
  // Convenience: first url (resolved in mapping layer)
  image_url?: string;
}

/**
 * Backend expects image_1…image_5, not "image"
 */
const remapImageField = (data: FormData): FormData => {
  const file = data.get('image') as File | null;
  if (file) {
    data.delete('image');
    data.append('image_1', file);
  }
  return data;
};

const resolveCategory = (c: Category): Category => ({
  ...c,
  image_url: c.image_urls?.[0] ?? c.image_url,
});

export const CategoryService = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories/');
    return response.data.map(resolveCategory);
  },
  
  addCategory: async (data: FormData) => {
    const response = await api.post<Category>('/categories/', remapImageField(data));
    return resolveCategory(response.data);
  },
  
  updateCategory: async (id: number | string, data: FormData) => {
    const response = await api.patch<Category>(`/categories/${id}/`, remapImageField(data));
    return resolveCategory(response.data);
  },
  
  deleteCategory: async (id: number | string) => {
    await api.delete(`/categories/${id}/`);
  }
};

export default CategoryService;

