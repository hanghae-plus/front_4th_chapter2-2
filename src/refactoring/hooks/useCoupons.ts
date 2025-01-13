import { useState } from "react";
import { Coupon } from "../../types";


export const useCoupons = (initialCoupons: Coupon[] = []) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, coupon]);
  };

  const applyCoupon = (coupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, coupon]);
  };

  const calculateCouponDiscount = (total:number): number => {
    if (!coupons) return 0;

    return coupons.reduce((acc, coupon) => {
      if (coupon.discountType === "amount") {
        return acc + Math.min(total, coupon.discountValue);
      }

      if (coupon.discountType === "percentage") {
        return acc + total * (coupon.discountValue / 100);
      }

      return acc;
    }, 0);

    return 0;
  };

  return {
    coupons,
    applyCoupon,
    calculateCouponDiscount,
    addCoupon,
  };
};