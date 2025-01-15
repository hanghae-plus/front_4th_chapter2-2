import { useState } from 'react';
import { Coupon } from '../../types';

/**
 * 쿠폰 목록을 관리하는 커스텀 훅
 */
export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => setCoupons(addCouponInList(coupons, newCoupon));

  return {
    coupons,
    addCoupon,
  };
};

/**
 * 새로운 쿠폰을 쿠폰 목록에 추가하는 순수 함수
 */
const addCouponInList = (coupons: Coupon[], newCoupon: Coupon) => [...coupons, newCoupon];
