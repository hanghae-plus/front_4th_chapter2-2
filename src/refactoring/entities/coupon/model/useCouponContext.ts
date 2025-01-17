import { useContext } from 'react';
import { CouponContext } from '../../../app/providers';

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error(
      'useCouponContext must be used within CouponContextProvider',
    );
  }
  return context;
};
