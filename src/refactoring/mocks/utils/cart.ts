import { CartItem, Product } from "../../models/cart/types";

export const getRemainingStock = (product: Product, cartItems: CartItem[]) => {
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  return product.stock - quantityInCart;
};

export const validateCartOperation = (
  product: Product,
  cartItems: CartItem[],
  quantity: number
) => {
  const remainingStock = getRemainingStock(product, cartItems);
  if (quantity > remainingStock) {
    throw new Error("재고가 부족합니다");
  }
  if (quantity < 0) {
    throw new Error("수량은 0보다 작을 수 없습니다");
  }
};
