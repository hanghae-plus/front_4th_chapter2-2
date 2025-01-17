import { Coupon } from "../../types.ts";
import { useState } from "react";

const calculateAddCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  return [...coupons, newCoupon];
};

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(calculateAddCoupon(coupons, newCoupon));
  };

  return { coupons, addCoupon };
};
