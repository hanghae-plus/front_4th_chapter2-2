import { Coupon } from "../../types.ts";
import { useState } from "react";

interface CouponsState {
  coupons: Array<Coupon>;
  addCoupon: (newCoupon: Coupon) => void;
}

export const useCoupons = (initialCoupons: Array<Coupon>): CouponsState => {
  const [coupons, setCoupons] = useState<Array<Coupon>>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return {
    coupons,
    addCoupon,
  };
};
