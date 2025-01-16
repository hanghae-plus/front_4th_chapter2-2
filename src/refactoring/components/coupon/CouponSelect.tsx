import { Coupon } from '@types';
import { Select } from '../shared/Select';

interface CouponSelectProps {
  coupons: Coupon[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function CouponSelect({ coupons, onChange }: CouponSelectProps) {
  const options = coupons.map((coupon, index) => ({
    value: index.toString(),
    label: `${coupon.name} - ${
      coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`
    }`,
  }));

  return <Select options={options} onChange={onChange} />;
}
