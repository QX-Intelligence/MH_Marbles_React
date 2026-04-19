import { springApi } from '@/lib/api';
import { JournalEntry } from '@/types/gallery';

export const BlogService = {
  getAllBlogs: async (): Promise<JournalEntry[]> => {
    try {
      const prefix = import.meta.env.VITE_SPRING_BLOG_PREFIX || '/api/blogs';
      const response = await springApi.get(`${prefix}/all`);
      return response.data || [];
    } catch (error) {
      console.error("[BlogService] Failed to fetch blogs:", error);
      return [];
    }
  },
  
  createBlog: async (blog: Omit<JournalEntry, 'id' | 'instant'>) => {
    try {
      const prefix = import.meta.env.VITE_SPRING_BLOG_PREFIX || '/api/blogs';
      const payload = {
        bulkRequest: [
          {
            title: blog.title,
            description: blog.description,
            ytUrl: blog.ytUrl
          }
        ]
      };
      const response = await springApi.post(`${prefix}/create`, payload);
      return response.data;
    } catch (error: unknown) {
      console.error("[BlogService] Failed to create blog:", error);
      const errObj = error as { response?: { data?: { message?: string } } };
      const msg = error instanceof Error ? errObj.response?.data?.message || error.message : "Failed to create blog";
      throw new Error(msg);
    }
  },

  deleteBlog: async (id: number | string) => {
    try {
      const prefix = import.meta.env.VITE_SPRING_BLOG_PREFIX || '/api/blogs';
      const response = await springApi.delete(`${prefix}/delete`, {
        data: [id]
      });
      return response.data;
    } catch (error: unknown) {
      console.error("[BlogService] Failed to delete blog:", error);
      const errObj = error as { response?: { data?: { message?: string } } };
      const msg = error instanceof Error ? errObj.response?.data?.message || error.message : "Failed to delete blog";
      throw new Error(msg);
    }
  }
};

export default BlogService;
