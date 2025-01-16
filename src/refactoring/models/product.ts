import { CartItem, Product } from '../../types';

/**
 * 재고를 계산하는 함수
 */
export const calculateRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);

  return product.stock - (cartItem?.quantity || 0);
};

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
