import { ICoupon } from '../../shared/types';
import { createContext } from 'react';
import { useCoupons } from '../../widgets/coupon/model';

const initialCoupons: ICoupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export interface ICouponContext {
  coupons: ICoupon[];
  addCoupon: (coupon: ICoupon) => void;
}

export const CouponContext = createContext<ICouponContext | undefined>(
  undefined,
);

export const CouponContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CouponContext.Provider value={useCoupons(initialCoupons)}>
      {children}
    </CouponContext.Provider>
  );
};
