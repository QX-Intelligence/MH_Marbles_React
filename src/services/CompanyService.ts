import { api } from '@/lib/api';
import { Brand } from '@/types/gallery';

/**
 * Backend returns logo_urls[] (array of presigned S3 URLs).
 * We resolve the first entry as the `logo` convenience field.
 */
const resolveBrand = (b: Brand): Brand => ({
  ...b,
  logo: b.logo_urls?.[0] ?? b.logo,
});

/**
 * Backend expects logo_1…logo_5 (not "logo") for uploads.
 * This helper remaps any "logo" field to "logo_1".
 */
const remapLogoField = (data: FormData): FormData => {
  const file = data.get('logo') as File | null;
  if (file) {
    data.delete('logo');
    data.append('logo_1', file);
  }
  return data;
};

export const CompanyService = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get('/companies/');
    return res.data.map(resolveBrand);
  },
  create: async (data: FormData) => {
    const res = await api.post('/companies/', remapLogoField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveBrand(res.data);
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/companies/${id}/`, remapLogoField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveBrand(res.data);
  },
  delete: async (id: string | number) => {
    await api.delete(`/companies/${id}/`);
  }
};

export default CompanyService;

