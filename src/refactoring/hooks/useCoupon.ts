import { Coupon } from "../../types.ts";
import { useCallback, useState } from "react";

interface CouponsState {
  coupons: Array<Coupon>;
  addCoupon: (newCoupon: Coupon) => void;
}

export const useCoupons = (initialCoupons: Array<Coupon>): CouponsState => {
  const [coupons, setCoupons] = useState<Array<Coupon>>(initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  }, []);

  return {
    coupons,
    addCoupon,
  };
};
