import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Coupon } from '../../../../types';
import { useCoupons } from '../model/useCoupon';

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
}

const CouponContext = createContext<CouponContextType | null>(null);

export function useCouponContext() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponStore must be used within a CouponProvider');
  }
  return context;
}

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
