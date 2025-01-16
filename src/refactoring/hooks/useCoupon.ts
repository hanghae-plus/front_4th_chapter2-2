import { useState } from 'react';
import { Coupon } from '../../types.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = usePreservedCallback((coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
  });

  return {
    coupons,
    addCoupon,
  };
};
