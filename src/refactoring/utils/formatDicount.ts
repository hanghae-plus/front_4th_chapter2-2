import { Coupon } from "../../types.ts";

export const formatDiscount = (coupon: Coupon) => {
  return coupon.discountType === "amount"
    ? `${coupon.discountValue}원`
    : `${coupon.discountValue}%`;
};
