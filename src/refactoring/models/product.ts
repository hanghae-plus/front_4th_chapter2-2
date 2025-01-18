import { Product } from "../../types.ts"

// 상품 최고 할인율
export const calculateProductMaxDiscountRate = (product: Product) => {
  return product.discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}
