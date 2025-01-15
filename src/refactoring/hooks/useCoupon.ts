import { useState } from "react";
import { Coupon } from "../../types.ts";

/**
 * 쿠폰 관리 훅
 * @param initialCoupons 초기 쿠폰 목록
 * @returns 쿠폰 목록, 쿠폰 추가 함수
 */
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { coupons, addCoupon };
};
