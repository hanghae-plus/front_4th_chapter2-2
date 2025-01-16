import { useCouponForm } from '@/refactoring/pages/Admin/CouponManagement/components/CouponAddForm/hooks/useCouponForm';
import type { Coupon } from '@/types';

interface CouponAddFormProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAddForm = ({ onCouponAdd }: CouponAddFormProps) => {
  const { editingCoupon, updateName, updateCode, updateDiscountType, updateDiscountValue, init } = useCouponForm();

  const handleAddCoupon = () => {
    onCouponAdd(editingCoupon);
    init();
  };

  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={editingCoupon.name}
        onChange={e => updateName(e.target.value)}
        className="w-full rounded border p-2"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={editingCoupon.code}
        onChange={e => updateCode(e.target.value)}
        className="w-full rounded border p-2"
      />

      <div className="flex gap-2">
        <select
          value={editingCoupon.discountType}
          onChange={e => updateDiscountType(e.target.value as 'amount' | 'percentage')}
          className="w-full rounded border p-2"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={editingCoupon.discountValue}
          onChange={e => updateDiscountValue(parseInt(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>

      <button onClick={handleAddCoupon} className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600">
        쿠폰 추가
      </button>
    </div>
  );
};
