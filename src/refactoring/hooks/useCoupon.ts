import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons); // 전체 쿠폰 리스트
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null); // 선택한 쿠폰

  // 쿠폰 추가
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCouponList((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  return {
    coupons: couponList,
    addCoupon: handleAddCoupon,
    selectedCoupon,
    applyCoupon,
  };
};
