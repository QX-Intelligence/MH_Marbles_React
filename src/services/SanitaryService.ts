import { api } from '@/lib/api';
import { SanitaryItem } from '@/data/tiles';

export const SanitaryService = {
  getAll: async (): Promise<SanitaryItem[]> => {
    const res = await api.get('/sanitary/');
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await api.post('/sanitary/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/sanitary/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
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
