import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Image URL Stabilization ──────────────────────────────────────────────────
// S3 sign-URLs change every few minutes, which breaks browser caching.
// This utility "pins" the first URL we see for an image, so the browser treats 
// it as the same resource for the duration of the session.

const IMAGE_URL_CACHE: Record<string, string> = {};

/**
 * Normalizes an S3 URL by stripping signing parameters for cache key generation,
 * then ensures we return a stable URL for the same base resource.
 */
function stabilizeUrl(url: string): string {
  if (!url.includes('X-Amz-Algorithm')) return url;
  
  try {
    const urlObj = new URL(url);
    // Base path is everything before the query params
    const basePath = urlObj.origin + urlObj.pathname;
    
    // If we already have a URL for this base path, keep using it to hit browser cache
    if (IMAGE_URL_CACHE[basePath]) {
      return IMAGE_URL_CACHE[basePath];
    }
    
    // Otherwise, store this one as the stable version for this session
    IMAGE_URL_CACHE[basePath] = url;
    return url;
  } catch (e) {
    return url;
  }
}

export function getOptimizedImageUrl(url: string | undefined | null, width = 600, height = 750): string {
  if (!url) return '';
  if (!url.startsWith('http')) return url;
  
  // 1. Stabilize the URL first so we are always requesting the same string if possible
  const stableUrl = stabilizeUrl(url);
  
  // 2. Wrap in our Django Thumbnail Proxy
  const API_BASE = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000';
  const API_PREFIX = import.meta.env.VITE_DJANGO_API_PREFIX || '/api';
  const encodedUrl = encodeURIComponent(stableUrl);
  return `${API_BASE}${API_PREFIX}/thumbnail/?url=${encodedUrl}&w=${width}&h=${height}&q=72`;
}
