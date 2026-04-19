import api from '@/lib/api';
import { HeroSlide } from '@/types/gallery';

/**
 * Resolves image for a slide: backend returns image_urls[] (array).
 * We pick the first entry and expose it as the `image` convenience field.
 */
const resolveSlide = (s: HeroSlide): HeroSlide => ({
  ...s,
  image: s.image_urls?.[0] ?? s.image ?? '',
});

export const HeroCarouselService = {
  getAll: async (): Promise<HeroSlide[]> => {
    const response = await api.get('/hero_carousel/');
    const slides = Array.isArray(response.data) ? response.data : response.data.results;
    return (slides || []).map(resolveSlide);
  },

  getPublicSlides: async (): Promise<HeroSlide[]> => {
    const all = await HeroCarouselService.getAll();
    return all.filter(s => s.is_active);
  },

  create: async (data: FormData): Promise<HeroSlide> => {
    // Backend expects image_1…image_5, not "image"
    const file = data.get('image') as File | null;
    if (file) {
      data.delete('image');
      data.append('image_1', file);
    }
    const response = await api.post('/hero_carousel/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resolveSlide(response.data);
  },

  update: async (id: string | number, data: FormData): Promise<HeroSlide> => {
    // Backend expects image_1…image_5, not "image"
    const file = data.get('image') as File | null;
    if (file) {
      data.delete('image');
      data.append('image_1', file);
    }
    const response = await api.patch(`/hero_carousel/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resolveSlide(response.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/hero_carousel/${id}/`);
  },
};

export default HeroCarouselService;

