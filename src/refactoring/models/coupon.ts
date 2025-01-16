import { Coupon } from '../../types';

export const getInitialCoupon = (): Coupon => ({
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
});
