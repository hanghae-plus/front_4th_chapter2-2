// useCart.ts
import { useState } from 'react';
import { CartItem, Product } from '../shared/types/types';
import { calculateCartTotal, updateCartItemQuantity } from '../features/cart/lib/cart';
import { useCouponStore } from '../entities/coupon/model/useCouponStore';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { selectedCoupon } = useCouponStore();

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const maxQuantity = item.product.stock;
            const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
            return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null),
    );

    updateCartItemQuantity(cart, productId, newQuantity);
  };

  const calculateTotal = () => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
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
        totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
      }
      totalDiscount = totalBeforeDiscount - totalAfterDiscount;
    }

    calculateCartTotal(cart, selectedCoupon);

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    };
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  };
};
