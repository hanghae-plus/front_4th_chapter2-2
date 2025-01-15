import { useState } from 'react';
import { Coupon } from '../../types';

interface NewCouponProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const useNewCoupon = ({ onCouponAdd }: NewCouponProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleAddNewCouponName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, name: e.target.value });
  };

  const handleAddNewCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, code: e.target.value });
  };

  const handleAddNewCouponDiscountType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCoupon({ ...newCoupon, discountType: e.target.value as 'amount' | 'percentage' });
  };

  const handleAddNewCouponDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) });
  };

  return {
    newCoupon,
    handleAddCoupon,
    handleAddNewCouponName,
    handleAddNewCouponCode,
    handleAddNewCouponDiscountType,
    handleAddNewCouponDiscountValue,
  };
};
