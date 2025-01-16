import { Coupon } from '../../../../types';
import { formatCouponDiscount } from '../../product/helpers/\bindex';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
}

export const CouponSelector = ({ coupons, selectedCoupon, onApplyCoupon }: CouponSelectorProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <select
        onChange={(e) => onApplyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
        data-testid="coupon-selector"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} - {formatCouponDiscount(coupon)}
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}({formatCouponDiscount(selectedCoupon)} 할인)
        </p>
      )}
    </div>
  );
};
