import { useState } from "react";
import { Coupon } from "../../types";

export const useNewCoupon = () => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const setNewCouponName = (name: string) => {
    setNewCoupon({ ...newCoupon, name });
  };

  const setNewCouponCode = (code: string) => {
    setNewCoupon({ ...newCoupon, code });
  };

  const setNewCouponDiscountType = (discountType: "amount" | "percentage") => {
    setNewCoupon({
      ...newCoupon,
      discountType,
    });
  };

  const setNewCouponDiscountValue = (discountValue: number) => {
    setNewCoupon({
      ...newCoupon,
      discountValue,
    });
  };

  const resetNewCoupon = () => {
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  return {
    newCoupon,
    setNewCouponName,
    setNewCouponCode,
    setNewCouponDiscountType,
    setNewCouponDiscountValue,
    resetNewCoupon,
  };
};
