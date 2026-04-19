export interface Brand {
  id: string | number;
  name: string;
  // Backend returns logo_urls[] (array of presigned S3 URLs)
  logo_urls?: string[];
  logo_keys?: string[];
  // Convenience: first logo URL (resolved in mappers)
  logo?: string;
  image_url?: string;
  description?: string;
  created_at?: string;
}

export interface Collection {
  id: string | number;
  name: string;
  description: string;
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  image_keys?: string[];
  // Backend also returns products as an array of IDs
  products?: number[];
  // Convenience alias resolved in mappers
  cover_image?: string;
}

export interface MediaEntry {
  id: string | number;
  heading: string;
  subtext: string;
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  // Convenience alias
  image?: string;
  cta_text: string;
  cta_link: string;
  is_active?: boolean;
  order: number;
}

export interface JournalEntry {
  id: string | number;
  title: string;
  description: string;
  ytUrl?: string;
  image_urls?: string[];
  instant?: string;
}

export interface ContactInquiry {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface HeroSlide {
  id: number;
  // Backend returns image_urls[] (array of presigned S3 URLs)
  image_urls?: string[];
  // Convenience: first url, resolved in service layer
  image?: string;
  heading: string;
  subtext: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  order: number;
}

export type Message = ContactInquiry;
