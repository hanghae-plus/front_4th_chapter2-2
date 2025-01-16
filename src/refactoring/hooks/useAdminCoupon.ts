import { useState } from 'react';
import { INITIAL_COUPON_STATE } from '../data/initialData';
import { Coupon } from '../../types';

interface UpdateFields {
  name?: string;
  code?: string;
  discountType?: 'amount' | 'percentage';
  discountValue?: number;
}

export const useAdminCoupon = () => {
  const [newCoupon, setNewCoupon] = useState(INITIAL_COUPON_STATE);

  const handleClearCoupon = () => {
    setNewCoupon(INITIAL_COUPON_STATE);
  };

  const handleEditCoupon = (newCoupon: Coupon, fields: UpdateFields) => {
    setNewCoupon({ ...newCoupon, ...fields });
  };

  return {
    newCoupon,
    handleEditCoupon,
    handleClearCoupon,
  };
};
