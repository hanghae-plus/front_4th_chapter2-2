import { useState } from 'react';
import { Coupon } from '../../types';

/**
 * 쿠폰 목록을 관리하는 커스텀 훅
 */
export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => setCoupons((coupons) => [...coupons, newCoupon]);

  return {
    coupons,
    addCoupon,
  };
};
