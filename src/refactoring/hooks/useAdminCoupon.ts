import { useState } from 'react';
import { Coupon } from 'src/types';

interface UseAdminCouponProps {
  newCoupon: Coupon;
  handleInputChange: (field: keyof Coupon, value: string | number) => void;
  handleAddCoupon: () => void;
}

export const useAdminCoupon = (
  couponList: Coupon[],
  onCouponAdd: (newCoupon: Coupon) => void,
): UseAdminCouponProps => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleInputChange = (field: keyof Coupon, value: string | number) => {
    setNewCoupon((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCoupon = () => {
    const couponWithId = { ...newCoupon, id: `coupon-${couponList.length + 1}` };
    onCouponAdd(couponWithId);
    setNewCoupon({ name: '', code: '', discountType: 'percentage', discountValue: 0 });
  };

  return { newCoupon, handleInputChange, handleAddCoupon };
};
