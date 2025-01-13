import { useState } from "react";
import { CartItem, Product, Coupon } from "../../types";
import { 
  getMaxApplicableDiscount, 
  calculateItemTotal, 
} from "../../refactoring/models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]); // 빈 배열로 초기화
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      // 새로운 수량이 0보다 작으면 해당 아이템 삭제
      if (newQuantity <= 0) return prevCart.filter((item) => item.product.id !== productId);
    
      return prevCart.map((item) => 
        item.product.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
          : item
      );
    });
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
    const totalBeforeDiscount = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    let totalAfterDiscount = cart.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );
  
    let totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  
    // 쿠폰이 있을 경우, 쿠폰 타입에 맞게 할인 적용
    if (!selectedCoupon) return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
  
    if (selectedCoupon.discountType === "amount") {
      // amount 방식: discountValue는 금액
      totalAfterDiscount -= selectedCoupon.discountValue;
      totalDiscount += selectedCoupon.discountValue;
      return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
    }
  
    if (selectedCoupon.discountType === "percentage") {
      // percentage 방식: discountValue는 백분율 (예: 10은 10% 할인)
      const couponDiscount = totalBeforeDiscount * (selectedCoupon.discountValue / 100);
      totalAfterDiscount -= couponDiscount;
      totalDiscount += couponDiscount;
      return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
    }

    return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
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
  };
}