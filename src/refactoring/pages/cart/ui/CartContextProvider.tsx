import { ICartItem, IProduct } from '../../../shared/types';
import React, { createContext } from 'react';
import { useCart } from '../../../entities/cart/model';

export interface ICartContext {
  cart: ICartItem[];
  addToCart: (item: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

export const CartContext = createContext<ICartContext | undefined>(undefined);

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartContext.Provider value={useCart()}>{children}</CartContext.Provider>
  );
}
