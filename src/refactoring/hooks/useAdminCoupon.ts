import { useState } from 'react';
import { Coupon } from 'src/types';
import { initializeNewCoupon } from '../models/admin';

interface UseAdminCouponProps {
  newCoupon: Coupon;
  handleInputChange: (field: keyof Coupon, value: string | number) => void;
  handleAddCoupon: () => void;
}

export const useAdminCoupon = (
  couponList: Coupon[],
  onCouponAdd: (newCoupon: Coupon) => void,
): UseAdminCouponProps => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initializeNewCoupon());

  const handleInputChange = (field: keyof Coupon, value: string | number) => {
    setNewCoupon((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCoupon = () => {
    const couponWithId = { ...newCoupon, id: `coupon-${couponList.length + 1}` };
    onCouponAdd(couponWithId);
    setNewCoupon(initializeNewCoupon());
  };

  return { newCoupon, handleInputChange, handleAddCoupon };
};
