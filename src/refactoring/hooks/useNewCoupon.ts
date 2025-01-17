import { useState } from 'react';
import { Coupon } from '../../types';
import { initialNewCoupon } from '../data/initData';

interface NewCouponProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const useNewCoupon = ({ onCouponAdd }: NewCouponProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialNewCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(initialNewCoupon);
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
