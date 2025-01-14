import { ChangeEvent, useState } from 'react';
import { Coupon, FormElementType } from '../../types.ts';

interface UseNewCouponProps {
  onCouponAdd: (coupon: Coupon) => void;
}

const useNewCoupon = ({ onCouponAdd }: UseNewCouponProps) => {
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

  const handleChangeCoupon =
    <T extends keyof Coupon>(key: T) =>
    (e: ChangeEvent<FormElementType>) => {
      const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;

      setNewCoupon((prev) => ({
        ...prev,
        [key]: value as Coupon[T],
      }));
    };

  return {
    newCoupon,
    handleAddCoupon,
    handleChangeName: handleChangeCoupon('name'),
    handleChangeCode: handleChangeCoupon('code'),
    handleChangeDiscountType: handleChangeCoupon('discountType'),
    handleChangeDiscountValue: handleChangeCoupon('discountValue'),
  };
};

export default useNewCoupon;
