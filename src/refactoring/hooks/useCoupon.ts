import { useStorage } from './useStorage.ts';

import type { Coupon } from '../../types.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const { item: coupons, setItem: setCoupons } = useStorage('coupons', initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    const updateCoupons = [...coupons, coupon];

    setCoupons(updateCoupons);
  };

  return { coupons, addCoupon };
};
