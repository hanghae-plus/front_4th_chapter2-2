// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";

export const useCart = () => {
  const [cart, setCart] = useState<Array<CartItem>>([]);
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
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
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

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const applyCouponDiscount = (
    totalBeforeDiscount: number,
    totalAfterDiscount: number,
    selectedCoupon: Coupon | null
  ) => {
    if (!selectedCoupon) {
      return {
        finalAfterDiscount: totalAfterDiscount,
        totalDiscount: totalBeforeDiscount - totalAfterDiscount,
      };
    }

    let finalAfterDiscount = totalAfterDiscount;
    if (selectedCoupon.discountType === "amount") {
      finalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      finalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }

    return {
      finalAfterDiscount,
      totalDiscount: totalBeforeDiscount - finalAfterDiscount,
    };
  };

  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
      (totals, item) => {
        const { price } = item.product;
        const { quantity } = item;
        totals.totalBeforeDiscount += price * quantity;
        const discount = item.product.discounts.reduce(
          (maxDiscount, discount) => {
            return quantity >= discount.quantity && discount.rate > maxDiscount
              ? discount.rate
              : maxDiscount;
          },
          0
        );
        totals.totalAfterDiscount += price * quantity * (1 - discount);
        return totals;
      },
      { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
    );

    const { finalAfterDiscount, totalDiscount } = applyCouponDiscount(
      totalBeforeDiscount,
      totalAfterDiscount,
      selectedCoupon
    );

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(finalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    };
  };

  return {
    cart,
    addToCart,
    applyCoupon,
    selectedCoupon,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  };
};
