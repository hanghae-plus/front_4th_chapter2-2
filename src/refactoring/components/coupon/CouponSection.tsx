import { memo } from "react";
import { Coupon } from "../../../types";
import CouponSelector from "./CouponSelector";

const CouponSection = ({
  coupons,
  selectedCoupon,
  onApplyCoupon,
}: {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}) => {
  return (
    <>
      <CouponSelector
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        onApplyCoupon={onApplyCoupon}
      />

      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === "amount"
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{" "}
          할인)
        </p>
      )}
    </>
  );
};

export default memo(CouponSection);
