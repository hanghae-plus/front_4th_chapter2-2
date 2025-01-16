import { ICartItem, ICoupon, IProduct } from '../../shared/types';
import React, { createContext } from 'react';
import { useCart } from '../cart/model';

export interface ICartContextType {
  cart: ICartItem[];
  addToCart: (item: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: ICoupon) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  selectedCoupon: ICoupon | null;
}

export const CartContext = createContext<ICartContextType | undefined>(
  undefined,
);

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartContext.Provider value={useCart()}>{children}</CartContext.Provider>
  );
}
