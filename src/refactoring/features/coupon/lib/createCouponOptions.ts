import { Coupon } from '../../../../types';
import { SelectOption } from '../../../shared/types/SelectOption';

export const createCouponOptions = (coupons: Coupon[]): SelectOption[] => {
  return coupons.map((coupon, index) => ({
    value: index.toString(),
    label: `${coupon.name} - ${
      coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`
    }`,
  }));
};
