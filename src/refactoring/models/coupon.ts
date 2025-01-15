import { Coupon } from "../../types";

  // 쿠폰 적용한 값
  export const getCouponDiscount = (coupon: Coupon, afterDiscountPrice: number) => {
    if (coupon.discountType === 'amount') {
      afterDiscountPrice = Math.max(
        0,
        afterDiscountPrice - coupon.discountValue,
      );
    } else {
      afterDiscountPrice *= 1 - coupon.discountValue / 100;
    }

    return afterDiscountPrice;
  };