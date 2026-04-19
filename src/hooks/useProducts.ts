import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import ProductService from '@/services/ProductService';
import CompanyService from '@/services/CompanyService';
import CategoryService from '@/services/CategoryService';
import { QUERY_KEYS } from '@/lib/queryClient';
import { Brand } from '@/types/gallery';
import { Category } from '@/services/CategoryService';
import { Tile, initialTiles } from '@/data/tiles';

// ─── Helper: Map raw backend products with brand/category names ───────────────
const mapProducts = (products: Tile[], brands: Brand[], categories: Category[]): Tile[] => {
  const brandMap = new Map(brands.map(b => [String(b.id), b.name]));
  const catMap = new Map(categories.map(c => [String(c.id), c.name]));
  return products.map(product => ({
    ...product,
    brand: brandMap.get(String(product.company)) || String(product.company || 'Unknown'),
    category_name: catMap.get(String(product.category)) || 'Unknown',
  }));
};

// ─── Brands Hook ─────────────────────────────────────────────────────────────
export const useBrands = () => useQuery({
  queryKey: QUERY_KEYS.brands,
  queryFn: () => CompanyService.getAll(),
  staleTime: 10 * 60 * 1000, // Brands change rarely → 10 min fresh
  gcTime: 60 * 60 * 1000,
});

// ─── Categories Hook ──────────────────────────────────────────────────────────
export const useCategories = () => useQuery({
  queryKey: QUERY_KEYS.categories,
  queryFn: () => CategoryService.getCategories(),
  staleTime: 10 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
});

// ─── Products Hook (paginated flat list) ─────────────────────────────────────
export const useProducts = () => {
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: async () => {
      const res = await ProductService.getProducts();
      const mapped = mapProducts(res.results || [], brands, categories);
      return {
        tiles: mapped.length > 0 ? mapped : initialTiles,
        backendTiles: mapped,
        nextPageUrl: res.next,
      };
    },
    enabled: true,
  });
};

// ─── Infinite Products Hook (for Collection page) ────────────────────────────
export const useInfiniteProducts = () => {
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.products, 'infinite'],
    queryFn: async ({ pageParam }) => {
      const params = pageParam ? { cursor: pageParam as string } : {};
      const res = await ProductService.getProducts(params);
      return {
        tiles: mapProducts(res.results || [], brands, categories),
        nextCursor: res.next ? new URL(res.next).searchParams.get('cursor') : null,
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: brands.length > 0 || categories.length >= 0,
  });
};

// ─── Featured Products Hook ───────────────────────────────────────────────────
export const useFeaturedProducts = () => {
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  return useQuery({
    queryKey: [...QUERY_KEYS.products, 'featured'],
    queryFn: async () => {
      const res = await ProductService.getFeatured();
      return mapProducts(res || [], brands, categories);
    },
    enabled: true,
  });
};

// ─── Product Mutations ────────────────────────────────────────────────────────
export const useProductMutations = () => {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.products });
  };

  const addProduct = useMutation({
    mutationFn: (data: FormData) => ProductService.saveProduct(data),
    onSuccess: invalidate,
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: FormData }) => {
      data.append('id', String(id));
      return ProductService.saveProduct(data);
    },
    onSuccess: invalidate,
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string | number) => ProductService.deleteProduct(id),
    onSuccess: invalidate,
  });

  return { addProduct, updateProduct, deleteProduct };
};

// ─── Brand Mutations ──────────────────────────────────────────────────────────
export const useBrandMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.brands });

  const addBrand = useMutation({ mutationFn: (data: FormData) => CompanyService.create(data), onSuccess: invalidate });
  const updateBrand = useMutation({ mutationFn: ({ id, data }: { id: string | number; data: FormData }) => CompanyService.update(id, data), onSuccess: invalidate });
  const deleteBrand = useMutation({ mutationFn: (id: string | number) => CompanyService.delete(id), onSuccess: invalidate });

  return { addBrand, updateBrand, deleteBrand };
};

// ─── Category Mutations ───────────────────────────────────────────────────────
export const useCategoryMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categories });

  const addCategory = useMutation({ mutationFn: (data: FormData) => CategoryService.addCategory(data), onSuccess: invalidate });
  const updateCategory = useMutation({ mutationFn: ({ id, data }: { id: string | number; data: FormData }) => CategoryService.updateCategory(id, data), onSuccess: invalidate });
  const deleteCategory = useMutation({ mutationFn: (id: string | number) => CategoryService.deleteCategory(id), onSuccess: invalidate });

  return { addCategory, updateCategory, deleteCategory };
};
