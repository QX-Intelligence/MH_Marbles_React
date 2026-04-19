import React, { createContext, useContext, useCallback } from 'react';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Tile, SanitaryItem, initialTiles } from '@/data/tiles';
import { useAuth } from '@/contexts/AuthContext';
import { Brand, Collection, MediaEntry, JournalEntry, Message } from '@/types/gallery';
import { Category } from '@/services/CategoryService';
import { QUERY_KEYS } from '@/lib/queryClient';

// ─── Query Hooks ─────────────────────────────────────────────────────────────
import { useBrands, useCategories, useProducts, useProductMutations, useBrandMutations, useCategoryMutations } from '@/hooks/useProducts';
import { useSanitary, useSanitaryCategories, useSanitaryMutations, useMedia, useMediaMutations, useCollections, useCollectionMutations, useMessages, useMessageMutations, useJournal, useJournalMutations } from '@/hooks/useDataHooks';

// ─── Context Type (identical public interface — zero breaking changes) ─────────
interface GalleryContextType {
  tiles: Tile[];
  backendTiles: Tile[];
  addTile: (data: FormData) => Promise<void>;
  updateTile: (id: string | number, data: FormData) => Promise<void>;
  deleteTile: (id: string | number) => Promise<void>;

  brands: Brand[];
  addBrand: (data: FormData) => Promise<void>;
  updateBrand: (id: string | number, data: FormData) => Promise<void>;
  deleteBrand: (id: string | number) => Promise<void>;

  categories: Category[];
  addCategory: (data: FormData) => Promise<void>;
  updateCategory: (id: string | number, data: FormData) => Promise<void>;
  deleteCategory: (id: string | number) => Promise<void>;

  collections: Collection[];
  addCollection: (data: FormData) => Promise<void>;
  updateCollection: (id: string | number, data: FormData) => Promise<void>;
  deleteCollection: (id: string | number) => Promise<void>;

  sanitary: SanitaryItem[];
  sanitaryCategories: Category[];
  addSanitary: (data: FormData) => Promise<void>;
  updateSanitary: (id: string | number, data: FormData) => Promise<void>;
  deleteSanitary: (id: string | number) => Promise<void>;

  media: MediaEntry[];
  addMedia: (data: FormData) => Promise<void>;
  updateMedia: (id: string | number, data: FormData) => Promise<void>;
  deleteMedia: (id: string | number) => Promise<void>;

