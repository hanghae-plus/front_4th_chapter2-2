import { useState } from "react";
import { Coupon } from "src/types";

export const useAdminCoupon = (onCouponAdd: (coupon: Coupon) => void) => {
	const [newCoupon, setNewCoupon] = useState<Coupon>({
		name: '',
		code: '',
		discountType: 'percentage',
		discountValue: 0
	});

	const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  };

	const handleInputChange = (field: keyof Coupon, value: string | number) => {
    setNewCoupon(prev => ({
      ...prev,
      [field]: value
    }));
  };

	const handleDiscountTypeChange = (type: 'amount' | 'percentage') => {
    setNewCoupon(prev => ({
      ...prev,
      discountType: type
    }));
  };

  const handleDiscountValueChange = (value: string) => {
    setNewCoupon(prev => ({
      ...prev,
      discountValue: parseInt(value) || 0
    }));
  };

	return { 
		newCoupon, 
		handleAddCoupon, 
		handleInputChange,
		handleDiscountTypeChange, 
		handleDiscountValueChange 
	};
}