import { useState } from "react";
import { CartItem, Coupon } from "../../../types";
import { calculateCartTotal } from "../../models/cart";

export const useCartDiscount = (cart: CartItem[]) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 쿠폰을 적용한다
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 장바구니 금액을 계산한다
  const calculateTotal = () => ({
    ...calculateCartTotal(cart, selectedCoupon),
  });

  return {
    selectedCoupon,
    applyCoupon,
    calculateTotal,
  };
};
