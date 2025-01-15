import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal } from "../models/cart";

/**
 * 장바구니 관리 훅
 * @returns 장바구니 목록, 장바구니 추가 함수, 장바구니 삭제 함수, 장바구니 수량 업데이트 함수, 쿠폰 적용 함수, 총 금액 계산 함수
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const isExistProduct = cart.find((item) => item.product.id === product.id);

    if (isExistProduct)
      return updateQuantity(product.id, isExistProduct.quantity + 1);

    setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity:
              newQuantity <= item.product.stock ? newQuantity : item.quantity,
          };
        }
        return item;
      })
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
