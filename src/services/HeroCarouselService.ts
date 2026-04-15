import api from '@/lib/api';
import { HeroSlide } from '@/types/gallery';

export const HeroCarouselService = {
  getAll: async (): Promise<HeroSlide[]> => {
    const response = await api.get('/hero_carousel/');
    // Handle both DRF paginated responses and direct arrays
    const slides = Array.isArray(response.data) ? response.data : response.data.results;
    return (slides || []).filter((s: HeroSlide) => s.is_active);
  },

  create: async (data: FormData): Promise<HeroSlide> => {
    const response = await api.post('/hero_carousel/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string | number, data: FormData): Promise<HeroSlide> => {
    const response = await api.patch(`/hero_carousel/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/hero_carousel/${id}/`);
  },
};

export default HeroCarouselService;
