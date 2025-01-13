import { useState } from "react";
import { Coupon } from "../../types";

export const useCoupons = (initialCoupons: Coupon[] = []) => {
  // 쿠폰 목록 관리
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  // 선택된 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 새로운 쿠폰 추가
  const addCoupon = (coupon: Coupon) => {
    if (!coupon || !coupon.discountType) {
      console.warn("잘못된 쿠폰! :", coupon);
      return;
    }

    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  // 쿠폰 선택
  const applyCoupon = (coupon: Coupon) => {
    if (!coupon || !coupon.discountType) {
      console.warn("잘못된 쿠폰! :", coupon);
      return;
    }

    setSelectedCoupon(coupon);
  };

  // 쿠폰 할인 계산
  const calculateCouponDiscount = (total: number): number => {
    if (!selectedCoupon) return 0;

    if (selectedCoupon.discountType === "amount") {
      return Math.min(total, selectedCoupon.discountValue);
    }

    if (selectedCoupon.discountType === "percentage") {
      return total * (selectedCoupon.discountValue / 100);
    }

    return 0;
  };

  return {
    coupons,
    selectedCoupon,
    applyCoupon,
    calculateCouponDiscount,
    addCoupon,
  };
};