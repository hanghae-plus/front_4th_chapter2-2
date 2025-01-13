// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    // 쿠폰 적용
    setSelectedCoupon(coupon);
    // 쿠폰 적용 금액 계산
  };

  const calculateTotal = () => {
    // 할인 전 총액 계산
    const totalBeforeDiscount = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // 쿠폰 할인액 계산
    const totalDiscount = selectedCoupon
      ? Math.min(
          selectedCoupon.discountType === 'percentage'
            ? totalBeforeDiscount * (selectedCoupon.discountValue / 100)
            : selectedCoupon.discountValue,
        )
      : 0;

    // 최종 결제 금액
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
