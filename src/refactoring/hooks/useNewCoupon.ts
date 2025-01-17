import { ChangeEvent, useState } from 'react';
import { Coupon, FormElementType } from '../../types.ts';
import { initialNewCoupon } from '../../constant.ts';

interface UseNewCouponProps {
  onCouponAdd: (coupon: Coupon) => void;
}

const useNewCoupon = ({ onCouponAdd }: UseNewCouponProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialNewCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(initialNewCoupon);
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
