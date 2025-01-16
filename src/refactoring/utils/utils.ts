import { Coupon } from "../../types";

export const formatPrice = (price: number) => {
  return `${price.toLocaleString()}원`;
};
