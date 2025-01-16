import { Coupon } from "../../types.ts";
import { useState } from "react";

const addCouponList = (prevCoupons: Coupon[], newCoupon: Coupon): Coupon[] => {
  return [...prevCoupons, newCoupon];
}

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => addCouponList(prevCoupons, newCoupon));
  };

  return { coupons: coupons, addCoupon: handleCouponAdd };
};
