import { Product, Discount } from "../../types";

export const updateProduct = (product: Product, updates: Partial<Product>): Product => {
  return { ...product, ...updates };
};

export const filterDiscounts = (discounts: Discount[], indexToRemove: number): Discount[] => {
  return discounts.filter((_, index) => index !== indexToRemove);
};