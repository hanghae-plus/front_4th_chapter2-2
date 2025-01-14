import { useState } from "react";
import { CartItem, Product, Coupon } from "../../types";
import { 
  calculateCartTotal,
  calculateItemTotal,
  getMaxApplicableDiscount,
  updateCartItemQuantity 
} from "../../refactoring/models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]); // 빈 배열로 초기화
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => 
      // 새로운 수량이 0보다 작으면 해당 아이템 삭제
      updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  const addToCart = (product: Product) => {
    const existItem = cart.find((item) => item.product.id === product.id);
    if (existItem) {
      updateQuantity(product.id, existItem.quantity + 1);
      return;
    }

    setCart([...cart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    return discounts.reduce(
      (maxDiscount, discount) =>
        quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount,
      0
    );
  };
 
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
};

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    calculateItemTotal,
    getMaxApplicableDiscount,
    getRemainingStock,
    getAppliedDiscount,
    applyCoupon,
    selectedCoupon,
    setSelectedCoupon,
  };
}