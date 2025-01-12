import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => ({
  coupons: [],
  addCoupon: () => undefined,
});
