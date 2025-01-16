import { useState } from "react";
import { Coupon } from "../../../../types";
import { INITIAL_COUPON } from "../../../constants/initialData";

export const useCouponManager = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(INITIAL_COUPON);

  const handleCouponChange = (
    field: keyof Coupon,
    value: string | number | "amount" | "percentage"
  ) => {
    setNewCoupon((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(INITIAL_COUPON);
  };

  return {
    newCoupon,
    handleCouponChange,
    handleAddCoupon,
  };
};
