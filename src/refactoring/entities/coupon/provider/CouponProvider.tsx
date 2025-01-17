import { ReactNode, useMemo } from 'react';
import { Coupon } from '../../../../types';
import { useCoupons } from '../model/useCoupon';
import { CouponContext } from '../model/useCouponContext';

export function CouponProvider({
  children,
  initialCoupons,
}: {
  children: ReactNode;
  initialCoupons: Coupon[];
}) {
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const value = useMemo(
    () => ({
      coupons,
      addCoupon,
    }),
    [coupons, addCoupon],
  );

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
}
