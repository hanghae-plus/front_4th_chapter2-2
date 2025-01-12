// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      const updatedCart = updateCartItemQuantity(
        cart,
        product.id,
        Math.min(existingItem.quantity + 1, product.stock)
      );
      setCart(updatedCart);
    } else {
      const addedCart = [...cart, { product, quantity: 1 }];
      const updatedCart = updateCartItemQuantity(addedCart, product.id, 1);
      setCart(updatedCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = updateCartItemQuantity(cart, productId, 0);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      const updatedCart = updateCartItemQuantity(
        prevCart,
        productId,
        newQuantity
      );
      return updatedCart;
    });
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
      calculateCartTotal(cart, selectedCoupon);
    return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
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
