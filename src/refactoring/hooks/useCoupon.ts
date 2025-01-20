import { Coupon } from '../../types';
import { useState } from 'react';

export const useCoupons = (initialCouponList: Coupon[]) => {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCouponList);

  // 새로운 쿠폰 추가
  const addCoupon = (newCoupon: Coupon) => {
    setCouponList((prevCouponList) => [...prevCouponList, newCoupon]);
  };

  // 현재 쿠폰 상태와 추가 함수 반환
  return { couponList, addCoupon };
};
