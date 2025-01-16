import { Select } from '@advanced/shared/ui';
import { useGetCouponQuery } from '../model';

export function CouponSelect() {
  const { data: coupons } = useGetCouponQuery();

  const options = coupons.map((coupon, index) => ({
    value: index.toString(),
    label: `${coupon.name} - ${
      coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`
    }`,
  }));

  return <Select options={options} />;
}
