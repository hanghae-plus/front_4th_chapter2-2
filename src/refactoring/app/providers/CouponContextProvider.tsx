import { ICoupon } from '../../shared/types';
import { createContext } from 'react';
import { useCoupons } from '../../widgets/coupon/model';

export interface ICouponContext {
  coupons: ICoupon[];
  addCoupon: (coupon: ICoupon) => void;
}

export const CouponContext = createContext<ICouponContext | undefined>(
  undefined,
);

export const CouponContextProvider = ({
  initialCoupons,
  children,
}: {
  initialCoupons: ICoupon[];
  children: React.ReactNode;
}) => {
  const couponContextValue = useCoupons(initialCoupons);

  return (
    <CouponContext.Provider value={couponContextValue}>
      {children}
    </CouponContext.Provider>
  );
};
