// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity, 장바구니에서_상품빼기, 장바구니에서_상품추가 } from "../models/cart";


export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon>();

  return {
    cart,
    selectedCoupon,
    applyCoupon: setSelectedCoupon,
    calculateTotal: () => calculateCartTotal(cart, selectedCoupon),

    addToCart: (product: Product) => {
      setCart(prevCart => 장바구니에서_상품추가(prevCart, product));
    },

    removeFromCart: (productId: string) => {
      setCart((prevCart) => 장바구니에서_상품빼기(prevCart, productId));
    },

    updateQuantity: (productId: string, newQuantity: number) => {
      setCart(cart =>  updateCartItemQuantity(cart, productId, newQuantity));
    },
  } as const;
};
