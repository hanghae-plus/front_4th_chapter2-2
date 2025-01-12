import { useState } from 'react';
import { Coupon } from '../../types';

export const useCoupons = (initialCoupons: Coupon[]) => {
  return { coupons: [], addCoupon: () => undefined };
};
