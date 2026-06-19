import { useQuery } from "@tanstack/react-query";
import { listProducts, getProduct, getVariants } from "@/data/products";
import { listCategories } from "@/data/categories";
import { listHeroSlides } from "@/data/banners";
import { getSettings } from "@/data/settings";
import { countPendingOrders } from "@/data/orders";
import type { Product, Category, HeroSlide, StoreSettings } from "@/lib/types";

export function useProducts(opts?: { all?: boolean }) {
  return useQuery({
    queryKey: ["products", opts?.all ? "all" : "published"],
    queryFn: () => listProducts({ data: { all: !!opts?.all } }) as Promise<Product[]>,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct({ data: { id } }) as Promise<Product | null>,
    enabled: !!id,
  });
}

export function useVariants(id: string) {
  return useQuery({
    queryKey: ["variants", id],
    queryFn: () => getVariants({ data: { id } }) as Promise<Product[]>,
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories() as Promise<Category[]>,
  });
}

export function useHeroSlides(opts?: { all?: boolean }) {
  return useQuery({
    queryKey: ["hero_slides", opts?.all ? "all" : "active"],
    queryFn: () => listHeroSlides({ data: { all: !!opts?.all } }) as Promise<HeroSlide[]>,
  });
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ["store_settings"],
    queryFn: () => getSettings() as Promise<StoreSettings | null>,
  });
}

export function usePendingOrderCount(enabled: boolean) {
  return useQuery({
    queryKey: ["orders-pending-count"],
    queryFn: () => countPendingOrders() as Promise<number>,
    enabled,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
}
