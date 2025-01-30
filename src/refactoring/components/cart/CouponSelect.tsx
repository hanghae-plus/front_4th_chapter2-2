import React from "react";
import { Coupon } from "../../../types.ts";

interface CouponSelectorProps {
  coupons: Coupon[];
  onSelect: (coupon: Coupon) => void;
}

const CouponSelect: React.FC<CouponSelectorProps> = ({ coupons, onSelect }) => {
  return (
    <select
      onChange={(e) => onSelect(coupons[parseInt(e.target.value)])}
      className="w-full p-2 border rounded mb-2"
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon, index) => (
        <option key={coupon.code} value={index}>
          {coupon.name} -{" "}
          {coupon.discountType === "amount"
            ? `${coupon.discountValue}원`
            : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  );
};

export default CouponSelect;
