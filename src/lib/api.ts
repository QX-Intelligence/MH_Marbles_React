import axios from 'axios';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000';
const DJANGO_API_PREFIX = import.meta.env.VITE_DJANGO_API_PREFIX || '/api';
const SPRING_URL = import.meta.env.VITE_SPRING_URL || 'http://localhost:8080';
const SPRING_API_PREFIX = import.meta.env.VITE_SPRING_API_PREFIX || '/api';

// Default instance for Django (Inventory, Products, etc.)
export const api = axios.create({
  baseURL: `${DJANGO_URL}${DJANGO_API_PREFIX}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Second instance for Spring Boot (Auth, Journal, etc.)
export const springApi = axios.create({
  baseURL: `${SPRING_URL}${SPRING_API_PREFIX}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor for Django API (to handle 401s via Spring Refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Django can return 401 or 403 when credentials are missing/invalid
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Authenticated sessions are managed by Spring Boot
        await axios.post(`${SPRING_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Response Interceptor for Spring API (to handle 401s via silent refresh)
springApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the request fails with 401 and it's not already a retry or a refresh attempt
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => springApi(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${SPRING_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return springApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails, we might want to redirect to login or clear auth state
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
