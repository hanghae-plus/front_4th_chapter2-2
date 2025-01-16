// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니에 제품을 추가해야 합니다.
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
      return;
    }
    setCart((cartItem) => [...cartItem, { product, quantity: 1 }]);
  };

  // 장바구니에서 제품을 제거해야 합니다.
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((cartItem: Product) => cartItem.product.id !== productId));
  };

  // 제품 수량을 업데이트해야 합니다.
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // 쿠폰을 적용해야지
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 합계를 정확하게 계산해야 합니다.
  const calculateTotal = () => {
    // 할인 전 총액 계산
    const totalBeforeDiscount = cart.reduce(
      (totalPrice, cartItem) => totalPrice + cartItem.product.price * cartItem.quantity,
      0,
    );

    // 할인 금액
    const totalDiscount = selectedCoupon
      ? Math.min(
          selectedCoupon.discountType === 'percentage'
            ? totalBeforeDiscount * (selectedCoupon.discountValue / 100)
            : selectedCoupon.discountValue,
        )
      : 0;

    // 최종 금액
    const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

    return {
      totalBeforeDiscount,
      totalAfterDiscount,
      totalDiscount,
    };
  };

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
