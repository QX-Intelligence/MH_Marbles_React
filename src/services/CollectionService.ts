import { api } from '@/lib/api';
import { Collection } from '@/types/gallery';

export const CollectionService = {
  getAll: async (): Promise<Collection[]> => {
    const res = await api.get('/collections/');
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await api.post('/collections/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/collections/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  delete: async (id: string | number) => {
    await api.delete(`/collections/${id}/`);
  }
};

export default CollectionService;
