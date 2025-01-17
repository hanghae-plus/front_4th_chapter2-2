import { useState } from 'react';
import { CouponType } from '../types';

/**
 * 쿠폰 관련 상태와 동작을 관리하는 커스텀 훅.
 *
 * @param {CouponType[]} initialCouponList - 초기 쿠폰 목록
 * @returns {{
 *   couponList: CouponType[],
 *   selectedCoupon: CouponType | null,
 *   addCoupon: (newCoupon: CouponType) => void,
 *   applyCoupon: (coupon: CouponType) => void
 * }} 상태 관리 함수(couponList, selectedCoupon, addCoupon, applyCoupon)를 반환
 */
export const useCoupons = (initialCouponList: CouponType[]) => {
  const [couponList, setCouponList] = useState(initialCouponList);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);

  // 새로운 쿠폰을 추가하는 함수
  const addCoupon = (newCoupon: CouponType) => {
    setCouponList((prevCouponList) => [...prevCouponList, newCoupon]);
  };

  // 쿠폰을 적용하는 함수
  const applyCoupon = (coupon: CouponType) => {
    setSelectedCoupon(coupon);
  };

  return {
    couponList,
    selectedCoupon,
    addCoupon,
    applyCoupon,
  };
};
