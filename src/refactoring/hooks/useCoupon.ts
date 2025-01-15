import { useLocalStorage } from './useLocalStorage.ts';

import type { Coupon } from '../../types.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const { storageItem: coupons, setItem: setCoupons } = useLocalStorage('coupons', initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    const updateCoupons = [...coupons, coupon];

    setCoupons(updateCoupons);
  };

  return { coupons, addCoupon };
};
