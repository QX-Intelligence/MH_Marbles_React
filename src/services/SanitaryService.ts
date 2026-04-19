import { api } from '@/lib/api';
import { SanitaryItem } from '@/data/tiles';

/**
 * Backend returns image_urls[] (array). Resolve first entry as image_url.
 */
const resolveItem = (item: SanitaryItem): SanitaryItem => ({
  ...item,
  image_url: item.image_urls?.[0] ?? item.image_url,
  image: item.image_urls?.[0] ?? item.image,
});

/**
 * Backend expects image_1…image_5 for uploads.
 * If 'images' (plural) field contains multiple files, map them.
 */
const remapImageField = (data: FormData): FormData => {
  // Check for multiple files first
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

export const SanitaryService = {
  getAll: async (): Promise<SanitaryItem[]> => {
    const res = await api.get('/sanitary/');
    return res.data.map(resolveItem);
  },
  create: async (data: FormData) => {
    const res = await api.post('/sanitary/', remapImageField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveItem(res.data);
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/sanitary/${id}/`, remapImageField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveItem(res.data);
  },
  delete: async (id: string | number) => {
    await api.delete(`/sanitary/${id}/`);
  },
  getCategories: async () => {
    const res = await api.get('/sanitary/categories/');
    return res.data;
  }
};

export default SanitaryService;

