import { useState } from "react";
import { Coupon } from "../../types";


export const useCoupon = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateCouponDiscount = (total:number): number => {
    if (!selectedCoupon) return 0;

    if (selectedCoupon.discountType === "amount") {
      return Math.min(total, selectedCoupon.discountValue)
    }

    if (selectedCoupon.discountType === "percentage") {
      return total * (selectedCoupon.discountValue / 100);
    }

    return 0;
  };

  return {
    selectedCoupon,
    applyCoupon,
    calculateCouponDiscount,
  };
};