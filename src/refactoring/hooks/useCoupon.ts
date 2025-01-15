import { Coupon } from "../../types.ts";
import { useState, useEffect } from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  useEffect(() => {
    if (initialCoupons) setCoupons(initialCoupons);
  }, [initialCoupons]);

  const addCoupon = (coupon: Coupon) => setCoupons([...coupons, coupon])

  return { 
    coupons, 
    addCoupon 
  };
};
