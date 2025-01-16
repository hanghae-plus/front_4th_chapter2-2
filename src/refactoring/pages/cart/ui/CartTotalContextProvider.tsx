import { ICartItem, ICoupon } from '../../../shared/types';
import { createContext, useContext } from 'react';
import { useCartTotal } from '../model/useCartTotal.ts';

export interface ICartTotalContext {
  applyCoupon: (coupon: ICoupon) => void;
  calculateTotal: (cart: ICartItem[]) => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  selectedCoupon: ICoupon | null;
}

export const CartTotalContext = createContext<ICartTotalContext | undefined>(
  undefined,
);

export const useCartTotalContext = () => {
  const context = useContext(CartTotalContext);
  if (!context) {
    throw new Error(
      'useCartTotalContext must be used within CartTotalContextProvider',
    );
  }
  return context;
};

export function CartTotalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartTotalContext.Provider value={useCartTotal()}>
      {children}
    </CartTotalContext.Provider>
  );
}
