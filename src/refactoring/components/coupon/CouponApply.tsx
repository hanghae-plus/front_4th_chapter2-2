import { Coupon } from '@types';
import { CouponSelect } from './CouponSelect';
import { Heading } from '../shared/Heading';

interface CouponSupplyProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
}

export function CouponApply({
  coupons,
  selectedCoupon,
  applyCoupon,
}: CouponSupplyProps) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <Heading as="h2" className="text-2xl font-semibold mb-2">
        쿠폰 적용
      </Heading>
      <CouponSelect
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        coupons={coupons}
      />
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === 'amount'
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{' '}
          할인)
        </p>
      )}
    </div>
  );
}
