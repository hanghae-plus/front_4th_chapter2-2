import { CartItem } from "../types";

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id !== productId) return item;

      // 수량 검증 및 제한
      const validQuantity = Math.max(
        0,
        Math.min(newQuantity, item.product.stock)
      );

      // 유효하지 않은 수량이면 해당 아이템 제거
      if (validQuantity <= 0) return null;

      // 유효한 수량이면 업데이트
      return {
        ...item,
        quantity: validQuantity,
      };
    })
    .filter((item): item is CartItem => item !== null);
};
