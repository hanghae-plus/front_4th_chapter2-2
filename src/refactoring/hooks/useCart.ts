import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types.ts";
import { calculateCartTotal, updateCartItemQuantity } from "../utils/cart.ts";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 카트 물품 추가 로직
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // 카트 물품 삭제 로직
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // 카트 물품 업데이트 로직
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  }

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  // 물품 쿠폰 추가 로직
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return {
    cart,
    selectedCoupon,

    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,

    addToCart,
    applyCoupon,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getRemainingStock
  };
};
