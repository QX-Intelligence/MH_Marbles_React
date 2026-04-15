import { api } from '@/lib/api';
import { Brand } from '@/types/gallery';

export const CompanyService = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get('/companies/');
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await api.post('/companies/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/companies/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  delete: async (id: string | number) => {
    await api.delete(`/companies/${id}/`);
  }
};

export default CompanyService;
