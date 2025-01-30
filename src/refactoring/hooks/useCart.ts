// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateTotal } from "../utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);

    return product.stock - (cartItem?.quantity || 0);
  };

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock),
              }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // 장바구니 내 상품 수량 조절 가능
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const maxQuantity = item.product.stock;
            const updatedQuantity = Math.max(
              0,
              Math.min(newQuantity, maxQuantity)
            );
            return updatedQuantity > 0
              ? { ...item, quantity: updatedQuantity }
              : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  // 위치를 변경할 수 없는건가, 아니면 적용 대상이 다른건가?
  // 할인 쿠폰을 선택하면 적용하면 최종 결제 금액에 할인정보가 반영
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal(cart, selectedCoupon);

  return {
    cart,
    addToCart,
    getRemainingStock,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};
