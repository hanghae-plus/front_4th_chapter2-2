import { Coupon as CouponType } from "../../../types";

interface CouponProps extends CouponType {
  value: number;
}

const Coupon = ({ value, ...coupon }: CouponProps) => {
  return (
    <option key={coupon.code} value={value}>
      {coupon.name} - {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
    </option>
  );
}

interface CouponSelectProps {
  couponList: CouponType[];
  selectedCoupon?: CouponType;
  applyCoupon: (c: CouponType) => void;
}

export const CouponSelect = ({ couponList, selectedCoupon, applyCoupon }: CouponSelectProps) => {
  return (
    <>
      <select
        onChange={(e) => applyCoupon(couponList[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {couponList.map((coupon, index) => (
          <Coupon key={`coupon-${coupon.code}`} value={index} {...coupon} />
        ))}
      </select>
      {
        selectedCoupon && (
          <p className="text-green-600">
            적용된 쿠폰: {selectedCoupon.name}
            ({selectedCoupon.discountType === 'amount' ? `${selectedCoupon.discountValue}원` : `${selectedCoupon.discountValue}%`} 할인)
          </p>
        )
      }
    </>
  );
}