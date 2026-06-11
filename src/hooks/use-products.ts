import { useQuery } from "@tanstack/react-query";
import { listProducts, getProduct } from "@/data/products";
import { listCategories } from "@/data/categories";
import { getSettings } from "@/data/settings";
import type { Product, Category, StoreSettings } from "@/lib/types";

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

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories() as Promise<Category[]>,
  });
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ["store_settings"],
    queryFn: () => getSettings() as Promise<StoreSettings | null>,
  });
}
