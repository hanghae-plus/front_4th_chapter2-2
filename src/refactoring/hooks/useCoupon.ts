import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  // 쿠폰을 초기화할 수 있다.
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  // 쿠폰을 추가할 수 있다.
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
  };

  return {
    coupons,
    addCoupon,
  };
};
