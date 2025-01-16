import { useForm } from '@/refactoring/hooks';
import type { Coupon } from '@/types';

export const useCouponForm = () => {
  const {
    value: editingCoupon,
    updateValue,
    init
  } = useForm<Coupon>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0
  });

  const updateName = (name: string) => {
    updateValue('name', name);
  };

  const updateCode = (code: string) => {
    updateValue('code', code);
  };

  const updateDiscountType = (discountType: 'amount' | 'percentage') => {
    updateValue('discountType', discountType);
  };

  const updateDiscountValue = (discountValue: number) => {
    updateValue('discountValue', discountValue);
  };

  return { editingCoupon, updateName, updateCode, updateDiscountType, updateDiscountValue, init };
};
