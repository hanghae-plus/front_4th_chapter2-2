import { ICartItem, ICoupon } from '../../../shared/types';
import { createContext } from 'react';
import { useCartTotal } from '../../../entities/cart/model/useCartTotal.ts';

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
