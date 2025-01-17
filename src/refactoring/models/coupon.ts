import { Coupon } from '../../types';

export const formatCouponDescription = (coupon: Coupon) => {
  return coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`;
};

export const getDiscountPercent = (discountValue: number) => {
  return (discountValue * 100).toFixed(0);
};
