import { useState } from 'react';
import { Coupon } from '../../types';

/**
 * 쿠폰 관련 상태와 동작을 관리하는 커스텀 훅.
 *
 * @param {Coupon[]} initialCouponList - 초기 쿠폰 목록
 * @returns {{
 *   coupons: Coupon[],
 *   selectedCoupon: Coupon | null,
 *   addCoupon: (newCoupon: Coupon) => void,
 *   applyCoupon: (coupon: Coupon) => void
 * }} 상태 관리 함수(coupons, selectedCoupon, addCoupon, applyCoupon)를 반환
 */

export const useCoupons = (initialCouponList: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCouponList);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 새로운 쿠폰을 추가하는 함수
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCouponList) => [...prevCouponList, newCoupon]);
  };

  // 쿠폰을 적용하는 함수
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    applyCoupon,
  };
};
