import { Coupon } from '../../types.ts';
import { useAsync } from './useAsync.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useCoupons = () => {
  const { data: coupons, reRun } = useAsync({
    asyncFn: async () => {
      const result = await fetch('/coupons').then((res) => res.json());
      return result;
    },
  });

  const addCoupon = usePreservedCallback(async (coupon: Coupon) => {
    await fetch('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
    reRun();
  });

  return {
    addCoupon,
    coupons: coupons || [],
  };
};
