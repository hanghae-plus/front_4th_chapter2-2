import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCouponList = (initialCouponList: Coupon[]) => {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCouponList);

  const addCoupon = (newCoupon: Coupon) => {
    setCouponList((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { couponList, addCoupon };
};
