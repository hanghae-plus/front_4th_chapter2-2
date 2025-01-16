import { useCart } from '@advanced/features/cart';
import { useGetCouponQuery } from '@advanced/features/coupon';
import { Heading, Select } from '@advanced/shared/ui';

export function CouponApply() {
  const { data: coupons } = useGetCouponQuery();
  const applyCoupon = useCart((state) => state.applyCoupon);
  const selectedCoupon = useCart((state) => state.selectedCoupon);

  const options = coupons.map((coupon, index) => ({
    value: index.toString(),
    label: `${coupon.name} - ${
      coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`
    }`,
  }));

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <Heading as="h2" className="text-2xl font-semibold mb-2">
        쿠폰 적용
      </Heading>
      <Select
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        options={options}
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
