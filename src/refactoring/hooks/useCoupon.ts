import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCouponList((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { couponList, addCoupon };
};
