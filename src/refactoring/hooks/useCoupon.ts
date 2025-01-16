import { Coupon } from "../../types.ts";
import { useCallback, useState } from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  }, []);

  return {
    coupons,
    addCoupon,
  };
};
