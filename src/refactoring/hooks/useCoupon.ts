import { Coupon } from '../../types.ts';
import { useState } from 'react';

// 1-2. 쿠폰 목록 나타내기
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };
  return { coupons, addCoupon };
};
