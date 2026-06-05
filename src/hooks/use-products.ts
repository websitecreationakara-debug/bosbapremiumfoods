import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/data/products";
import { listCategories } from "@/data/categories";
import { getSettings } from "@/data/settings";
import type { Product, Category, StoreSettings } from "@/lib/types";

export function useProducts(opts?: { all?: boolean }) {
  return useQuery({
    queryKey: ["products", opts?.all ? "all" : "published"],
    queryFn: () => listProducts({ data: { all: !!opts?.all } }) as Promise<Product[]>,
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
