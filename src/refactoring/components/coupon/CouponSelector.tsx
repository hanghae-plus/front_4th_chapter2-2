import { memo } from "react";
import { Coupon } from "../../../types";

const CouponSelector = ({
  coupons,
  selectedCoupon,
  onApplyCoupon,
}: {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}) => {
  return (
    <select
      value={
        selectedCoupon
          ? coupons.findIndex((c) => c.code === selectedCoupon.code)
          : ""
      }
      onChange={(e) =>
        onApplyCoupon(
          e.target.value === "" ? null : coupons[parseInt(e.target.value)],
        )
      }
      className="w-full p-2 border rounded mb-2"
    >
      <option value="">쿠폰 선택</option>

      {coupons.map((coupon, index) => {
        const { code, name, discountType, discountValue } = coupon;

        return (
          <option key={code} value={index}>
            {name} -{" "}
            {discountType === "amount"
              ? `${discountValue}원`
              : `${discountValue}%`}
          </option>
        );
      })}
    </select>
  );
};

export default memo(CouponSelector);
