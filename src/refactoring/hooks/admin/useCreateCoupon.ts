import { useState } from 'react';
import { Coupon } from '../../models/types/Coupon';

const initialCoupon: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
};

type Arguments = {
  onCouponAdd: (newCoupon: Coupon) => void;
};

export const useCreateCoupon = ({ onCouponAdd }: Arguments) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(initialCoupon);
  };

  const handleUpdateNewCouponName = (name: string) => {
    setNewCoupon({ ...newCoupon, name });
  };

  const handleUpdateNewCouponCode = (code: string) => {
    setNewCoupon({ ...newCoupon, code });
  };

  const handleUpdateNewCouponDiscountType = (
    discountType: 'amount' | 'percentage',
  ) => {
    setNewCoupon({ ...newCoupon, discountType });
  };

  const handleUpdateNewCouponDiscountValue = (discountValue: number) => {
    setNewCoupon({ ...newCoupon, discountValue });
  };

  return {
    newCoupon,
    handlers: {
      handleAddCoupon,
      handleUpdateNewCouponName,
      handleUpdateNewCouponCode,
      handleUpdateNewCouponDiscountType,
      handleUpdateNewCouponDiscountValue,
    },
  };
};
