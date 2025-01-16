import { Product, Discount } from "../../types";

export const updateProductWithNewDiscount = (product: Product, discount: Discount): Product => {
  return {
    ...product,
    discounts: [...product.discounts, discount]
  };
};

export const removeDiscountFromProduct = (product: Product, discountIndex: number): Product => {
  const updatedDiscounts = [...product.discounts];
  updatedDiscounts.splice(discountIndex, 1);
  return {
    ...product,
    discounts: updatedDiscounts
  };
};

export const updateProductStock = (product: Product, newStock: number): Product => {
  return {
    ...product,
    stock: newStock
  };
};
