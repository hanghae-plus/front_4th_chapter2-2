import { Coupon } from '../../../../types';
import { createContext, useContext } from 'react';

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
}

export const CouponContext = createContext<CouponContextType | null>(null);

export function useCouponContext() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponStore must be used within a CouponProvider');
  }
  return context;
}
