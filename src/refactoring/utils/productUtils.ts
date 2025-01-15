import { Discount, Product } from '../../types';

/**
 * 상품 수정: 할인 추가
 */
export const addDiscountToProduct = (product: Product, newDiscount: Discount): Product => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
});

/**
 * 상품 수정: 할인 제거
 */
export const removeDiscountFromProduct = (product: Product, discountIndex: number): Product => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== discountIndex),
});

/**
 * 상품 업데이트
 */
export const updateProductField = (
  product: Product,
  field: keyof Product,
  value: unknown,
): Product => ({
  ...product,
  [field]: value,
});

/**
 * 상품 제목 생성
 */
export const getProductTitle = (product: Product) =>
  `${product.name} - ${product.price}원 (재고: ${product.stock})`;

/**
 * 상품 수정 중인지 확인
 */
export const isProductEditing = (
  editingProduct: Product | null,
  productId: Product['id'],
): editingProduct is Product => editingProduct !== null && editingProduct.id === productId;
