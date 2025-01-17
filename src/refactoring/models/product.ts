import { Product, Discount } from "../../types";

export function addDiscountToProduct(
  product: Product,
  discount: Discount
): Product {
  return {
    ...product,
    discounts: [...product.discounts, discount],
  };
}