import { api } from '@/lib/api';
import { Collection } from '@/types/gallery';

/**
 * Backend returns image_urls[] (array). Resolve first entry as cover_image.
 */
const resolveCollection = (c: Collection): Collection => ({
  ...c,
  cover_image: c.image_urls?.[0] ?? c.cover_image,
});

/**
 * Backend expects image_1…image_5 for uploads, not "image" or "cover_image".
 */
const remapImageField = (data: FormData): FormData => {
  for (const field of ['image', 'cover_image']) {
    const file = data.get(field) as File | null;
    if (file) {
      data.delete(field);
      data.append('image_1', file);
      break;
    }
  }
  return data;
};

export const CollectionService = {
  getAll: async (): Promise<Collection[]> => {
    const res = await api.get('/collections/');
    return res.data.map(resolveCollection);
  },
  create: async (data: FormData) => {
    const res = await api.post('/collections/', remapImageField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveCollection(res.data);
  },
  update: async (id: string | number, data: FormData) => {
    const res = await api.patch(`/collections/${id}/`, remapImageField(data), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resolveCollection(res.data);
  },
  delete: async (id: string | number) => {
    await api.delete(`/collections/${id}/`);
  }
};

export default CollectionService;

