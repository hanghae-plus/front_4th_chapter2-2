import { useState } from 'react';
import { Coupon } from '../../../../types.ts';
import { calculateCartTotal } from '../lib/cart.ts';
import { ICartItem } from '../../../shared/types';

export const useCartTotal = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = (cart: ICartItem[]) => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return { selectedCoupon, applyCoupon, calculateTotal };
};
