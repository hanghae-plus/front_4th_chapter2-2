import { useState } from "react";
import { Coupon } from "@/types";

// 쿠폰 목록 관리
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons([...coupons, newCoupon]);
  };

  return { coupons, addCoupon };
};