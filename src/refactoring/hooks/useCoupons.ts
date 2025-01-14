import { useState } from "react";
import { Coupon } from "../../types";

export const useCoupons = (initialCoupons: Coupon[] = []) => {
  // 쿠폰 목록 관리
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  // 새로운 쿠폰 추가
  const addCoupon = (coupon: Coupon) => {
    if (!coupon || !coupon.discountType) {
      return;
    }

    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  return {
    coupons,
    addCoupon,
  };
};