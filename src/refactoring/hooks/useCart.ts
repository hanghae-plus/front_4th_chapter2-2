// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity, 장바구니에서_상품빼기, 장바구니에서_상품추가 } from "../models/cart";


export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, applyCoupon] = useState<Coupon>();

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  const addToCart = (product: Product) => {
    setCart(prevCart => 장바구니에서_상품추가(prevCart, product));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => 장바구니에서_상품빼기(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(cart =>  updateCartItemQuantity(cart, productId, newQuantity));
  };

  return {
    cart,
    selectedCoupon,
    applyCoupon,
    calculateTotal,
    addToCart,
    removeFromCart,
    updateQuantity
  } as const;
};
