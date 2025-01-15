// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
 
  // 카트 물품 추가 로직
  const addToCart = (product: Product) => {
    if (getRemainingStock(product) <= 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (!existingItem) return [...prevCart, { product, quantity: 1 }];

      return prevCart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    });
  };

  // 카트 물품 삭제 로직
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // 카트 물품 업데이트 로직
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const maxQuantity = item.product.stock;
          const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
          return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null)
    );
  };

  // 물품 쿠폰 추가 로직
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;
  
    cart.forEach(item => {
      const { price } = item.product;
      const { quantity } = item;
      totalBeforeDiscount += price * quantity;
  
      const discount = item.product.discounts.reduce((maxDiscount, d) => {
        return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
      }, 0);
  
      totalAfterDiscount += price * quantity * (1 - discount);
    });
  
    let totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  
    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
      }
      totalDiscount = totalBeforeDiscount - totalAfterDiscount;
    }
    
    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount)
    };
  }

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  }

  const getRemainingStock = (product: Product) => {
    return product.stock - (cart.find(item => item.product.id === product.id)?.quantity || 0);
  }

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  return {
    cart,
    selectedCoupon,
    addToCart,
    applyCoupon,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getMaxDiscount,
    getRemainingStock,
    getAppliedDiscount
  };
};
