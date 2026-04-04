import { products as allProducts, type Product } from "@/data/products";

export function useProducts(): Product[] {
  return allProducts.filter((p) => p.active !== false);
}

export function useProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
