import { Coupon } from '../../types';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  // 새로운 쿠폰 추가
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  // 현재 쿠폰 상태와 추가 함수 반환
  return { coupons, addCoupon };
};
