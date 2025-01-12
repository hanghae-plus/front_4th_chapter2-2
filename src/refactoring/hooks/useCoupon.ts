import { Coupon } from "../../types.ts";
import { useState } from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon[]>(initialCoupons);

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon((prevCoupons) => [...prevCoupons, coupon]);
  };

  return { 
    coupons: selectedCoupon, 
    addCoupon: applyCoupon 
  };
};
