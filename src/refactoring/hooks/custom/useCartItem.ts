import { useState } from "react";
import { CartItem, Product } from "../../../types";

const calculateAddCart = (cart: CartItem[], product: Product) => {
  return [...cart, { product, quantity: 1 }];
};

const calculateRemoveCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

const calculateUpdateCart = (
  cart: CartItem[],
  productId: string,
  quantity: number
) => {
  return cart.map((item) => {
    if (item.product.id === productId) {
      return { ...item, quantity };
    }
    return item;
  });
};

export const useCartItem = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 장바구니에 추가한다
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart(calculateAddCart(cart, product));
    }
  };

  // 장바구니에서 제거한다
  const removeFromCart = (productId: string) => {
    setCart(calculateRemoveCart(cart, productId));
  };

  // 장바구니에서 수량을 변경한다
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(calculateUpdateCart(cart, productId, newQuantity));
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