  journal: JournalEntry[];
  addJournal: (data: { title: string; description: string; ytUrl?: string; images: File[] }) => Promise<void>;
  deleteJournal: (id: string | number) => Promise<void>;

  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'created_at'>) => Promise<Message>;
  markMessageRead: (id: string | number) => Promise<void>;
  deleteMessage: (id: string | number) => Promise<void>;

  refreshAll: () => Promise<void>;
  nextPageUrl: string | null;
  loadMoreTiles: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = useQueryClient();
  const { isLoggedIn } = useAuth();

  // ─── Data Queries ───────────────────────────────────────────────────────────
  const { data: brandsData = [] } = useBrands();
  const { data: categoriesData = [] } = useCategories();
  const { data: productsData } = useProducts();
  const { data: sanitaryData = [] } = useSanitary();
  const { data: sanitaryCategoriesData = [] } = useSanitaryCategories();
  const { data: mediaData = [] } = useMedia();
  const { data: collectionsData = [] } = useCollections();
  const { data: messagesData = [] } = useMessages();
  const { data: journalData = [] } = useJournal();

  // ─── Mutation Hooks ─────────────────────────────────────────────────────────
  const { addProduct, updateProduct, deleteProduct } = useProductMutations();
  const { addBrand, updateBrand, deleteBrand } = useBrandMutations();
  const { addCategory, updateCategory, deleteCategory } = useCategoryMutations();
  const { addSanitary, updateSanitary, deleteSanitary } = useSanitaryMutations();
  const { addMedia, updateMedia, deleteMedia } = useMediaMutations();
  const { addCollection, updateCollection, deleteCollection } = useCollectionMutations();
  const { addMessage: addMsg, deleteMessage: delMsg } = useMessageMutations();
  const { addJournal: addJournalMutation, deleteJournal: delJournal } = useJournalMutations();

  // ─── refreshAll: Invalidate everything (admin-level hard refresh) ───────────
  const refreshAll = useCallback(async () => {
    await qc.invalidateQueries();
  }, [qc]);

  // ─── Infinite scroll state from paginated products ──────────────────────────
  const nextPageUrl = productsData?.nextPageUrl ?? null;
  const loadMoreTiles = useCallback(async () => {
    if (!nextPageUrl) return;
    // Re-fetch with next cursor — TanStack Query will merge results via GalleryContext state
    const cursor = new URL(nextPageUrl).searchParams.get('cursor');
    const { ProductService } = await import('@/services/ProductService');
    const response = await ProductService.getProducts(cursor ? { cursor } : {});
    const brandMap = new Map(brandsData.map(b => [String(b.id), b.name]));
    const catMap = new Map(categoriesData.map(c => [String(c.id), c.name]));
    const newProducts = (response.results || []).map(product => ({
      ...product,
      brand: brandMap.get(String(product.company)) || String(product.company || 'Unknown'),
      category_name: catMap.get(String(product.category)) || 'Unknown',
    }));
    // Merge into cache
    qc.setQueryData(QUERY_KEYS.products, (old: typeof productsData) => ({
      tiles: [...(old?.tiles ?? []), ...newProducts],
      backendTiles: [...(old?.backendTiles ?? []), ...newProducts],
      nextPageUrl: response.next,
    }));
  }, [nextPageUrl, brandsData, categoriesData, qc, productsData]);

  // ─── Context value — identical surface API as before ───────────────────────
  const value: GalleryContextType = {
    // Products
    tiles: productsData?.tiles ?? initialTiles,
    backendTiles: productsData?.backendTiles ?? [],
    addTile: async (data) => { await addProduct.mutateAsync(data); },
    updateTile: async (id, data) => { await updateProduct.mutateAsync({ id, data }); },
    deleteTile: async (id) => { await deleteProduct.mutateAsync(id); },

    // Brands
    brands: brandsData as Brand[],
    addBrand: async (data) => { await addBrand.mutateAsync(data); },
    updateBrand: async (id, data) => { await updateBrand.mutateAsync({ id, data }); },
    deleteBrand: async (id) => { await deleteBrand.mutateAsync(id); },

    // Categories
    categories: categoriesData as Category[],
    addCategory: async (data) => { await addCategory.mutateAsync(data); },
    updateCategory: async (id, data) => { await updateCategory.mutateAsync({ id, data }); },
    deleteCategory: async (id) => { await deleteCategory.mutateAsync(id); },

    // Collections
    collections: collectionsData as Collection[],
    addCollection: async (data) => { await addCollection.mutateAsync(data); },
    updateCollection: async (id, data) => { await updateCollection.mutateAsync({ id, data }); },
    deleteCollection: async (id) => { await deleteCollection.mutateAsync(id); },

    // Sanitary
    sanitary: sanitaryData as SanitaryItem[],
    sanitaryCategories: sanitaryCategoriesData as Category[],
    addSanitary: async (data) => { await addSanitary.mutateAsync(data); },
    updateSanitary: async (id, data) => { await updateSanitary.mutateAsync({ id, data }); },
    deleteSanitary: async (id) => { await deleteSanitary.mutateAsync(id); },

    // Media
    media: mediaData as MediaEntry[],
    addMedia: async (data) => { await addMedia.mutateAsync(data); },
    updateMedia: async (id, data) => { await updateMedia.mutateAsync({ id, data }); },
    deleteMedia: async (id) => { await deleteMedia.mutateAsync(id); },

    // Journal / Projects
    journal: journalData as JournalEntry[],
    addJournal: async (data) => { await addJournalMutation.mutateAsync(data); },
    deleteJournal: async (id) => { await delJournal.mutateAsync(id); },

    // Messages
    messages: messagesData as Message[],
    addMessage: async (msg) => {
      const result = await addMsg.mutateAsync(msg as Parameters<typeof addMsg.mutateAsync>[0]);
      return result as Message;
    },
    markMessageRead: async (id) => {
      await api.patch(`/contacts/${id}/`, { is_read: true });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.messages });
    },
    deleteMessage: async (id) => { await delMsg.mutateAsync(id); },

    // Pagination
    refreshAll,
    nextPageUrl,
    loadMoreTiles,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) throw new Error('useGallery must be used within a GalleryProvider');
  return context;
};
