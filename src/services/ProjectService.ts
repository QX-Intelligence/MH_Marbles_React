import { springApi } from '@/lib/api';
import { JournalEntry } from '@/types/gallery';

const YT_TAG_REGEX = /\[yt:(.*?)\]$/;

export const ProjectService = {
  /**
   * Fetch all projects and map them to JournalEntry format
   */
  getAll: async (): Promise<JournalEntry[]> => {
    try {
      // Spring endpoint for projects
      const response = await springApi.get('/api/spring/projects/get-all', {
        params: { size: 100 } // Fetch more for the archive
      });
      
      const brands = response.data || [];
      
      return brands.map((p: any) => {
        // Extract ytUrl from description if present
        let description = p.description || '';
        let ytUrl = undefined;
        
        const match = description.match(YT_TAG_REGEX);
        if (match) {
          ytUrl = match[1];
          description = description.replace(YT_TAG_REGEX, '').trim();
        }

        return {
          id: p.id,
          title: p.title,
          description: description,
          ytUrl: ytUrl,
          image_urls: p.imageUrls || [],
          instant: p.createdAt
        };
      });
    } catch (error) {
      console.error("[ProjectService] Failed to fetch projects:", error);
      return [];
    }
  },

  /**
   * Upload a new project with multiple images and optional YouTube URL
   */
  upload: async (data: { title: string; description: string; ytUrl?: string; images: File[] }) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      
      // Embed ytUrl in description
      let finalDescription = data.description;
      if (data.ytUrl) {
        finalDescription += ` [yt:${data.ytUrl}]`;
      }
      formData.append('description', finalDescription);
      
      // Append images
      data.images.forEach(image => {
        formData.append('images', image);
      });

      const response = await springApi.post('/api/spring/projects/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error: any) {
      console.error("[ProjectService] Upload failed:", error);
      throw new Error(error.response?.data?.message || "Failed to upload project");
    }
  },

  /**
   * Delete a project
   */
  delete: async (id: string | number) => {
    try {
      const response = await springApi.delete(`/api/spring/projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("[ProjectService] Delete failed:", error);
      throw new Error(error.response?.data?.message || "Failed to delete project");
    }
  }
};

export default ProjectService;
