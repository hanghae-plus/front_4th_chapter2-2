import { Coupon } from '../../../types';
import { useForm } from '../../hooks';

interface CouponFormProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

function CouponForm({ onCouponAdd }: CouponFormProps) {
  const {
    formState: couponFormState,
    resetForm: resetCouponForm,
    enterFormHandler: enterCouponForm
  } = useForm<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleAddCoupon = () => {
    onCouponAdd(couponFormState);
    resetCouponForm();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="쿠폰 이름"
            value={couponFormState.name}
            onChange={e => enterCouponForm('name', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="쿠폰 코드"
            value={couponFormState.code}
            onChange={e => enterCouponForm('code', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={couponFormState.discountType}
              onChange={e => enterCouponForm('discountType', e.target.value as 'percentage' | 'amount')}
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              type="number"
              placeholder="할인 값"
              value={couponFormState.discountValue}
              onChange={e => enterCouponForm('discountValue', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button onClick={handleAddCoupon} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            쿠폰 추가
          </button>
        </div>
      </div>
    </div>
  );
}

export { CouponForm };
