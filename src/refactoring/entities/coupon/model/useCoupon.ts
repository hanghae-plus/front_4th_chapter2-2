import { useState } from 'react';
import { Coupon } from '../../../../types.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);

  const calculateNewCoupon = (coupon: Coupon) => {
    return [...coupons, coupon];
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(calculateNewCoupon(coupon));
  };

  return { coupons, addCoupon };
};
